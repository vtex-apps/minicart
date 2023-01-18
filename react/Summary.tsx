import React, { FC } from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { OrderForm as OrderFormComponent } from 'vtex.order-manager'
import { useCssHandles, CssHandlesTypes } from 'vtex.css-handles'

const CSS_HANDLES = ['minicartSummary'] as const

interface Props {
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>
}

const Summary: FC<Props> = ({ classes }) => {
  const { useOrderForm } = OrderFormComponent

  const {
    orderForm: { totalizers, value, items, paymentData },
  } = useOrderForm()

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
        totalizers={totalizers}
        paymentData={paymentData}
        total={value}
        originalTotal={originalValue}
      />
    </div>
  )
}

export default Summary
