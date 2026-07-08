import { SearchInput } from './orders-search'
import { useOrderParams } from '../lib/useOrderParams'
import {
  Select, SelectContent, SelectGroup,
  SelectItem, SelectTrigger, SelectValue,
} from "~/components/ui/select"
import { ExportButton } from './order-print'
import { useOrderStore } from '../store/use-order-store'
import { useAnalyticsCustomersStore } from '../store/use-analytics-store'

const OrderFilterOptions = ({ location }: { location :string}) => {
  const { setParams, params } = useOrderParams()
  const { orders } = useOrderStore()
  const { data } = useAnalyticsCustomersStore()

  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <ExportButton orders={location==="orders"?orders:data.top?.rows} filename={location==="orders"?"orders":"customers"} />

      <div className="flex flex-wrap items-center gap-2">
        <SearchInput />

        <Select
          value={`${params.minPrice}-${params.maxPrice}`}
          onValueChange={(value) => {
            const [min, max] = value.split("-")
            setParams({ minPrice: min, maxPrice: max })
          }}
        >
          <SelectTrigger className="">
            <SelectValue placeholder="Any Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="-200">Below 200</SelectItem>
              <SelectItem value="200-500">200 - 500</SelectItem>
              <SelectItem value="500-1000">500 - 1,000</SelectItem>
              <SelectItem value="1000-">Above 1,000</SelectItem>
              <SelectItem value="-">Any Price</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default OrderFilterOptions
