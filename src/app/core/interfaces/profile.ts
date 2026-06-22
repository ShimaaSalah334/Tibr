export interface UserProfileDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  kycStatus: string; // e.g., 'Pending', 'Verified', 'Rejected'
  createdAt: string | Date;
}

export interface UpdateProfileDto {
  firstName: string;
  lastName: string;
  phone: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}