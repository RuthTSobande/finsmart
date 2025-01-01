export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
  userId: string;
}

export interface UserProfile {
  username: string;
  transactions: Transaction[];
}