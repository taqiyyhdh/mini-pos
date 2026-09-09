"use client";

import { useEffect, useState } from "react";
import { getTransactions } from "@/services/transaction.service";
import Link from "next/link";
import { formateDate } from "@/utils/format";
import { formatCurrency } from "@/utils/currency";


export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getTransactions();
      setTransactions(data);
      setLoading(false);
    }

    loadData();
  }, []);

  // Helper function untuk menentukan warna badge berdasarkan metode pembayaran
  const getPaymentMethodBadge = (method: string) => {
  switch (method?.toUpperCase()) {
    case "CASH":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"; // Hijau
    case "QRIS":
      return "bg-pink-50 text-pink-700 border-pink-200";       // Pink
    case "TRANSFER":
      return "bg-amber-50 text-amber-700 border-amber-200";    // Kuning
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

  return (
    <div>
      <div className="mb-7">
        <p className="text-sm font-bold text-indigo-600">
          RIWAYAT
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">
          Daftar Tranaksi
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Kelola dan pantau seluruh riwayat transaksi penjualan toko.
        </p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            {/* Header Tabel */}
            <thead className="bg-indigo-200 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">No. Invoice</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4 text-center">Metode Pembayaran</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>

            {/* Body Tabel */}
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {transactions.map((transaction) => (
                <tr 
                  key={transaction.id} 
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  
                  <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                    {transaction.invoiceNumber}
                  </td>

                
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {formateDate(transaction.createAt)}
                  </td>

                  
                  <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                    {formatCurrency(transaction.total)}
                  </td>

              
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border uppercase ${getPaymentMethodBadge(
                        transaction.paymentMethod
                      )}`}
                    >
                      {transaction.paymentMethod}
                    </span>
                  </td>

                
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <Link 
                      href={"/transactions/" + transaction.id}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Lihat Invoice
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
   </div> 
  )
}
