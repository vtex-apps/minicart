import { useEffect, useMemo, useState } from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'

import {
  breakdownFromLogisticsInfo,
  ShippingBreakdown,
  ShippingBreakdownResult,
} from './shippingBreakdown'
import { fetchWithRetry } from '../legacy/utils/fetchWithRetry'

type UseShippingBreakdownResult = {
  shippingBreakdown: ShippingBreakdown | undefined
  shippingBreakdownResult: ShippingBreakdownResult
  bagsValue: number
}

const FULL_CART_URL = '/api/checkout/pub/orderForm'
const FULL_CART_RETRIES = 2
const DEBOUNCE_TIME_MS = 1000

export default function useShippingBreakdownFromCartContext(): UseShippingBreakdownResult {
  const { orderForm, loading }: OrderFormContext = useOrderForm()
  const [fullCartShippingData, setFullCartShippingData] =
    useState<ShippingData | undefined>()

  const fullCartRefreshKey = useMemo(() => {
    if (loading || !orderForm) {
      return ''
    }

    const itemsKey = (orderForm.items ?? [])
      .map(
        (item: OrderFormItem) =>
          `${item.id}:${item.quantity}:${item.seller ?? ''}`
      )
      .join('|')

    const shippingDataForRefreshKey =
      orderForm.shippingData?.logisticsInfo?.length
        ? orderForm.shippingData
        : fullCartShippingData

    const logisticsKey = (shippingDataForRefreshKey?.logisticsInfo ?? [])
      .map(
        (logisticsInfo: ShippingDataLogisticsInfo) =>
          `${logisticsInfo.itemIndex}:${logisticsInfo.selectedSla ?? ''}:${
            logisticsInfo.selectedDeliveryChannel ?? ''
          }`
      )
      .join('|')

    return [
      orderForm.value,
      orderForm.marketingData?.coupon ?? '',
      shippingDataForRefreshKey?.address?.addressId ?? '',
      itemsKey,
      logisticsKey,
    ].join('::')
  }, [fullCartShippingData, loading, orderForm])

  useEffect(() => {
    if (loading || !fullCartRefreshKey) {
      return
    }

    let isSubscribed = true
    let debounceTimeout: ReturnType<typeof setTimeout> | undefined

    debounceTimeout = setTimeout(() => {
      fetchWithRetry<CheckoutOrderFormResponse>(FULL_CART_URL, FULL_CART_RETRIES)
        .then(res => {
          if (!isSubscribed) {
            return
          }

          setFullCartShippingData(res?.shippingData)
        })
        .catch(() => {
          if (isSubscribed) {
            setFullCartShippingData(undefined)
          }
        })
    }, DEBOUNCE_TIME_MS)

    return () => {
      isSubscribed = false
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
      }
    }
  }, [fullCartRefreshKey, loading])

  const resolvedShippingData = fullCartShippingData

  return useMemo(() => {
    const shippingBreakdownResult = breakdownFromLogisticsInfo(
      resolvedShippingData?.logisticsInfo ?? []
    )
    const shippingBreakdown =
      shippingBreakdownResult.status === 'ready'
        ? shippingBreakdownResult.breakdown
        : undefined

    return {
      shippingBreakdown,
      shippingBreakdownResult,
      bagsValue: shippingBreakdown?.bags ?? 0,
    }
  }, [resolvedShippingData?.logisticsInfo])
}