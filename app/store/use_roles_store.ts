import { id } from "zod/v4/locales"
import { create } from "zustand"
import { api } from "~/lib/axios"

interface Role {
  id: number
  roleName: string
}

interface UserRoleProduct {
  id: number
  productId: number
  productImage: string
  productName: string
  minQuantity: string
  dollarDiscount: string
  cediDiscount: string
  euroDiscount: string
}

interface UnassignedProduct {
  id: number
  name: string
  price: number
  title: string
  image: string
  cediPrice: string
  dollarPrice: string
  euroPrice: string
}

interface UserRoleProductsPrice {
  productId: number
  productName: string
  minQuantity: string
  dollarDiscount: string
  cediDiscount: string
  euroDiscount: string
  dollarPrice: string
  cediPrice: string
  euroPrice: string
}

interface RolesStore {
  roles: Role[]
  userRoleProducts: UserRoleProduct[]
  userRoleProductsPrices: UserRoleProductsPrice
  userRoleProductsLoading: boolean
  unassignedProducts: UnassignedProduct[]

  userRole: string
  //   selectedRoleId: number | null
  isLoading: boolean
  error: string | null
  fetchRoles: () => Promise<void>
  fetchUserRoleProducts: (roleId: number) => Promise<void>
  fetchUserRoleProductsPrices: (
    roleId: number,
    productId: number
  ) => Promise<void>
  fetchRole: (id: string) => Promise<void>
  //   addUserRoleProduct: (roleId: number) => Promise<void>
  //   addRole: (name: string) => Promise<void>
  getUnassignedProducts: (roleId: number) => Promise<void>
  addUnassignedProduct: (roleId: number, productId: number) => Promise<void>
  //   editRole: (id: number) => Promise<void>
  //   deleteRole: (id: number) => Promise<void>
  deleteUserRoleProducts: (
    userRoleProductId: number,
    roleId: number
  ) => Promise<void>
}

export const useRolesStore = create<RolesStore>((set, get) => ({
  roles: [],
  userRoleProducts: [],
  userRoleProductsPrices: {} as UserRoleProductsPrice,
  userRoleProductsLoading: false,
  unassignedProducts: [],
  isLoading: false,
  error: null,
  userRole: "",
  //   selectedRoleId: null,
  async fetchRoles() {
    try {
      set({ isLoading: true, error: null })
      const role = await api.get("/user-roles")
      set({ roles: role.data, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },
  async fetchUserRoleProducts(roleId: number) {
    try {
      set({ isLoading: true, error: null })
      const roleProducts = await api.get(`/user-roles/${roleId}/products`)
      // console.log(roleProducts)
      set({ userRoleProducts: roleProducts.data, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },
  async fetchUserRoleProductsPrices(roleId: number, productId: number) {
    try {
      set({
        isLoading: true,
        error: null,
        userRoleProductsPrices: {} as UserRoleProductsPrice,
      })

      const roleProductsPrices = await api.get(
        `/user-roles/${productId}/product/${roleId}/prices`
      )
      // console.log(`roleId: ${roleId} productId:${productId}`)

      set({
        userRoleProductsPrices: roleProductsPrices.data[0],
        isLoading: false,
      })
      console.log(roleProductsPrices)
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },
  fetchRole: async (id: string) => {
    set({
      userRoleProductsPrices: {} as UserRoleProductsPrice,

      isLoading: true,
    })
    try {
      const res = await api.get(`/user-roles/${Number(id)}/product-user-role`)
      // console.log(res)
      set({
        userRole: res.data.role,
        isLoading: false,
      })
    } catch (error) {
      console.error("Error fetching user role products:", error)
    }
  },
  async getUnassignedProducts(roleId: number) {
    try {
      set({ isLoading: true, error: null })
      const unassignedProducts = await api.get(
        `/user-roles/${roleId}/unassigned-products`
      )
      set({ unassignedProducts: unassignedProducts.data, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },
  async addUnassignedProduct(roleId: number, productId: number) {
    try {
      set({ isLoading: true, error: null })
      const response = await api.post(
        `/user-roles/${roleId}/unassigned-product/${productId}/add`
      )
      const [unassigned, assigned] = await Promise.all([
        api.get(`/user-roles/${roleId}/unassigned-products`),
        api.get(`/user-roles/${roleId}/products`),
      ])
      set({
        unassignedProducts: unassigned.data,
        userRoleProducts: assigned.data,
        isLoading: false,
      })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },
  async deleteUserRoleProducts(userRoleProductId: number, roleId: number) {
    try {
      set({ isLoading: true, error: null })
      api.delete(`/user-roles/${userRoleProductId}/user-role-product/delete`)
      get().fetchUserRoleProducts
      // const [unassigned, assigned] = await Promise.all([
      //   api.get(`/user-roles/${roleId}/unassigned-products`),
      //   api.get(`/user-roles/${roleId}/products`),
      // ])
      set({
        // unassignedProducts: unassigned.data,
        // userRoleProducts: assigned.data,
        isLoading: false,
      })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },
}))
