"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductForm } from "@/components/products/product-form";
import { useAuth } from "@/contexts/auth-context";
import { getProduct, updateProduct } from "@/services/product.service";
import type { ProductInput } from "@/types/product";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [initialData, setInitialData] = useState<ProductInput | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!user) return;
    getProduct(user.uid, params.id).then((product) => {
      if (!product) return setNotFound(true);
      setInitialData({ name: product.name, sku: product.sku, price: product.price, stock: product.stock });
    });
  }, [user, params.id]);

  if (notFound) return <div className="rounded-2xl bg-white p-6">Produk tidak ditemukan.</div>;
  if (!initialData) return <div className="rounded-2xl bg-white p-6">Memuat produk...</div>;

  return (
    <div className="max-w-2xl">
      <p className="text-sm font-bold text-indigo-600">
        MASTER DATA
      </p>

      <h1 className="mt-1 text-3xl font-black tracking-tight">
        Edit Produk
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Edit data produk di MiniPOS.
      </p>
      <div className="mt-4 rounded-2xl border bg-white p-5 shadow-sm">
        <ProductForm
          initialData={initialData}
          submitLabel="Simpan Perubahan"
          onSubmit={async (data) => {
            if (!user) return;
            await updateProduct(user.uid, params.id, data);
            router.push("/products");
          }}
        />
      </div>
    </div>
  );
}