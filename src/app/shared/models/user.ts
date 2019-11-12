export interface BaaSUser {
  UserId: string;
  Fullname: string;
  Group: string;
  IsAdmin: boolean;
  Role: string;
  Disabled: boolean;
  GUID?: string;
}
