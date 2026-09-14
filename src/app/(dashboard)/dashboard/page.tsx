"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Boxes,
  CircleDollarSign,
  ReceiptText,
  TriangleAlert,
} from "lucide-react";
import { getProducts } from "@/services/product.service"
import { getTransactions } from "@/services/transaction.service";
import type { Product } from "@/types/product";
import type { Transaction } from "@/types/transaction";
import BestSellingChart from "@/components/dashboard/BestSellingChart";
import { formatCurrency } from "@/utils/currency";


export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  // mengambil data
  async function loadDashboardData() {
    try {
      setLoading(true);
      setError("");
      const [productData, transactionData] = await Promise.all([
        getProducts(),
        getTransactions(),
      ]);
      setProducts(productData);
      setTransactions(transactionData);
    } catch (err){
      setError("Gagal memuat data dashboard.");
    } finally {
    setLoading(false);
    }
  }

  // helper tanggal hari ini
  function isToday(date : Date ) {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  // pilih transaksi hari ini
  const todayTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const createAt = new Date(transaction.createAt);
       return isToday(transaction.createAt)
    });
  }, [transactions]);

  // hitung omzet hari ini
  const todayRevenue = useMemo(() => {
    return todayTransactions.reduce((total, transaction) => {
      return total + transaction.total;
    }, 0);
  }, [todayTransactions]);

  // deteksi stok menipis
  const lowStockProducts = useMemo(() => {
    return products.filter((product) => {
      return product.stock <= 5;
    });
  }, [products]);

  const totalLowStock = lowStockProducts.length;

  // data cart dashboard
  const stats = [
    {
      label: "Total Produk",
      value: products.length,
      icon: Boxes,
    },
    {
      label: "Transaksi Hari Ini",
      value: todayTransactions.length,
      icon: ReceiptText,
    },
    {
      label: "Omzet Hari Ini",
      value: formatCurrency(todayRevenue),
      icon: CircleDollarSign,
    },
    {
      label: "Stok Menipis",
      value: totalLowStock,
      icon: TriangleAlert,
    },
  ];

  // urutkan produk terlaris hari ini
  const bestSellingProducts = useMemo(() => {
    const summary: Record<string, number> = {};

    transactions.forEach((transaction) => {
      transaction.items.forEach((item) => {
        summary[item.name] =
          (summary[item.name] || 0) + item.qyt;
      });
    });

    return Object.entries(summary)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [transactions]);

  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center">
        Memuat dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
        {error}
      </div>
    );
  }


  return (
    <div>
      {/* header */}
      <div className="mb-7">
        <p className="text-sm font-bold text-indigo-600">
          OVERVIEW
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          RIngkasan aktivitas MiniPOS hari ini.
        </p>
      </div>

      {/* stat card */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <Icon className="text-indigo-600" size={22} />

              <p className="mt-5 text-sm text-slate-500">
                {stat.label}
              </p>

              <h3 className="mt-1 text-2xl font-black">
                {stat.value}
              </h3>
            </div>
          );
        })}
      </div>

      {/* Grid Layout 2 Kolom untuk Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left Column: Produk Terlaris (2/3 Lebar) */}
        <div className="lg:col-span-2 rounded-2xl border bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-black text-gray-900">Produk Terlaris</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Performa produk berdasarkan total unit terjual
            </p>
          </div>

          {/* Render Client Component Chart */}
          <BestSellingChart data={bestSellingProducts} />
        </div>

        {/* Right Column: Stok Menipis (1/3 Lebar) */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-gray-900">Stok Menipis</h2>
              <p className="text-xs text-gray-400 mt-0.5">Perlu segera di-restok</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
              {lowStockProducts.length} Produk
            </span>
          </div>

          {/* Daftar Stok Menipis dengan Progress Bar */}
          <div className="space-y-4 overflow-y-auto max-h-[260px] pr-1">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => {
                // Asumsi batas stok aman adalah 10 untuk hitung persentase progress
                const maxStock = 5;
                const percentage = Math.min((product.stock / maxStock) * 100, 100);
                const isCritical = product.stock <= 2;

                return (
                  <div
                    key={product.id}
                    className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-800">{product.name}</span>
                      <span
                        className={`font-extrabold px-2 py-0.5 rounded text-[10px] ${
                          isCritical
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        Sisa {product.stock}
                      </span>
                    </div>

                    {/* Progress Bar Visual */}
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isCritical ? "bg-rose-500" : "bg-amber-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-400 italic py-8 text-center">
                Semua stok produk aman.
              </p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}