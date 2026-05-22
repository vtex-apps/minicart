export type ShippingBreakdown = {
  /** Amounts in cents (integer) */
  baseShipping: number;
  extraWeight: number;
  bags: number;
  freeShipping: boolean;
};

export type ShippingBreakdownResult =
  | {
      status: "pending";
    }
  | {
      status: "unmapped";
    }
  | {
      status: "ready";
      breakdown: ShippingBreakdown;
    };

export type DeliveryMethod = "delivery" | "pickup-in-point";

export type VtexDeliveryId = {
  courierId: string;
  warehouseId: string;
  dockId: string;
};

export type VtexSla = {
  id: string;
  name?: string;
  deliveryChannel: string;
  price: number;
  deliveryIds?: VtexDeliveryId[];
};

export type VtexLogisticsInfoEntry = {
  itemIndex: number;
  selectedSla: string | null;
  slas: VtexSla[];
};


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
  "0": { baseShipping: 0, extraWeight: 0, bags: 499, freeShipping: true },
  "499": { baseShipping: 0, extraWeight: 0, bags: 499, freeShipping: false },
};

const TABLES: Record<DeliveryMethod, Record<string, ShippingBreakdown>> = {
  "delivery": DELIVERY_BY_TOTAL,
  "pickup-in-point": PICKUP_IN_POINT_BY_TOTAL,
};

/** Normalize total (cents) for lookup; rounds so accidental floats still match. */
function totalKey(totalCents: number): string {
  return String(Math.round(totalCents));
}

/**
 * @param totalCents — "Total" column in cents (e.g. 499 for $4.99)
 */
export function breakdownFromTotal(
  totalCents: number,
  deliveryMethod: DeliveryMethod
): ShippingBreakdown | undefined {
  return TABLES[deliveryMethod][totalKey(totalCents)];
}

/**
 * Combined shipping breakdown for a VTEX OrderForm.
 *
 * Walks `shippingData.logisticsInfo`, picks the selected SLA on each row, and
 * looks it up in {@link DELIVERY_BY_TOTAL} / {@link PICKUP_IN_POINT_BY_TOTAL}.
 * Items that ride along in the same package (same SLA + same `deliveryIds`)
 * are counted once. Monetary fields are summed; `freeShipping` is true only if
 * **every** package is free.
 *
 * Returns `pending` while shipping data is not complete enough to calculate a
 * reliable breakdown, `unmapped` when data is complete but no mapping exists,
 * and `ready` with the computed breakdown otherwise.
 *
 */
export function breakdownFromLogisticsInfo(
  logisticsInfo: VtexLogisticsInfoEntry[]
): ShippingBreakdownResult {
  if (logisticsInfo.length === 0) {
    return { status: "pending" };
  }

  const seenPackages = new Set<string>();
  let hasPendingEntry = false;
  let hasMappedBreakdown = false;
  const total: ShippingBreakdown = {
    baseShipping: 0,
    extraWeight: 0,
    bags: 0,
    freeShipping: true,
  };

  for (const entry of logisticsInfo) {
    if (entry.selectedSla === null) {
      hasPendingEntry = true;
      continue;
    }

    const sla = entry.slas.find(
      (s) => s.id === entry.selectedSla || s.name === entry.selectedSla
    );

    if (sla === undefined) {
      hasPendingEntry = true;
      continue;
    }

    if (sla.deliveryChannel !== "delivery" && sla.deliveryChannel !== "pickup-in-point") {
      continue;
    }

    const packageKey = packageSignature(sla);
    if (seenPackages.has(packageKey)) {
      continue;
    }
    seenPackages.add(packageKey);

    const breakdown = breakdownFromTotal(sla.price, sla.deliveryChannel);
    if (breakdown === undefined) {
      continue;
    }

    hasMappedBreakdown = true;
    total.baseShipping += breakdown.baseShipping;
    total.extraWeight += breakdown.extraWeight;
    total.bags += breakdown.bags;
    total.freeShipping = total.freeShipping && breakdown.freeShipping;
  }

  if (hasPendingEntry) {
    return { status: "pending" };
  }

  if (hasMappedBreakdown) {
    return {
      status: "ready",
      breakdown: total,
    };
  }

  return { status: "unmapped" };
}

function packageSignature(sla: VtexSla): string {
  const ids = sla.deliveryIds;
  if (ids === undefined || ids.length === 0) {
    return sla.id;
  }
  const fingerprint = ids
    .map((d) => `${d.courierId}|${d.warehouseId}|${d.dockId}`)
    .sort()
    .join(",");
  return `${sla.id}#${fingerprint}`;
}
