export interface RequestDetails {
  RequestId: string;
  VettingSystems: VettingSystem[];
  Alert?: Alert;
  ImageClassification: string;
  Modality: string;
  Filename: string;
  Status: string;
  RequestLogs?: RequestLog[];
  ImageUrl: string;
}

export interface Alert {
  Level: string;
  Message: string;
}

export interface RequestLog {
  Timestamp: string;
  Message: string;
}

export interface VettingSystem {
  SystemName: string;
  POC: Poc[];
  IdFieldName: string;
  Ids: string[];
  Status: string;
  SubmissionDate: string;
  ResponseDate: string;
  Alerts?: Alert[];
  Errors?: Error[];
}

export interface Error {
  Code: string;
  Message: string;
}

export interface Poc {
  Label: string;
  Value: string;
  Remarks?: string;
}
