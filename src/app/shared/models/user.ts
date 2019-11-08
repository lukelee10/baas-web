export interface BaaSUser {
  UserId: string;
  Firstname: string;
  Lastname: string;
  Group: string;
  IsAdmin: boolean;
  Role: string;
  Disabled: boolean;
  GUID?: string;
}
