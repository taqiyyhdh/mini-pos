import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type { TransactionItem, PaymentMethod } from "@/types/transaction";

const DEMO_USER_ID = "demo-user";
const transactionCollection = collection (
  db,
  "users",
  DEMO_USER_ID,
  "transactions",
);

type CreateTransactionPayload = {
  items: TransactionItem[];
  total: number;
  paidAmount: number;
  paymentMethod: PaymentMethod;
};

function generateInvoiceNumber() {
  return `TRX-${Date.now()}`;
}

export async function createTransaction(
  payload: CreateTransactionPayload
) {
  const changeAmount =
    payload.paidAmount - payload.total;
  
  const docRef = await addDoc (transactionCollection, {
    invoiceNumber: generateInvoiceNumber(),
    items: payload.items,
    total: payload.total,
    paidAmount: payload.paidAmount,
    changeAmount,
    paymentMethod: payload.paymentMethod,
    createAt: serverTimestamp()
  });
  return docRef.id;
}

export async function getTransactions() {
  const q = query(
    transactionCollection,
    orderBy("createAt", "desc")
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => {
    const data = item.data();

    return {
      id: item.id,
      ...data,
      createAt: data.createAt?.toDate?.() ?? new Date(),
    };
  });
}

export async function getTransactionById(id: string) {
  const docRef = doc(
    db,
    
    "users",
    DEMO_USER_ID,
     "transactions",
     id
  );
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    id: snapshot.id,
    ...data,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
  };
}
