"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { getSaleTransaction } from "@/services/transaction.service";
import type { SaleTransaction } from "@/types/transaction";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/date";

export default function TransactionDetailPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const [transaction, setTransaction] = useState<SaleTransaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getSaleTransaction(user.uid, params.id).then((data) => {
      setTransaction(data);
      setLoading(false);
    });
  }, [user, params.id]);

  if (loading) return <div className="rounded-2xl bg-white p-6">Memuat transaksi...</div>;
  if (!transaction) return <div className="rounded-2xl bg-white p-6">Transaksi tidak ditemukan.</div>;

  return (
    <div className="mx-auto max-w-3xl">
      <div 
        className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 print:p-0 print:shadow-none print:w-full print:text-xs"
      >
        <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between print:pb-3 print:gap-2">
          <div className="flex items-center gap-4 print:gap-2">
            <div className="grid size-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 print:hidden">
              <CheckCircle2 />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-600">Transaksi Berhasil</div>
              <h1 className="mt-1 text-2xl font-black print:text-base">{transaction.invoiceNumber}</h1>
              <p className="mt-1 text-sm text-slate-500 print:text-[10px]">{formatDate(transaction.createdAt)}</p>
            </div>
          </div>
          <Link href="/transactions/new" className="print:hidden">
            <Button>Transaksi Baru</Button>
          </Link>
        </div>

        <div className="py-6 print:py-3">
          <h2 className="mb-4 font-black print:mb-2 print:text-xs">Detail Produk</h2>
          <div className="grid gap-3 print:gap-2">
            {transaction.items.map((item) => (
              <div 
                key={item.productId} 
                className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-4 print:bg-transparent print:p-0 print:border-b print:border-dashed print:border-slate-300 print:pb-2"
              >
                <div>
                  <div className="font-bold print:text-xs">{item.name}</div>
                  <div className="mt-1 text-xs text-slate-500 print:mt-0 print:text-[10px]">
                    {item.sku} • {item.quantity} × {formatCurrency(item.price)}
                  </div>
                </div>
                <div className="font-black print:text-xs">{formatCurrency(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 border-t border-slate-100 pt-6 text-sm print:gap-1 print:pt-3 print:text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Metode Pembayaran</span>
            <strong className="uppercase">{transaction.paymentMethod}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Total</span>
            <strong>{formatCurrency(transaction.total)}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Dibayar</span>
            <strong>{formatCurrency(transaction.paymentAmount)}</strong>
          </div>
          <div className="flex justify-between text-base print:text-xs">
            <span className="font-bold">Kembalian</span>
            <strong>{formatCurrency(transaction.change)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}