export type TransactionItem = {
  productId: string;
  name: string;
  price: number;
  qyt: number;
  subtotal: number;
}

export type PaymentMethod = 
  | "cash"
  | "qris"
  | "transfer"

export type Transaction = {
  id: string;
  invoiceNumber: string;
  items: TransactionItem[];
  total: number;
  paidAmount: number;
  changeAmount: number;
  changeMethod: PaymentMethod;
  createAt; Date;
};