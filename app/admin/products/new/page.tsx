import { ProductForm } from "../product-form"
import { createProduct } from "../actions"

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-headline-sm text-headline-sm text-on-surface mb-8">
        New Product
      </h1>
      <ProductForm action={createProduct} />
    </div>
  )
}
