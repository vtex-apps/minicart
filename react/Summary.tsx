import React, { FC } from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useOrderForm } from 'vtex.order-manager/OrderForm'

const Summary: FC<any> = ({ Summary: SummarySlot }) => {
  const {
    orderForm: { totalizers, value },
  } = useOrderForm()

  return (
    <div className="ph4 ph6-l pt5">
      {SummarySlot ? (
        <SummarySlot totalizers={totalizers} total={value} />
      ) : (
        <ExtensionPoint
          id="checkout-summary"
          totalizers={totalizers}
          total={value}
        />
      )}
    </div>
  )
}

export default Summary
