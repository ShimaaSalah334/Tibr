POST https://localhost:7280/api/auth/register

{
  "firstName": "Ahmed",
  "lastName": "Sabry",
  "email": "ahmed.sabry@example.com",
  "phone": "0501234567",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!"
}

{"isSuccess":true,"message":"تم إنشاء الحساب بنجاح. يرجى مراجعة بريدك الإلكتروني لتأكيد رمز الـ OTP.","token":null,"expiration":null}

POST https://localhost:7280/api/auth/verify-otp


{
  "email": "ahmedkamalyoussef4@gmail.com",
  "otp": "868059"
}

POST https://localhost:7280/api/auth/submit-kyc

UserId =(long)request.UserId,
DocumentType = request.DocumentType,
DocumentNumber = request.DocumentNumber,
DocumentFront = "/kyc_documents/" + frontFileName,
DocumentBack = "/kyc_documents/" + backFileName,
SelfieImage = "/kyc_documents/" + selfieFileName,
Status = "Pending",
ReviewedBy = null


POST https://localhost:7280/api/auth/login

{
  "email": "ahmedkamalyoussef4@gmail.com",
  "Password": "SecurePassword123!"
}

POST https://localhost:7280/api/auth/forgot-password

{
  "email": "ahmedkamalyoussef4@gmail.com"
}

POST https://localhost:7280/api/auth/reset-password

{
  "email": "ahmedkamalyoussef4@gmail.com",
  "otp": "598124",
  "NewPassword": "SecurePassword123!",
  "ConfirmPassword": "SecurePassword123!"
}