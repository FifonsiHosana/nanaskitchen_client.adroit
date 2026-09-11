import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { AddProductFormFields } from "./add-product-form-fields";
import { usePermission } from "../hooks/use-permission";
import { useFlavorStore } from "../store/use_flavor_store";
import { useCatalogStore } from "../store/use_catalog_store";
import { useAddProductForm } from "../lib/use-add-product-form";

export function AddProductForm() {
  const navigate = useNavigate();
  const { flavors, fetchFlavors } = useFlavorStore();
  const { variants, fetchVariants } = useCatalogStore();
  const { form, setField, submitting, handleSubmit } = useAddProductForm(() =>
    navigate(-1),
  );
  // POST /products/catalog/products requires products/edit. View-only users
  // get disabled fields and no submit, so the form can never 403 on submit.
  const { allowed: canEditProduct } = usePermission("products", "edit");

  useEffect(() => {
    if (flavors.length === 0) fetchFlavors();
    fetchVariants();
  }, []);

  return (
    <div className="space-y-4 p-8">
      <Card className="space-y-4 p-4">
        <h2 className="text-2xl font-semibold">Add Product</h2>
        {!canEditProduct && (
          <p className="text-sm text-muted-foreground">
            View only — you don&apos;t have permission to create products.
          </p>
        )}
        <fieldset disabled={!canEditProduct} className="space-y-4">
          <AddProductFormFields
            form={form}
            setField={setField}
            flavors={flavors}
            variants={variants}
          />
        </fieldset>
        <div className="grid grid-cols-5 gap-5">
          <Button
            // variant={"destructive"}
            onClick={() => navigate(-1)}
            className="cursor-pointer"
            type="button"
          >
            cancel
          </Button>
          {canEditProduct && (
            <Button
              onClick={handleSubmit}
              disabled={submitting }
              className="cursor-pointer"
            >
              {submitting ? "Saving..." : "Submit"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
