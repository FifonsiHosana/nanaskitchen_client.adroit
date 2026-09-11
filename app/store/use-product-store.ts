import { create } from "zustand"
import { api } from "~/lib/axios"
import type { Product } from "../components/product-form"


interface ProductStore {
  products: Product[] | null
  selectedProduct: Product
  isLoading: boolean
  error: string | null
  getProducts: () => Promise<void> 
  fetchProduct: (id: number) => Promise<void>
}

export const useProductStore = create<ProductStore>((set) => ({
  products: null,
  selectedProduct: {
    discounts:{cediDiscount:"",dollarDiscount:"",euroDiscount:""},
    version:0,
    dimensions: { height: "", length:"", width: "" },
    id: 0,
    image: "",
    name: "",
    price: { eur: "", ghs: "", usd: "" },
    weight: "",
  },
  isLoading: false,
  error: null,
  async getProducts() {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get("/products")
      set({ products: response.data, isLoading: false })
    } catch (error) {
      set({
        error: error.response?.data?.message,
        isLoading: false,
      })
    }
  },
  fetchProduct: async (id) => {
    set({
      selectedProduct: {
        discounts: { cediDiscount: "", dollarDiscount: "", euroDiscount: "" },
        version: 0,
        dimensions: { height: "", length: "", width: "" },
        id: 0,
        image: "",
        name: "",
        price: { eur: "", ghs: "", usd: "" },
        weight: "",
      },
      isLoading: true,
    })
    // set({ isLoading: true })
    try {
          const response = await api.get(`/products/${id}`);
    // console.log(response.data[0]);
    
    set({ selectedProduct: response.data[0], isLoading: false })
    } catch (error) {
      set({
        error: error.response?.data?.message,
        isLoading: false,
      })
    }

  },
}))
