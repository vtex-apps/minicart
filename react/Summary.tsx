import React, { FC, useEffect, useMemo, useState } from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useCssHandles, CssHandlesTypes } from 'vtex.css-handles'

import { fetchWithRetry } from './legacy/utils/fetchWithRetry'
import useShippingBreakdownFromCartContext from './modules/useShippingBreakdownFromCartContext'

const CSS_HANDLES = ['minicartSummary'] as const


interface Props {
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>
}

const Summary: FC<Props> = ({ classes }) => {
  const { orderForm }: OrderFormContext = useOrderForm()
  const {
    totalizers = [],
    value = 0,
    items = [],
    paymentData,
  } = orderForm ?? {}
  const { bagsValue } = useShippingBreakdownFromCartContext()


  const [sgrSkuIds, setSgrSkuIds] = useState<string[]>([])

  useEffect(() => {
    let isSubscribed = true

    fetchWithRetry<PackagesSkuIds>('/auchan/v1/cart-manager/app-settings', 3).then(
      res => {
        if (res && isSubscribed) {
          try {
            const { sgrSettings = {} } = res?.data ?? {}

            const allSkuIds: string[] = []

            Object.values(
              sgrSettings as Record<string, { skuIds?: string[] }>
            ).forEach(sgrType => {
              if (sgrType?.skuIds) {
                allSkuIds.push(...sgrType.skuIds)
              }
            })

            setSgrSkuIds(allSkuIds)
          } catch (error) {
            console.error('Error in packages feature.', error)
          }
        }
      }
    )

    return () => {
      isSubscribed = false
    }
  }, [])

  const sgrValue = useMemo(() => {
    if (!sgrSkuIds.length) {
      return
    }
    return items.reduce((total: number, item: OrderFormItem) => {
      if (sgrSkuIds.includes(item.id)) {
        return (
          total + ((item?.listPrice as number) ?? 0) * (item?.quantity ?? 1)
        )
      }
      return total
    }, 0)
  }, [items, sgrSkuIds])

  let newTotalizers = totalizers

  newTotalizers = JSON.parse(JSON.stringify(totalizers))
  const totalizerItems = newTotalizers.find((t: { id: string }) => t.id === 'Items')
  const shippingTotalizer = newTotalizers.find(
    (t: { id: string }) => t.id === 'Shipping'
  )

  if (bagsValue > 0) {
    newTotalizers.push({
      id: 'Packaging',
      name: 'Taxă operațională',
      value: bagsValue,
      __typename: 'Totalizer',
    })

    if (shippingTotalizer) {
      shippingTotalizer.value = Math.max(shippingTotalizer.value - bagsValue, 0)
    }
  }

  if (sgrValue && typeof sgrValue === 'number') {
    newTotalizers.push({
      id: 'SGR',
      name: 'Garantie',
      value: sgrValue,
      __typename: 'Totalizer',
    })
    if (totalizerItems) {
      totalizerItems.value -= sgrValue ?? 0
    }
  }

  const { handles } = useCssHandles(CSS_HANDLES, { classes })

  const originalValue =
    items?.reduce(
      (total: number, item: OrderFormItem) =>
        (total as number) +
        ((item?.listPrice as number) ?? 0) * (item?.quantity ?? 1),
      0
    ) ?? 0

  return (
    <div className={`${handles.minicartSummary} ph4 ph6-l pt5`}>
      <ExtensionPoint
        id="checkout-summary"
        totalizers={newTotalizers}
        paymentData={paymentData}
        total={value}
        originalTotal={originalValue}
      />
    </div>
  )
}

export default Summary
