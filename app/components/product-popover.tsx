import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import { Field, FieldLabel } from "./ui/field"
import { Button } from "./ui/button"
import { Label } from "./ui/label"

import {
  Controller,
  type Control,
  type FieldArrayWithId,
  type UseFormRegister,
  type UseFormWatch,
} from "react-hook-form"
import { Input } from "./ui/input"
import type { FormValues } from "./product-form"
import type { CountrySettings } from "../store/v2/use-product-store"

// export const PRODUCT_POPOVER_OPTIONS: Record<
//   string,
//   {
//     label: string
//     title: string
//     description: string
//     trueLabel: string
//     falseLabel: string
//     trueColor: string
//     falseColor: string
//   }
// > = {
//   outOfStock: {
//     label: "Availability",
//     title: "Stock",
//     description: "Set product as out of stock for a specific region.",
//     trueLabel: "Out of stock",
//     falseLabel: "Available",
//     trueColor: "var(--out-of-stock)",
//     falseColor: "hsl(var(--status-completed))",
//   },
//   visible: {
//     label: "Visibility by region",
//     title: "Visibility",
//     description: "Set product visibility for a specific region.",
//     trueLabel: "Visible",
//     falseLabel: "Hidden",
//     trueColor: "hsl(var(--status-completed))",
//     falseColor: "var(--out-of-stock)",
//   },
// }

// const ProductPopover = ({
//   setValue,
//   valueOfGH,
//   valueOfUs,
//   valueOfEU,
//   valueType,
// }: {
//   setValue: any
//   valueOfGH: boolean
//   valueOfUs: boolean
//   valueOfEU: boolean
//   valueType: string
// }) => {
// //   console.log(`${valueType}GH`)

//   return (
//     <>
//       {" "}
//       <Field>
//         <FieldLabel htmlFor="form-name">
//           {PRODUCT_POPOVER_OPTIONS[valueType].label}
//         </FieldLabel>
//         <Popover>
//           <PopoverTrigger asChild>
//             <Button variant="outline">
//               {PRODUCT_POPOVER_OPTIONS[valueType].title}
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-80">
//             <div className="grid gap-4">
//               <div className="space-y-2">
//                 <h4 className="leading-none font-medium">Regions</h4>
//                 <p className="text-sm text-muted-foreground">
//                   {PRODUCT_POPOVER_OPTIONS[valueType].description}
//                 </p>
//               </div>
//               <div className="grid gap-2">
//                 <div className="grid grid-cols-3 items-center gap-4">
//                   <Label htmlFor="width">Ghana</Label>
//                   <Tabs
//                     value={String(valueOfGH)}
//                     onValueChange={(val) =>
//                       setValue(`${valueType}GH`, val === "true", {
//                         shouldDirty: true,
//                       })
//                     }
//                     className="w-100"
//                   >
//                     <TabsList>
//                       <TabsTrigger
//                         style={{
//                           backgroundColor:
//                             valueOfGH === false
//                               ? PRODUCT_POPOVER_OPTIONS[valueType].falseColor
//                               : "transparent",
//                         }}
//                         className=""
//                         value="false"
//                       >
//                         {PRODUCT_POPOVER_OPTIONS[valueType].falseLabel}
//                       </TabsTrigger>
//                       <TabsTrigger
//                         style={{
//                           backgroundColor:
//                             valueOfGH === true
//                               ? PRODUCT_POPOVER_OPTIONS[valueType].trueColor
//                               : "transparent",
//                         }}
//                         className=""
//                         value={String(true)}
//                       >
//                         {PRODUCT_POPOVER_OPTIONS[valueType].trueLabel}
//                       </TabsTrigger>
//                     </TabsList>
//                   </Tabs>
//                 </div>
//                 <div className="grid grid-cols-3 items-center gap-4">
//                   <Label htmlFor="maxWidth">USA</Label>
//                   <Tabs
//                     value={String(valueOfUs)}
//                     onValueChange={(val) =>
//                       setValue(`${valueType}US`, val === "true", {
//                         shouldDirty: true,
//                       })
//                     }
//                     className="w-100"
//                   >
//                     <TabsList>
//                       <TabsTrigger
//                         style={{
//                           backgroundColor:
//                             valueOfUs === false
//                               ? PRODUCT_POPOVER_OPTIONS[valueType].falseColor
//                               : "transparent",
//                         }}
//                         className=""
//                         value="false"
//                       >
//                         {PRODUCT_POPOVER_OPTIONS[valueType].falseLabel}
//                       </TabsTrigger>
//                       <TabsTrigger
//                         style={{
//                           backgroundColor:
//                             valueOfUs === true
//                               ? PRODUCT_POPOVER_OPTIONS[valueType].trueColor
//                               : "transparent",
//                         }}
//                         className=""
//                         value="true"
//                       >
//                         {PRODUCT_POPOVER_OPTIONS[valueType].trueLabel}
//                       </TabsTrigger>
//                     </TabsList>
//                   </Tabs>
//                 </div>
//                 <div className="grid grid-cols-3 items-center gap-4">
//                   <Label htmlFor="height">EU countries</Label>
//                   <Tabs
//                     value={String(valueOfEU)}
//                     onValueChange={(val) =>
//                       setValue(`${valueType}EU`, val === "true", {
//                         shouldDirty: true,
//                       })
//                     }
//                     className="w-100"
//                   >
//                     <TabsList>
//                       <TabsTrigger
//                         style={{
//                           backgroundColor:
//                             valueOfEU === false
//                               ? PRODUCT_POPOVER_OPTIONS[valueType].falseColor
//                               : "transparent",
//                         }}
//                         className=""
//                         value="false"
//                       >
//                         {PRODUCT_POPOVER_OPTIONS[valueType].falseLabel}
//                       </TabsTrigger>
//                       <TabsTrigger
//                         style={{
//                           backgroundColor:
//                             valueOfEU === true
//                               ? PRODUCT_POPOVER_OPTIONS[valueType].trueColor
//                               : "transparent",
//                         }}
//                         className=""
//                         value="true"
//                       >
//                         {PRODUCT_POPOVER_OPTIONS[valueType].trueLabel}
//                       </TabsTrigger>
//                     </TabsList>
//                   </Tabs>
//                 </div>
//               </div>
//             </div>
//           </PopoverContent>
//         </Popover>
//       </Field>
//     </>
//   )
// }

