export interface PackageModel {
  packageName: string;
  systems?: string[];
  titleClassification?: string;
  requests: RequestModel[];
}

export interface RequestModel {
  fileSize: number;
  imageClassification?: string;
  isUSPerson?: boolean;
  mimeType: string;
  modality: string;
  name: string;
}

export interface SavedPackageModel {
  PackageId: string;
  Requests: SavedRequestModel[];
}

export interface SavedRequestModel {
  RequestId: string;
  UploadUrl: string;
}
