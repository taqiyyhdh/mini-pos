"use client";

import { useEffect, useMemo, useState } from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProducts } from "@/services/product.service";
import type { Product } from "@/types/product";
import type { CartItem, PaymentMethod } from "@/types/cart";
import { formatRupiah } from "@/utils/format";
import { useRouter } from "next/navigation";
import { createTransaction } from "@/services/transaction.service";


export default function NewTransactionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const[discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const[loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);

        const data = await getProducts();
        setProducts(data);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const keyword = search.toLowerCase();

      return (
        product.name.toLocaleLowerCase().includes(keyword) ||
        product.sku.toLowerCase().includes(keyword)
      );
    });
  }, [products, search]);

  function handleAddToCart(product: Product) {
    setCartItems((currentItems) => {
      const exitingItem = currentItems.find(
        (item) => item.productId ===product.id
      );

      if(exitingItem) {
        return currentItems.map((item) =>
          item.productId === product.id
        ? {...item, qyt: item.qyt + 1, subtotal: (item.qyt + 1) * item.price}
        : item
        );
      }
      return [
        ...currentItems,
        {productId: product.id, name: product.name, price: product.price, qyt: 1, subtotal: product.price},
      ];
    });
  }

  function handleUpdateQyt (productId: string, qyt: number){
    if (qyt < 1) return;

    setCartItems((currentItems) => 
    currentItems.map((item) =>
      item.productId === productId
        ? { ...item, qyt, subtotal: qyt * item.price }
        :item
      )
    );
  }

  function handleRemoveItem(productId: string) {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.productId !== productId)
    );
  }

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.subtotal, 0);
  }, [cartItems]);
  const grandTotal = useMemo(() => {
    return Math.max(subtotal - discount, 0);
  }, [subtotal, discount]);

const router = useRouter();
const [paidAmount, setPaidAmount] = useState(0);

async function handleCheckout() {
  const transactionId = await createTransaction({
    items: cartItems,
    total: grandTotal,
    paidAmount,
    paymentMethod,
  });

  router.push("/transactions/" + transactionId);
}


  return(
    <div className="flex flex-col gap-6">
      <div>
          <p className="text-sm font-bold text-indigo-600">
            KATALOG PRODUK
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight">
            DAFTAR PRODUK
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Pilih produk untuk ditambahkan keranjang.
          </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between rounded-2xl border bg-white p-4"
          >
            <div>
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-sm text-slate-500">
                {formatRupiah(product.price)}
              </p>
            </div>
            <Button onClick={() => handleAddToCart(product)}>
              <ShoppingCart size={18} />
            </Button>
          </div>
        ))}
      </div>
        <p className="text-sm font-bold text-indigo-600">
          RINCIAN PESANAN
        </p>
      {cartItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-8 text-center">
          <ShoppingCart  className="mx-auto text-slate-400"/>

          <h3  className="mt-4 font-bold">
            Keranjang masih kosong
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Pilih produk dari daftar di sebelah kiri.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {cartItems.map((item) => (
            <div key={item.productId} className="rounded-2xl border bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-sm text-slate-500">
                    {formatRupiah(item.price)} x {item.qyt}
                  </p>
                </div>

                <button 
                  onClick={() => handleRemoveItem(item.productId)}
                  className="flex items-center gap-2 rounded-lg border bg-red-600 px-3 py-2 text-sm font-bold text-white"
                >
                  <Trash2 size={18} />
                  Hapus
                </button>
              </div>

              <Input 
                type="number"
                min={1}
                value={item.qyt}
                onChange={(event) =>
                  handleUpdateQyt(
                    item.productId,
                    Number(event.target.value)
                  )
                }
              />
              <Input 
                type="number"
                min={0}
                value={discount}
                onChange={(event) =>
                  setDiscount(Number(event.target.value))
                }
              />
              <select
                value={paymentMethod}
                onChange={(event) =>
                  setPaymentMethod(event.target.value as PaymentMethod)
                }
              >
                <option value="cash">Cash</option>
                <option value="transfer">Transfer</option>
                <option value="qris">Qris</option>
              </select>
            </div>
          ))}
          <Button
            type="button"
            disabled={cartItems.length === 0}
            onClick={handleCheckout}
            className="w-full"
          >
            Checkout
            <ShoppingCart size={18} />
          </Button>

        </div>
      )}
    </div>
  );
}