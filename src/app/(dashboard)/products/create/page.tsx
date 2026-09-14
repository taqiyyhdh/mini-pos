"use client";

import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/products/product-form";
import { useAuth } from "@/contexts/auth-context";
import { createProduct } from "@/services/product.service";

export default function CreateProductPage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="max-w-2xl">
      <p className="text-sm font-bold text-indigo-600">
        MASTER DATA
      </p>

      <h1 className="mt-1 text-3xl font-black tracking-tight">
        Tambah Produk
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Isi data produk yang akan dijual di MiniPOS.
      </p>
      
      <div className="mt-4 rounded-2xl border bg-white p-5 shadow-sm">
        <ProductForm 
          onSubmit={async (data) => {
            if(!user) return;
            await createProduct(user.uid, data);
            router.push("/products");
          }}
        />
      </div>

    </div>

  )
}