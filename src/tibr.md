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

--------------------------------------------------------
get https://localhost:7280/api/wallet
get https://localhost:7280/api/wallet/transactions
-----------------------------
deposite
POST  https://localhost:7280/api/deposit/initiate
{
  amount:2000,
  paymentMethod:1
}

withdraw-funds (pending)

POST  https://localhost:7280/api/withdraw
{
  amount:2000,
  IBAN:1
}

investment-strategy 
POST  https://localhost:7280/api/investment-orders/strategy
{
assetType:1 or 2,
orderType:1 or 2,
ExecutionType:1 or 2 or 3,
Quantity,
ExpiryDate,
Conditions:[ConditionType:1,Operator,TargetValue]
}

Buy  (pending)
POST  https://localhost:7280/api/trade/buy
{
  assetType
  quantity,
  ExpectedPrice
}

sell (pending)
POST  https://localhost:7280/api/trade/sell
{
  type
  quantity
}

delivery
POST  https://localhost:7280/api/


-------------------------------
https://localhost:7280/api/asset-price/current
------------------------------
1- get info for userId
2- change data user(firstname - lastName - email - phone)
2- change password (old password - newPassword - confiramPassword)