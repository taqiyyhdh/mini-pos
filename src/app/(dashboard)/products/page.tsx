"use client";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import {Plus,Search} from "lucide-react";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/utils/currency";

const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Kopi Susu",
    sku: "KOPI001",
    price: 18000,
    stock: 10,
  },
  {
    id: "2",
    name: "Teh Manis",
    sku: "TEH001",
    price: 8000,
    stock: 5,
  },
  {
    id: "3",
    name: "Roti Bakar",
    sku: "ROTI001",
    price: 15000,
    stock:3,
  },  
];

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const keyword = search.toLowerCase();

    return sampleProducts.filter((product) =>
        product.name.toLowerCase().includes(keyword) ||
        product.sku.toLowerCase().includes(keyword)
    );
  }, [search]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-indigo-600">
            MASTER DATA
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight">
            Produk
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Kelola produk, harga, dan stok.
          </p>
        </div>

        <Link href="/products/create">
          <Button className="w-full sm:w-auto">
            <Plus size={18} />
            Tambah Produk
          </Button>
        </Link>
      </div>
      <div className="mb-5 max-w-md">
        <Input
          placeholder="Cari nama atau SKU..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="pl-3"
          />
      </div>
      {filtered.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-leftt text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">Produk</th>
                  <th className="px-5 py-4">SKU</th>
                  <th className="px-5 py-4">Harga</th>
                  <th className="px-5 py-4">Stok</th>                 
                  <th className="px-5 py-4">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((product) => {
                  const stockColor =
                    product.stock <= 5
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800";
                  return (
                    <tr key={product.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4 font-bold text-slate-900">{product.name}</td>
                      <td className="px-5 py-4 font-bold text-slate-900">{product.sku}</td>
                      <td className="px-5 py-4 font-bold text-slate-900">{formatCurrency(product.price)}</td>
                      
                      <td className=" flex justify-center px-5 py-4 font-bold text-slate-900">
                        <span
                          className ={
                            "rounded-full px-2.5 py-1 text-xs font-bold " +
                            stockColor
                          }
                          // atau bisa pake format string
                          // className={`rounded-full px-2.5 py-1 text-xs font-bold ${stockColor}`}
                        >
                        {product.stock}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <Link
                            href={"/products/" + product.id + "/edit"}
                            className="rounded-lg border px-3 py-2 text-sm text-slate-700"
                          >
                            Edit
                          </Link>
                          <button 
                            className="rounded-lg border border-rose-200 px-3 py-2 text-sm text-rose-600"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {sampleProducts.length === 0 && (
        <EmptyState 
          title="Belum ada produk"
          description="Tambahkan produk pertama untuk memulai transaksi POS."
        />
      )}
      {sampleProducts.length > 0 && filtered.length === 0 &&(
        <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500">
          <Search className="mx-auto mb-2" />
          Produk tidak ditemukan.
        </div>
      )}
      
    </div>
  );
}