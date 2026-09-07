"use client";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import {Plus,Search} from "lucide-react";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/utils/currency";
import { Pencil, Trash2 } from "lucide-react";
import { deleteProduct, getProducts } from "@/services/product.service";

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
  const [products, setProducts] = useState<Product[]>([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error,setError] = useState("");

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
      setError("Gagal memuat produk.");
    }  finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-6">
        Memuat data produk...
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error}
      </div>
    )
  }

  // const filtered = useMemo(() => {
  //   const keyword = search.toLowerCase();

  //   return products.filter((product) =>
  //       product.name.toLowerCase().includes(keyword) ||
  //       product.sku.toLowerCase().includes(keyword)
  //   );
  // }, [products, search]);

  const filteredProducts = products.filter ((product) => {
    const keyword = search.toLowerCase();
    return (
      product.name.toLowerCase().includes(keyword) ||
      product.sku.toLowerCase().includes(keyword)
    );
  });

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Yakin ingin menghapus produk ini?"
    );
    if (!confirmed) return;
    await deleteProduct(id);
    await loadProducts();
  }

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
      {filteredProducts.length > 0 && (
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
                {filteredProducts.map((product) => {
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
                            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-bold text-white"
                          >
                            <Pencil size={18} />
                            Edit
                          </Link>
                          <button  
                            type="button"
                            onClick={() => handleDelete(product.id)}
                            className="flex items-center gap-2 rounded-lg border bg-red-600 px-3 py-2 text-sm font-bold text-white"
                          >
                            <Trash2 size={18} />
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
      {filteredProducts.length === 0 && (
        <EmptyState 
          title="Belum ada produk"
          description="Tambahkan produk pertama untuk memulai transaksi POS."
        />
      )}

      {/* {filteredProducts.length === 0 ? (
        <EmptyState 
          title="Produk tidak ditemukan"
          description="Coba gunakan kata kunci lain atau tambahkan produk baru."
        />
        ): (
          <div className="grid gap-3">
            <Search className="mx-auto mb-2" />
            {filteredProducts.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )
      } */}

      {sampleProducts.length > 0 && filteredProducts.length === 0 &&(
        <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500">
          <Search className="mx-auto mb-2" />
          Produk tidak ditemukan.
        </div>
      )}
      
    </div>
  );
}