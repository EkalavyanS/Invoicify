import React from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'

interface TaxDiscountSectionProps {
  taxRate: number
  setTaxRate: (rate: number) => void
  discountRate: number
  setDiscountRate: (rate: number) => void
}

export const TaxDiscountSection: React.FC<TaxDiscountSectionProps> = ({
  taxRate,
  setTaxRate,
  discountRate,
  setDiscountRate,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="taxRate" className="text-sm font-medium text-gray-700">Tax Rate (%)</Label>
        <Input
          id="taxRate"
          type="number"
          value={taxRate}
          onChange={(e) => setTaxRate(parseFloat(e.target.value))}
          className="mt-1"
          placeholder="e.g., 10"
        />
      </div>
      <div>
        <Label htmlFor="discountRate" className="text-sm font-medium text-gray-700">Discount Rate (%)</Label>
        <Input
          id="discountRate"
          type="number"
          value={discountRate}
          onChange={(e) => setDiscountRate(parseFloat(e.target.value))}
          className="mt-1"
          placeholder="e.g., 5"
        />
      </div>
    </div>
  )
}

