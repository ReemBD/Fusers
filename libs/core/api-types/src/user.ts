export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Order {
  id: string;
  userId: string;
  amount: number;
  status: string;
  createdAt: string;
}