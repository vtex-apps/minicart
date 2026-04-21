export type ShippingBreakdown = {
  /** Amounts in cents (integer) */
  baseShipping: number
  extraWeight: number
  bags: number
  freeShipping: boolean
}

export type DeliveryMethod = 'delivery' | 'pickup-in-point'

const DELIVERY_BY_TOTAL: Record<string, ShippingBreakdown> = {
  "0": { baseShipping: 1999, extraWeight: 0, bags: 0, freeShipping: true },
  "499": { baseShipping: 1999, extraWeight: 0, bags: 499, freeShipping: true },
  "500": { baseShipping: 1999, extraWeight: 500, bags: 0, freeShipping: true },
  "999": { baseShipping: 1999, extraWeight: 500, bags: 499, freeShipping: true },
  "1999": { baseShipping: 1999, extraWeight: 0, bags: 0, freeShipping: false },
  "2498": { baseShipping: 1999, extraWeight: 0, bags: 499, freeShipping: false },
  "2499": { baseShipping: 1999, extraWeight: 500, bags: 0, freeShipping: false },
  "2998": { baseShipping: 1999, extraWeight: 500, bags: 499, freeShipping: false },
  "4000": { baseShipping: 1999, extraWeight: 4000, bags: 0, freeShipping: true },
  "4499": { baseShipping: 1999, extraWeight: 4000, bags: 499, freeShipping: true },
  "5999": { baseShipping: 1999, extraWeight: 4000, bags: 0, freeShipping: false },
  "6498": { baseShipping: 1999, extraWeight: 4000, bags: 499, freeShipping: false },
};


const PICKUP_IN_POINT_BY_TOTAL: Record<string, ShippingBreakdown> = {
  '0': { baseShipping: 0, extraWeight: 0, bags: 499, freeShipping: true },
  '499': { baseShipping: 0, extraWeight: 0, bags: 499, freeShipping: false },
}

const TABLES: Record<DeliveryMethod, Record<string, ShippingBreakdown>> = {
  "delivery": DELIVERY_BY_TOTAL,
  "pickup-in-point": PICKUP_IN_POINT_BY_TOTAL,
}

/** Normalize total (cents) for lookup; rounds so accidental floats still match. */
function totalKey(totalCents: number): string {
  return String(Math.round(totalCents))
}

/**
 * @param totalCents "Total" column in cents (e.g. 499 for $4.99)
 */
export function breakdownFromTotal(
  totalCents: number,
  deliveryMethod: DeliveryMethod
): ShippingBreakdown | undefined {
  return TABLES[deliveryMethod][totalKey(totalCents)]
}