export type CartItem = {
  productId: string;
  name: string;
  price: number;
  qyt: number;
  subtotal: number;
};

export type PaymentMethod = "cash" | "transfer" | "qris";