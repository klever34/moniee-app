export type Deposit = {
  id: number;
  type: string;
  amount: number;
};

export type Withdraw = {
  type: string;
  provider: string;
  amount: number;
};

export type Transaction = {
  deposits: Deposit[];
  withdrawals: Withdraw[];
};
