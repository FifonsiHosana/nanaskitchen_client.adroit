import { useState } from "react"
import { Download, Printer, FileText, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Button } from "~/components/ui/button"
import type { Customer } from "../store/use-analytics-store"

interface Order {
  id: string | number
  [key: string]: any
}

interface ExportButtonProps {
  orders?: Order[] | Customer[]
  filename?: string
}


export function ExportButton({
  orders,
  filename,
}: ExportButtonProps) {
  // const resolvedFilename =
  //   filename ??
  //   (orders.length > 0 && "totalOrders" in orders[0] ? "customers" : "orders")
  const exportCSV = () => {
    if (!orders?.length) return

    const headers = Object.keys(orders[0])
    const rows = orders.map((order) =>
      headers.map((h) => {
        const val = order[h] ?? ""
        // wrap in quotes if value contains comma, newline, or quote
        const str = String(val).replace(/"/g, '""')
        return /[,\n"]/.test(str) ? `"${str}"` : str
      })
    )

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const printTable = () => {
    if (!orders?.length) return

    const headers = Object.keys(orders[0])
    const rows = orders
      .map(
        (order) =>
          `<tr>${headers.map((h) => `<td>${order[h] ?? "—"}</td>`).join("")}</tr>`
      )
      .join("")

    const html = `
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body { font-family: sans-serif; font-size: 12px; padding: 24px; }
            h2 { margin-bottom: 16px; font-size: 16px; }
            table { width: 100%; border-collapse: collapse; }
            th { background: #f3f4f6; text-align: left; padding: 8px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #e5e7eb; }
            td { padding: 8px 12px; border-bottom: 1px solid #e5e7eb; }
            tr:last-child td { border-bottom: none; }
          </style>
        </head>
        <body>
          <h2>${filename} — ${new Date().toLocaleDateString()}</h2>
          <table>
            <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `

    const win = window.open("", "_blank")
    if (!win) return
    win.document.write(html)
    win.document.close()
    win.focus()
    win.print()
    win.close()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
          <ChevronDown className="ml-2 h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportCSV}>
          <FileText className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={printTable}>
          <Printer className="mr-2 h-4 w-4" />
          Print table
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
