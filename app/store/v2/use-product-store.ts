import { api } from "@/app/lib/axios_v2"
import { create } from "zustand"

export interface CountrySettings {
  id: number
  stock: boolean
  visible: boolean
  countryName: string
}

export interface ProductV2 {
  id: number
  sourceId: string
  title: string
  image: string
  images: string[]
  length: string
  height: string
  width: string
  weight: string
  unitsPerCase: number
  flavorId: number
  isCase: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductV2 {
  productId: number
  productTitle: string
  mainImage: string
  images: string[]
  length: string
  width: string
  height: string
  isCase: boolean
  countrySettings: CountrySettings[]
  unitsPerCase: number
  createdAt: string
  updatedAt: string
}

interface ProductStore {
  products: ProductV2[] | null
  selectedProduct: ProductV2
  isLoading: boolean
  error: string | null
  getProducts: (flavorId: number) => Promise<void>
  fetchProduct: (id: number) => Promise<void>
}

export const useProductStoreV2 = create<ProductStore>((set) => ({
  products: null,
  selectedProduct: {
    mainImage: "",
    productId: 0,
    productTitle: "",
    countrySettings: [],
    id: 0,
    sourceId: "",
    title: "",
    image: "",
    images: [],
    length: "",
    height: "",
    width: "",
    weight: "",
    unitsPerCase: 0,
    flavorId: 0,
    isCase: false,
    createdAt: "",
    updatedAt: "",
  },
  isLoading: false,
  error: null,
  async getProducts(flavorId) {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get(`/products/productByflavor/${flavorId}`)
      //   console.log(response)

      set({ products: response.data.flavors, isLoading: false })
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
        mainImage: "",
        productId: 0,
        productTitle: "",
        countrySettings: [],
        height: "",
        length: "",
        width: "",
        id: 0,
        image: "",
        title: "",
        weight: "",
        createdAt: "",
        flavorId: 0,
        images: [],
        isCase: false,
        sourceId: "",
        unitsPerCase: 0,
        updatedAt: "",
      },
      isLoading: true,
    })
    // set({ isLoading: true })
    try {
      const response = await api.get(`/products/${id}`)
      //   console.log(response.data.product[0])

      set({ selectedProduct: response.data.product[0], isLoading: false })
    } catch (error) {
      set({
        error: error.response?.data?.message,
        isLoading: false,
      })
    }
  },
}))
