import { FlatTreeControl } from '@angular/cdk/tree';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener
} from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { AwsLambdaService } from 'src/app/core/services/aws-lambda.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

/**
 * Node for to-do item
 */
export class GroupNode {
  children?: GroupNode[];
  fqn: string;
  constructor(public item: string, public parent?: string) {}
}

/** Flat to-do item node with expandable and level information */
export class GroupFlatNode {
  item: string;
  level: number;
  expandable: boolean;
  fqn: string;
}

const digOffspring = (groupMap, fqn) => {
  const parentName = fqn.split('/').slice(-1)[0];
  const children = groupMap.get(parentName);
  if (children) {
    children.forEach(childNode => {
      childNode.fqn = `${fqn}/${childNode.item}`;
      childNode.children = digOffspring(groupMap, childNode.fqn);
    });
  }
  return children;
};

/**
 * @title Tree with insert and save
 */
@Component({
  selector: 'app-group-management',
  templateUrl: './group-management.component.html',
  styleUrls: ['./group-management.component.scss']
})
export class GroupManagementComponent implements OnInit {
  @Input() addActionOn = false;
  @Output() selectGroup = new EventEmitter();
  changeWatcher = new BehaviorSubject<GroupNode[]>([]);

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<GroupFlatNode, GroupNode>();
  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<GroupNode, GroupFlatNode>();

  treeControl: FlatTreeControl<GroupFlatNode>;
  treeFlattener: MatTreeFlattener<GroupNode, GroupFlatNode>;
  dataSource: MatTreeFlatDataSource<GroupNode, GroupFlatNode>;
  dialogValue = '';
  dialogRef: MatDialogRef<any, any>;
  isDialogOrg = true;

  constructor(
    private awsLambdaService: AwsLambdaService,
    private notificationService: NotificationService,
    public dialog: MatDialog
  ) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<GroupFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    this.changeWatcher.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  ngOnInit() {
    const getOrgs = this.awsLambdaService.getOrgs();
    getOrgs.subscribe(orgs => {
      // orgMap  maps of root org names -> org (name, [children])
      const orgMap = new Map();
      // groupMap maps the name of the group -> org (name, [children], parent(optional))
      const groupMap = new Map();

      // array of root orgs with groups to be inside children
      const orgList = [];

      // loop through the subscribed orgs array, creating orgMap and groupMap
      for (const item of orgs.Items) {
        if (!item.Parent) {
          const orgNode = { item: item.OrgId, type: 'org', children: null };
          orgMap.set(item.OrgId, orgNode);
        } else {
          const parentName = item.Parent;
          const groupNode = {
            item: item.OrgId,
            type: 'group',
            parent: parentName
          };

          if (!groupMap.has(parentName)) {
            groupMap.set(parentName, []);
          }
          groupMap.get(parentName).push(groupNode);
        }
      }

      // given the orgMap of roots, and groupMap of nodes, I would sew the children to their parents
      for (const orgName of orgMap.keys()) {
        const node = orgMap.get(orgName);
        node.fqn = orgName;
        node.children = digOffspring(groupMap, orgName);
      }

      // sort the org names map
      const orgMapSorted = new Map([...orgMap.entries()].sort());
      for (const orgName of orgMapSorted.keys()) {
        orgList.push(orgMapSorted.get(orgName));
      }

      this.changeWatcher.next(orgList);
    });
  }

  getLevel = (node: GroupFlatNode) => node.level;

  isExpandable = (node: GroupFlatNode) => node.expandable;

  getChildren = (node: GroupNode): GroupNode[] => node.children;

  hasChild = (_: number, nodeData: GroupFlatNode) => nodeData.expandable;

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: GroupNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.item === node.item
        ? existingNode
        : new GroupFlatNode();
    flatNode.item = node.item;
    flatNode.fqn = node.fqn;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /**
   * Save to API, if succssful, fish up the nestedNode from map and add a new node.
   * Also do house cleaning so the node would expand correctly
   * @param name is the name of the new group
   * @param flatNode is the parent node
   */
  addNewNodeUnder(flatNode: GroupFlatNode, name: string) {
    const newOrg = {
      org: { parentName: flatNode ? flatNode.fqn : null, name }
    };
    this.awsLambdaService.createOrg(newOrg).subscribe(
      (data: any) => {
        this.notificationService.successful(`Group saved ${data.name}`);
        const parentNode = this.flatNodeMap.get(flatNode);
        if (!parentNode.children) {
          parentNode.children = [];
        }

        const childGroupNode = new GroupNode(name, parentNode.item);
        const sChildFqn = ((flatNode.fqn || '') + `/${name}`).replace(
          /^[/]+/g,
          ''
        );
        childGroupNode.fqn = sChildFqn;

        parentNode.children.push(childGroupNode);

        const temp = this.changeWatcher.value;
        this.changeWatcher.next([]);
        this.changeWatcher.next(temp);
        this.treeControl.expand(flatNode);
      },
      error => {
        this.notificationService.error(`Saving group failed. ${error}`);
      }
    );
  }

  /**
   * Save eto API, if successful, add the new nestedNode
   * @param name is the given name of new org
   */
  addNewNode(name: string) {
    const newOrg = {
      org: { parentName: null, name }
    };
    this.awsLambdaService.createOrg(newOrg).subscribe(
      (data: any) => {
        this.notificationService.successful(`Organization saved ${data.name}`);
        this.changeWatcher.value.push(new GroupNode(name));
        this.changeWatcher.next(this.changeWatcher.value);
      },
      error => {
        this.notificationService.error(`Saving Organization failed. ${error}`);
      }
    );
  }

  askGroupNameAndAddRoot(templateRef: TemplateRef<any>) {
    this.isDialogOrg = true;
    this.dialogRef = this.dialog.open(templateRef);
    this.dialogRef.afterClosed().subscribe(newName => {
      if (newName) {
        this.addNewNode(newName);
      }
      this.dialogValue = '';
    });
  }

  askGroupNameAndAddToNode(
    templateRef: TemplateRef<any>,
    flatNode: GroupFlatNode
  ) {
    this.isDialogOrg = false;
    this.dialogRef = this.dialog.open(templateRef);
    this.dialogRef.afterClosed().subscribe(newName => {
      if (newName) {
        this.addNewNodeUnder(flatNode, newName);
      }
      this.dialogValue = '';
    });
  }
  selectNode(flatNode) {
    this.selectGroup.emit(flatNode);
  }
}
