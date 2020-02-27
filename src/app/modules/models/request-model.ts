export interface RequestModel {
  name: string;
  username: any;
  group: any;
  id: string;
  packageId: string;
  mimeType: any;
  fileSize: any;
  originalFileName: any;
  packageClassification?: any;
  imageClassification?: any;
  modality: any;
  systems?: any[];
  created: string;
}

export interface SavedRequestModel {
  request: RequestModel;
  uploadUrl: string;
}
