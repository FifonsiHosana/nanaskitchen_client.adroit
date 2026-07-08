// components/SettingsModal.tsx
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog"
import { Badge } from "~/components/ui/badge"
import { Separator } from "~/components/ui/separator"
import { Pencil, Trash2, Plus, Loader2, Globe, Coins } from "lucide-react"
import { useSettingsStore } from "../store/use-settings-store"
import { toast } from "sonner"

interface Currency {
  id: number
  currencyLabel: string
  currencyCode: string
}

interface Country {
  id: number
  countryLabel: string
  countryCode: string
  currencyId: number
  currencyLabel?: string
  currencyCode?: string
}

interface CurrencyFormValues {
  currencyLabel: string
  currencyCode: string
}

interface CountryFormValues {
  countryLabel: string
  countryCode: string
  currencyId: number
}

// ─── Currency Form ────────────────────────────────────────────────────────────

interface CurrencyFormProps {
  initial?: Currency | null
  onSubmit: (form: CurrencyFormValues) => void
  onCancel: () => void
  isSubmitting: boolean
}

function CurrencyForm({
  initial,
  onSubmit,
  onCancel,
  isSubmitting,
}: CurrencyFormProps) {
  const [form, setForm] = useState<CurrencyFormValues>({
    currencyLabel: initial?.currencyLabel ?? "",
    currencyCode: initial?.currencyCode ?? "",
  })

  const handleChange =
    (field: keyof CurrencyFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currencyLabel">Currency Name</Label>
        <Input
          id="currencyLabel"
          placeholder="e.g. Ghanaian Cedi"
          value={form.currencyLabel}
          onChange={handleChange("currencyLabel")}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="currencyCode">Currency Code</Label>
        <Input
          id="currencyCode"
          placeholder="e.g. GHS"
          maxLength={10}
          value={form.currencyCode}
          onChange={handleChange("currencyCode")}
          className="uppercase"
          required
        />
        <p className="text-xs text-muted-foreground">
          ISO 4217 code — will be stored in uppercase
        </p>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initial ? "Save Changes" : "Add Currency"}
        </Button>
      </div>
    </form>
  )
}

// ─── Country Form ─────────────────────────────────────────────────────────────

interface CountryFormProps {
  initial?: Country | null
  currencies: Currency[]
  onSubmit: (form: CountryFormValues) => void
  onCancel: () => void
  isSubmitting: boolean
}

function CountryForm({
  initial,
  currencies,
  onSubmit,
  onCancel,
  isSubmitting,
}: CountryFormProps) {
  const [form, setForm] = useState({
    countryLabel: initial?.countryLabel ?? "",
    countryCode: initial?.countryCode ?? "",
    currencyId: initial?.currencyId ? String(initial.currencyId) : "",
  })

  const handleChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit({ ...form, currencyId: parseInt(form.currencyId) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="countryLabel">Country Name</Label>
        <Input
          id="countryLabel"
          placeholder="e.g. Ghana"
          value={form.countryLabel}
          onChange={handleChange("countryLabel")}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="countryCode">Country Code</Label>
        <Input
          id="countryCode"
          placeholder="e.g. GH"
          maxLength={10}
          value={form.countryCode}
          onChange={handleChange("countryCode")}
          className="uppercase"
          required
        />
        <p className="text-xs text-muted-foreground">ISO 3166-1 alpha-2 code</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="currencyId">Currency</Label>
        <Select
          value={form.currencyId}
          onValueChange={(val: string) =>
            setForm((prev) => ({ ...prev, currencyId: val }))
          }
          required
        >
          <SelectTrigger id="currencyId">
            <SelectValue placeholder="Select a currency" />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.currencyLabel} ({c.currencyCode})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {currencies.length === 0 && (
          <p className="text-xs text-amber-500">
            Add a currency first before creating a country.
          </p>
        )}
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !form.currencyId}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initial ? "Save Changes" : "Add Country"}
        </Button>
      </div>
    </form>
  )
}

// ─── Currencies Tab ───────────────────────────────────────────────────────────

