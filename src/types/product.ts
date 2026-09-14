import type { Timestamp } from "firebase/firestore";

export type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  createdAt?: Timestamp;
  updateAt?: Timestamp;

};

export type ProductInput = Omit<Product, "id" | "createdAt" | "updateAt">;