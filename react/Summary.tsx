import React, { FC, useEffect, useMemo, useState } from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { OrderForm as OrderFormComponent, OrderQueue } from 'vtex.order-manager'
import { useCssHandles, CssHandlesTypes } from 'vtex.css-handles'

import { fetchWithRetry } from './legacy/utils/fetchWithRetry'

const CSS_HANDLES = ['minicartSummary'] as const

interface Props {
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>
}

const Summary: FC<Props> = ({ classes }) => {
  const { useOrderForm } = OrderFormComponent;
  const { useOrderQueue, QueueStatus } = OrderQueue;
  const orderFormContext = useOrderForm();

  const {
    orderForm: { totalizers, value, items, paymentData },
  } = orderFormContext;
  const { listen } = useOrderQueue();

  const [finalTotalizers, setFinalTotalizers] = useState(totalizers);

  const [packagesSkuIds, setPackagesSkuIds] = useState<string[]>([])
  const [sgrSkuIds, setSgrSkuIds] = useState<string[]>([])

  useEffect(() => {
    let isSubscribed = true

    fetchWithRetry('/_v/private/api/cart-bags-manager/app-settings', 3).then(
      (res: PackagesSkuIds) => {
        if (res && isSubscribed) {
          try {
            const { bagsSettings, sgrSettings } = res?.data ?? {}

            setPackagesSkuIds(Object.values(bagsSettings))

            const allSkuIds: string[] = []

            Object.values(sgrSettings).forEach(sgrType => {
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

  const flegValue = useMemo(() => {
    if (!packagesSkuIds.length) {
      return
    }
    return items.reduce((total: number, item: OrderFormItem) => {
      if (packagesSkuIds.includes(item.id)) {
        return (
          total + ((item?.listPrice as number) ?? 0) * (item?.quantity ?? 1)
        )
      }
      return total
    }, 0)
  }, [items, packagesSkuIds])

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

  listen(QueueStatus.FULFILLED, () => {
    const onlySgrOrBags = items.every(
      (item: any) =>
        sgrSkuIds.includes(item.id) || packagesSkuIds.includes(item.id)
    )

    if (onlySgrOrBags) {
      computeTotalizers()
    }
  });

  useEffect(() => {
    computeTotalizers()
  }, [items, flegValue, sgrValue, totalizers])

  const computeTotalizers = () => {
    if (!items?.length) {
      setFinalTotalizers([])
      return
    }

    let newTotalizers = JSON.parse(JSON.stringify(totalizers))

    const totalizerItems = newTotalizers.find((t: { id: string }) => t.id === 'Items')

    if (flegValue && typeof flegValue === 'number') {
      newTotalizers.push({
        id: 'Packaging',
        name: 'Taxa ambalare',
        value: flegValue,
        __typename: 'Totalizer',
      })

      if (totalizerItems) {
        totalizerItems.value -= flegValue ?? 0
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

    setFinalTotalizers(newTotalizers)
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
        totalizers={finalTotalizers}
        paymentData={paymentData}
        total={value}
        originalTotal={originalValue}
      />
    </div>
  )
}

export default Summary