function CurrenciesTab() {
  const {
    currencies,
    fetchCurrencies,
    createCurrency,
    updateCurrency,
    deleteCurrency,
    isLoading,
  } = useSettingsStore()
  // const { toast } = useToast()

  const [showForm, setShowForm] = useState<boolean>(false)
  const [editing, setEditing] = useState<Currency | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Currency | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  useEffect(() => {
    fetchCurrencies()
  }, [fetchCurrencies])

  const handleSubmit = async (form: CurrencyFormValues) => {
    setIsSubmitting(true)
    try {
      if (editing) {
        await updateCurrency(editing.id, form)
        toast("Currency updated")
      } else {
        await createCurrency(form)
        toast("Currency added")
      }
      setShowForm(false)
      setEditing(null)
    } catch (err) {
      toast(`Error ${(err as Error).message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteCurrency(deleteTarget.id)
      toast("Currency deleted")
    } catch (err) {
      toast(`Error ${(err as Error).message}`)
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div className="space-y-4">
      {showForm || editing ? (
        <div className="rounded-lg border p-4">
          <h4 className="mb-3 text-sm font-semibold">
            {editing ? "Edit Currency" : "New Currency"}
          </h4>
          <CurrencyForm
            initial={editing}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false)
              setEditing(null)
            }}
            isSubmitting={isSubmitting}
          />
        </div>
      ) : (
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Currency
        </Button>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : currencies.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          No currencies yet. Add one to get started.
        </div>
      ) : (
        <Table className="max-h-full max-w-full overflow-y-auto">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead className="w-25" />
            </TableRow>
          </TableHeader>
          <TableBody className="max-h-full max-w-full overflow-y-auto">
            {currencies.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.currencyLabel}</TableCell>
                <TableCell>
                  <Badge variant="outline">{c.currencyCode}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditing(c as Currency)
                        setShowForm(false)
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(c as Currency)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete currency?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deleteTarget?.currencyLabel}</strong> will be removed.
              Any countries or pricing tiers linked to this currency will lose
              their currency reference.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ─── Countries Tab ────────────────────────────────────────────────────────────

function CountriesTab() {
  const {
    countries,
    currencies,
    fetchCountries,
    fetchCurrencies,
    createCountry,
    updateCountry,
    deleteCountry,
    isLoading,
  } = useSettingsStore()
  // const { toast } = useToast()

  const [showForm, setShowForm] = useState<boolean>(false)
  const [editing, setEditing] = useState<Country | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Country | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  useEffect(() => {
    fetchCountries()
    fetchCurrencies()
  }, [fetchCountries, fetchCurrencies])

  const handleSubmit = async (form: CountryFormValues) => {
    setIsSubmitting(true)
    try {
      if (editing) {
        await updateCountry(editing.id, form)
        toast("Country updated")
      } else {
        await createCountry(form)
        toast("Country added")
      }
      setShowForm(false)
      setEditing(null)
    } catch (err) {
      toast(
        `Error
         ${(err as Error).message}`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteCountry(deleteTarget.id)
      toast("Country deleted")
    } catch (err) {
      toast(`Error ${(err as Error).message}`)
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div className="space-y-4">
      {showForm || editing ? (
        <div className="rounded-lg border p-4">
          <h4 className="mb-3 text-sm font-semibold">
            {editing ? "Edit Country" : "New Country"}
          </h4>
          <CountryForm
            initial={editing}
            currencies={currencies as Currency[]}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false)
              setEditing(null)
            }}
            isSubmitting={isSubmitting}
          />
        </div>
      ) : (
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Country
        </Button>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : countries.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          No countries yet. Add one to get started.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Country</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead className="w-25" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {countries.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.countryLabel}</TableCell>
                <TableCell>
                  <Badge variant="outline">{c.countryCode}</Badge>
                </TableCell>
                <TableCell>
                  {c.countryLabel ? (
                    <span className="text-sm">
                      {c.countryLabel}{" "}
                      <span className="text-muted-foreground">
                        ({c.countryCode})
                      </span>
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">
                      None
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditing(c as Country)
                        setShowForm(false)
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(c as Country)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete country?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deleteTarget?.countryLabel}</strong> will be removed
              along with any product visibility settings tied to it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="no-scrollbar h-[400px] max-h-full w-[900px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Settings</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Manage currencies, countries, and other global configurations.
          </p>
        </DialogHeader>

        <Separator />

        <Tabs defaultValue="currencies" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="currencies" className="gap-2">
              <Coins className="h-3.5 w-3.5" />
              Currencies
            </TabsTrigger>
            <TabsTrigger value="countries" className="gap-2" disabled>
              <Globe className="h-3.5 w-3.5 cursor-not-allowed" />
              Countries
            </TabsTrigger>
          </TabsList>

          <TabsContent value="currencies" className="mt-4">
            <CurrenciesTab />
          </TabsContent>

          <TabsContent value="countries" className="mt-4">
            <CountriesTab />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
