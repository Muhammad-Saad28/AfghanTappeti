"use client"

import { useState, useEffect } from "react"

interface Size {
  id: string
  name: string
  width_cm: number
  length_cm: number
}

const PRICE_PER_SQM = 310

function calculatePrice(widthCm: number, lengthCm: number): number {
  return Math.round((widthCm / 100) * (lengthCm / 100) * PRICE_PER_SQM)
}

export function SizePriceCalculator({
  sizes,
  initialSizeId,
  initialPrice,
}: {
  sizes: Size[]
  initialSizeId?: string
  initialPrice?: number
}) {
  const [selectedSizeId, setSelectedSizeId] = useState(initialSizeId || "")
  const [calculatedPrice, setCalculatedPrice] = useState(initialPrice || 0)

  useEffect(() => {
    if (selectedSizeId) {
      const size = sizes.find((s) => s.id === selectedSizeId)
      if (size && size.width_cm && size.length_cm) {
        const price = calculatePrice(size.width_cm, size.length_cm)
        setCalculatedPrice(price)
      }
    }
  }, [selectedSizeId, sizes])

  const selectedSize = sizes.find((s) => s.id === selectedSizeId)

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="size_id" className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
          Size
        </label>
        <select
          id="size_id"
          name="size_id"
          value={selectedSizeId}
          onChange={(e) => setSelectedSizeId(e.target.value)}
          className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md"
        >
          <option value="">Select size</option>
          {sizes.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {selectedSize && selectedSize.width_cm && selectedSize.length_cm && (
        <div className="bg-surface-container-low rounded-lg p-4 space-y-2">
          <p className="text-label-sm text-on-surface-variant">
            Dimensions: {selectedSize.width_cm} cm × {selectedSize.length_cm} cm
          </p>
          <p className="text-label-sm text-on-surface-variant">
            Area: {((selectedSize.width_cm / 100) * (selectedSize.length_cm / 100)).toFixed(2)} m²
          </p>
          <p className="text-label-sm text-on-surface-variant">
            Price per m²: €{PRICE_PER_SQM}
          </p>
          <p className="text-label-md text-on-surface font-medium">
            Calculated Price: €{calculatedPrice.toLocaleString()}
          </p>
        </div>
      )}

      <div>
        <label htmlFor="price" className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
          Price (€) *
        </label>
        <input
          id="price"
          name="price"
          type="number"
          step="0.01"
          required
          value={calculatedPrice || ""}
          onChange={(e) => setCalculatedPrice(parseFloat(e.target.value) || 0)}
          className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md"
        />
        <p className="text-label-xs text-on-surface-variant mt-1">
          Auto-calculated from size. You can manually override if needed.
        </p>
      </div>
    </div>
  )
}
