import type {
  Product, 
  ProductInput,
} from "@/types/product";
import { getProducts } from "@/utils/product-storage";

const STORAGE_KEY = "minipos-products";

export function getProductById(id: string) {
  const products = getProducts();
  const product = products.find((item) => {
    return item.id === id;
  });
  return product ?? null;
}

export function updateProduct(
  id: string,
  input: ProductInput
) {
  const products = getProducts();
  const updateProducts = products.map((product) => {
    if (product.id !== id) {
      return product;
    }
    return {
      ...product,
      ...input,
      updatedAt: new Date().toISOString(),
    };
  });
  saveProducts(updateProducts);
   return getProductById(id);
}

export function deleteProduct(id: string) {
  const products = getProducts();
  const filteredProducts = products.filter((product) => {
    return product.id !== id;
  });
  saveProducts(filteredProducts);
}

function saveProducts(products: Product[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(products)
  );
}


