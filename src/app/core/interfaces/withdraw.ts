export interface WithdrawRequest {
  amount: number;
  type: 'Bank' | 'EWallet';
  name: string;
  number: string;
}