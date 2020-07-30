import { FlatTreeControl } from '@angular/cdk/tree';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MatSlideToggleChange
} from '@angular/material';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener
} from '@angular/material/tree';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { AwsLambdaService } from 'src/app/core/services/aws-lambda.service';
import { UserService } from 'src/app/core/services/user.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { BaaSGroup } from 'src/app/shared/models/user';
import { NotificationService } from 'src/app/shared/services/notification.service';

/**
 * Node for to-do item
 */
export class GroupNode {
  children?: GroupNode[];
  fqn: string;
  disabled: boolean;
  constructor(public item: string, public parent?: string) {}
}

/** Flat to-do item node with expandable and level information */
export class GroupFlatNode {
  item: string;
  level: number;
  expandable: boolean;
  fqn: string;
  disabled: boolean;
}

/**
 * @title Tree with insert and save
 */
@Component({
  selector: 'app-group-management',
  templateUrl: './group-management.component.html',
  styleUrls: ['./group-management.component.scss']
})
export class GroupManagementComponent implements OnInit {
  // TODO Consider renaming addActionOn; it is used for "Disable" & "Rename" too
  @Input() addActionOn = false;
  @Output() selectGroup = new EventEmitter();
  changeWatcher = new BehaviorSubject<GroupNode[]>([]);
  showSpinner = false;
  entity = new FormControl('');

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

  // TODO We don't need isAddOrgOn; we can directly use the addActionOn ie.,
  // Input param for this component; clean all the references for isAddOrgOn
  isAddOrgOn = false;

  constructor(
    private awsLambdaService: AwsLambdaService,
    private notificationService: NotificationService,
    private userService: UserService,
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
    this.isAddOrgOn = this.userService.IsAdmin && this.addActionOn;
    this.getOrgs();
  }

  getOrgs(): Observable<any> {
    const getOrgs = this.awsLambdaService.getOrgs();
    getOrgs.subscribe((orgs: BaaSGroup[]) => {
      const digKids = (groups = []) =>
        groups.map(({ group, subgroups, _GUID, disabled }) => ({
          item: group,
          children: digKids(subgroups),
          fqn: _GUID,
          disabled
        }));
      // const fqn = this.userService.Group;
      const list = orgs.map(org => ({
        item: org.group,
        children: digKids(org.subgroups),
        fqn: org._GUID,
        disabled: org.disabled
      }));
      this.changeWatcher.next(list);
    });
    return getOrgs;
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
    flatNode.disabled = node.disabled;
    flatNode.expandable = node.children && node.children.length > 0;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /**
   * Save to API, if successful, fish up the nestedNode from map and add a new node.
   * Also do house cleaning so the node would expand correctly
   * @param name is the name of the new group
   * @param flatNode is the parent node
   */
  addNewNodeUnder(flatNode: GroupFlatNode, name: string) {
    const newOrg = {
      org: { parentName: flatNode.fqn, name }
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

  renameNode(flatNode: GroupFlatNode, name: string) {
    this.showSpinner = true;

    const oldFqn = flatNode.fqn || '';
    // const renamedFqn = oldFqn.replace(oldFqn.substring(oldFqn.lastIndexOf('/')),'/' + name);
    const fqnTokens = oldFqn.split('/');

    // Remove old name & insert new name
    fqnTokens.pop();
    fqnTokens.push(name);
    const renamedFqn = fqnTokens.join('/');
    const renamedOrg = {
      oldName: flatNode.fqn,
      name: renamedFqn
    };
    let userMessage = 'Successfully Updated the Group Name';

    this.awsLambdaService.updateOrg(renamedOrg).subscribe(
      (data: any) => {
        this.notificationService.successful(userMessage);
        // this.ngOnInit();
        this.getOrgs().subscribe(() => {
          const temp = this.changeWatcher.value;
          this.changeWatcher.next([]);
          this.changeWatcher.next(temp);
          for (const key of this.flatNodeMap.keys()) {
            if (renamedFqn.includes(key.fqn)) {
              this.treeControl.expand(key);
            }
          }
        });
      },
      error => {
        userMessage =
          'An error occurred while Updating the Group Name. Please try again.';
        this.notificationService.error(userMessage);
        this.showSpinner = false;
      },
      () => (this.showSpinner = false)
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
        const orgNode = new GroupNode(name);
        orgNode.fqn = name;
        this.changeWatcher.value.push(orgNode);
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
    this.entity.markAsPristine();
    this.entity.clearValidators();
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
    this.entity.markAsPristine();
    this.entity.clearValidators();
    this.dialogRef.afterClosed().subscribe(newName => {
      if (newName) {
        this.addNewNodeUnder(flatNode, newName);
      }
      this.dialogValue = '';
    });
  }
  askGroupNameAndRenameNode(
    templateRef: TemplateRef<any>,
    flatNode: GroupFlatNode
  ) {
    this.isDialogOrg = false;
    this.dialogValue = flatNode.item;
    this.dialogRef = this.dialog.open(templateRef);
    this.dialogRef.afterClosed().subscribe(newName => {
      if (newName) {
        this.renameNode(flatNode, newName);
      }
      this.dialogValue = '';
    });
  }
  selectNode(flatNode) {
    this.selectGroup.emit(flatNode);
  }
  toggleDisable(event: MatSlideToggleChange, group: any): void {
    console.log('toggleDisable ', event);
    const disabledFlag: boolean = event.checked;
    const handler = result => {
      if (!result) {
        event.source.checked = !disabledFlag;
        group.disabled = !disabledFlag;
        this.flatNodeMap.get(group).disabled = !disabledFlag;
      }
    };
    if (disabledFlag) {
      // User is disabling the given Group
      // Get user confirmation of this important action
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Confirm Disable',
          message: 'Are you sure you want to disable this Group?'
        }
      });
      dialogRef.afterClosed().subscribe(confirmResult => {
        if (confirmResult) {
          // User Confirmed
          this.disableLambda(group, disabledFlag).subscribe(handler);
        } else {
          // User Not Confirmed
          handler(false);
        }
      });
    } else {
      // disabledFlag: false, User is enabling the given Group
      this.disableLambda(group, disabledFlag).subscribe(handler);
    }
  }

  private disableLambda(group: any, disableFlag: boolean): Observable<boolean> {
    this.showSpinner = true;
    const groupToDisable = {
      oldName: group.fqn,
      disabled: disableFlag
    };
    const groupName = group.item;
    let userMessage = `Successfully ${
      disableFlag ? 'disabled' : 'enabled'
    } the Group: ${groupName}`;

    // https://blog.angular-university.io/rxjs-error-handling/
    return this.awsLambdaService.disableOrg(groupToDisable).pipe(
      map(() => {
        this.notificationService.successful(userMessage);
        group.disabled = disableFlag;
        this.flatNodeMap.get(group).disabled = disableFlag;
        return true;
      }),
      catchError(() => {
        userMessage = `An error occurred while ${
          disableFlag ? 'disabling' : 'enabling'
        } the Group: ${groupName}. Please try again.   `;
        this.notificationService.error(userMessage);
        this.showSpinner = false;
        return of(false);
      }),
      finalize(() => (this.showSpinner = false))
    );
  }

  attachEvents() {
    this.entity.setValidators([Validators.required]);
  }
}
