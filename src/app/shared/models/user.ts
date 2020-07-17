export interface BaaSUser {
  username: string;
  fullname: string;
  firstname: string;
  lastname: string;
  group: string | any;
  isAdmin?: boolean;
  role: string;
  isDisabled: boolean;
  GUID?: string;
}
export interface BaaSGroup {
  group: string;
  disabled?: boolean;
  subgroups: BaaSGroup[];
  parent: string; // parent name
}
