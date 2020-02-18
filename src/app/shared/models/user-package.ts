export interface UserPackage {
  PackageId: string;
  Created: Date;
  Name: string;
  RequestCount: number;
}

export interface UserPackageResponse {
  count: number;
  lastItem: string;
  packages: UserPackage[];
}
