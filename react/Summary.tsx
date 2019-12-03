import React, { FC } from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useOrderForm } from 'vtex.order-manager/OrderForm'

const Summary: FC = () => {
  const {
    orderForm: { totalizers, value },
  } = useOrderForm()

  return (
    <ExtensionPoint
      id="checkout-summary"
      totalizers={totalizers}
      total={value}
    />
  )
}

export default Summary
