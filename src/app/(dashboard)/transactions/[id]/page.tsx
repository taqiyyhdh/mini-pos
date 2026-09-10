import Link from "next/link";
import { notFound } from "next/navigation";
import { getTransactionById } from "@/services/transaction.service";
import PrintButton from "@/components/transactions/print-button";
import { MoveLeft } from "lucide-react";
import { formatCurrency, formateDate } from "@/utils/format";

type PageProps = {
  params: Promise<{ id: string }>;
};

const getPaymentBadgeStyle = (method: string) => {
  switch (method?.toUpperCase()) {
    case "CASH":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "QRIS":
      return "bg-pink-50 text-pink-700 border-pink-200";
    case "TRANSFER":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

export default async function TransactionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const transaction = await getTransactionById(id);

  if (!transaction) {
    notFound();
  }

  // Kalkulasi Tunai & Kembalian (jika ada data dari DB, jika tidak pakai angka perkiraan)
  const totalAmount = transaction.total || 0;
  const cashPaid = transaction.cashPaid || totalAmount; 
  const change = Math.max(0, cashPaid - totalAmount);

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6">
      {/* Header Navigasi & Tombol Aksi */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <Link
          href="/transactions"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 text-sm font-semibold text-gray-600 hover:text-indigo-600 hover:border-indigo-200 rounded-xl transition-all shadow-sm"
        >
          <MoveLeft size={18}/>
          Kembali ke Riwayat
        </Link>

        <PrintButton />
      </div>

      {/* Container Struk Utama */}
      <div className="relative printable-area">

        {/* Card Struk Compact */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm relative z-10">
          
          {/* Header Toko */}
          <div className="text-center pb-3 border-b border-dashed border-gray-200">
            <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none">
              MiniPOS
            </h1>
            <p className="text-[11px] text-gray-400 mt-0.5">Struk Pembayaran Resmi</p>

            <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              TRANSAKSI LUNAS
            </div>
          </div>

          {/* Info Utama */}
          <div className="py-2.5 border-b border-dashed border-gray-200 text-[11px] flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">No. Invoice</span>
              <span className="font-bold text-gray-900 font-mono">
                {transaction.invoiceNumber || transaction.id}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Waktu</span>
              <span className="font-medium text-gray-700">
                {formateDate(transaction.createdAt)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Kasir</span>
              <span className="font-medium text-gray-700">
                {transaction.cashierName || "Admin Kasir"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Pembayaran</span>
              <span
                className={`px-2 py-0.5 rounded-full font-bold uppercase border text-[9px] ${getPaymentBadgeStyle(
                  transaction.paymentMethod
                )}`}
              >
                {transaction.paymentMethod || "CASH"}
              </span>
            </div>
          </div>

          {/* Rincian Item */}
          <div className="py-2.5 border-b border-dashed border-gray-200 flex flex-col gap-2">
            <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">
              Rincian Item
            </span>

            {transaction.items && transaction.items.length > 0 ? (
              transaction.items.map((item: any, index: number) => {
                const qyt = item.qyt || item.quantity || 1;
                const price = item.price || 0;
                const subtotal = qyt * price;

                return (
                  <div
                    key={index}
                    className="flex justify-between items-start text-xs"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 text-[11px]">
                        {item.name}
                      </span>
                      <span className="text-gray-400 text-[10px]">
                        {qyt} x {formatCurrency(price)}
                      </span>
                    </div>
                    <span className="font-bold text-gray-900 text-[11px]">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-[11px] text-gray-400 italic">
                Tidak ada rincian item.
              </p>
            )}
          </div>

          {/* Total & Tunai */}
          <div className="py-2.5 border-b border-dashed border-gray-200 flex flex-col gap-1 text-[11px]">
            <div className="flex justify-between items-center font-black text-gray-900 text-xs">
              <span>Total Bayar</span>
              <span className="text-indigo-600 text-sm">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            {transaction.paymentMethod?.toUpperCase() === "CASH" && (
              <>
                <div className="flex justify-between items-center text-gray-500">
                  <span>Tunai Diterima</span>
                  <span className="font-semibold text-gray-700">
                    {formatCurrency(cashPaid)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-500">
                  <span>Kembalian</span>
                  <span className="font-semibold text-gray-700">
                    {formatCurrency(change)}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Footer & Barcode Mini */}
          <div className="mt-3 text-center flex flex-col items-center">
            <p className="text-[11px] font-semibold text-gray-700">
              Terima kasih telah berbelanja!
            </p>

            <div className="mt-2 pt-2 border-t border-gray-100 w-full flex flex-col items-center">
              <div className="flex items-center gap-0.5 h-5 opacity-60">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    className={`bg-gray-800 h-full ${
                      i % 3 === 0 ? "w-1" : "w-0.5"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[9px] font-mono text-gray-400 mt-0.5 tracking-widest uppercase">
                {transaction.invoiceNumber || transaction.id}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}