export interface KYCPayload {
  userId: number;
  documentType: string;
  documentNumber: string;
  documentFront: File;
  documentBack: File;
  selfieImage: File;
  status: string;
}
