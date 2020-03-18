export interface PackageRequestResponse {
  count: number;
  lastItem: string;
  requests: Request[];
}

export interface Request {
  Modality: string;
  Comments?: string;
  PackageId: string;
  GlobalAccess: number;
  Systems: string[];
  Status: string;
  MimeType: string;
  Classification: string;
  Group: string;
  FileName: string;
  Created: Date;
  Results: Results[];
  StatusTimestamp: Date;
  FileSize: number;
  User: string;
  Id: string;
  Name: string;
  ImageUrl: string;
  StatusPrecedence?: number;
}

// TODO   This needs to be refactored to avoid hard-coding the vetting systems here
export interface Results {
  System: string;
}