// export default ProductPopover

const POPOVER_CONFIG = {
  stock: {
    label: "Availability",
    title: "Stock",
    description: "Set product as out of stock for a specific region.",
    trueLabel: "Out of stock",
    falseLabel: "Available",
    trueColor: "var(--out-of-stock)",
    falseColor: "hsl(var(--status-completed))",
  },
  visible: {
    label: "Visibility by region",
    title: "Visibility",
    description: "Set product visibility for a specific region.",
    trueLabel: "Visible",
    falseLabel: "Hidden",
    trueColor: "hsl(var(--status-completed))",
    falseColor: "var(--out-of-stock)",
  },
} as const

type PopoverType = keyof typeof POPOVER_CONFIG

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  type: PopoverType // "stock" | "visible"
  fields: CountrySettings[]
  control: Control<FormValues>
  watch: UseFormWatch<FormValues>
}

// interface Props {
//   fields: FieldArrayWithId[]
//   register: UseFormRegister<FormValues>
//   watch: UseFormWatch<FormValues>
// }

const ProductPopover = ({ type, fields, control, watch }: Props) => {
  const config = POPOVER_CONFIG[type]
  const settings = watch("countrySettings")
  // console.log(fields)

  return (
    <Field>
      <FieldLabel>{config.label}</FieldLabel>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">{config.title}</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="leading-none font-medium">Regions</h4>
              <p className="text-sm text-muted-foreground">
                {config.description}
              </p>
            </div>

            <div className="grid gap-2">
              {fields.map((field, index) => {
                const currentValue = settings?.[index]?.[type] // 0 or 1
                return (
                  <div
                    key={field.id}
                    className="grid grid-cols-3 items-center gap-4"
                  >
                    <Label>{field.countryName}</Label>
                    <Controller
                      control={control}
                      name={`countrySettings.${index}.${type}`}
                      render={({ field: controllerField }) => (
                        <Tabs
                          value={String(controllerField.value)}
                          onValueChange={(val) =>
                            controllerField.onChange(Number(val), {
                              shouldDirty: true,
                            })
                          }
                        >
                          <TabsList>
                            <TabsTrigger
                              value="0"
                              style={{
                                backgroundColor:
                                  currentValue === 0
                                    ? config.falseColor
                                    : "transparent",
                              }}
                            >
                              {config.falseLabel}
                            </TabsTrigger>
                            <TabsTrigger
                              value="1"
                              style={{
                                backgroundColor:
                                  currentValue === 1
                                    ? config.trueColor
                                    : "transparent",
                              }}
                            >
                              {config.trueLabel}
                            </TabsTrigger>
                          </TabsList>
                        </Tabs>
                      )}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </Field>
  )
}
export default ProductPopover
