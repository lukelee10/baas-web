export interface UserPackage {
  PackageId: string;
  Created: Date;
  Name: string;
  RequestCount: number;
  User: string;
  Group: string;
}

export interface UserPackageResponse {
  count: number;
  lastItem: string;
  packages: UserPackage[];
}
