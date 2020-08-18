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
  /** Filename */
  name: string;
  /**
   * ID of the MatFileUploadComponent.
   * This value will be returned as-is in the response to associate Requests.
   */
  clientSideAssociationId: string | number;
}

export interface SavedPackageModel {
  /** UUID of overall Package. Generated on server-side. */
  PackageId: string;
  Requests: SavedRequestModel[];
}

export interface SavedRequestModel {
  /** UUID of individual request. Generated on server-side. */
  RequestId: string;
  /** Presigned S3 Upload URL. */
  UploadUrl: string;
  /** ID value of the Request as it appeared in createRequest payload. */
  ClientSideAssociationId: string | number;
}
