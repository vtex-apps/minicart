import React, { FC } from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useCssHandles, CssHandlesTypes } from 'vtex.css-handles'

const CSS_HANDLES = ['minicartSummary'] as const

interface Props {
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>
}

const Summary: FC<Props> = ({ classes }) => {
  const {
    orderForm: { totalizers, value },
  } = useOrderForm()

  const { handles } = useCssHandles(CSS_HANDLES, { classes })

  return (
    <div className={`${handles.minicartSummary} ph4 ph6-l pt5`}>
      <ExtensionPoint
        id="checkout-summary"
        totalizers={totalizers}
        total={value}
      />
    </div>
  )
}

export default Summary
