import React, { FC } from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useOrderForm } from 'vtex.order-manager/OrderForm'

const Summary: FC = () => {
  const {
    orderForm: { totalizers, value, paymentData },
  } = useOrderForm()

  return (
    <div className="ph4 ph6-l pt5">
      <ExtensionPoint
        id="checkout-summary"
        totalizers={totalizers}
        paymentData={paymentData}
        total={value}
      />
    </div>
  )
}

export default Summary
