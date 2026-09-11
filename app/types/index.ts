export interface DataType {
  key?: React.Key
  orderId: string
  id: string
  customer: string
  firstName: string
  lastName: string
  total: string
  location: string
  date: string
  country_code: "GH" | "USA" | "Europe"
  status: string
  email: string
  phone: string
  zip_code: string
  subtotal: string
  shipping: string
  delivery: string
  currency: "USD" | "GHS" | "EUR"
  trackingNumber: string
  label: string
  packagingFee: number
  paymentMethod: string
  deliveryLocation:string
  orderItems: [
    {
      itemName: string
      itemPrice: number
      itemQuantity: number
    },
  ]
}
