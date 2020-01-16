import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useCheckoutURL } from 'vtex.checkout-resources/Utils'
import { Button } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import { useMinicartState } from './MinicartContext'

interface Props {
  finishShoppingButtonLink: string
}

const CSS_HANDLES = ['minicartFooter'] as const

const Summary: FC<Props> = ({ finishShoppingButtonLink }) => {
  const {
    orderForm: { totalizers, value },
  } = useOrderForm()
  const { url: checkoutUrl } = useCheckoutURL()
  const { variation } = useMinicartState()
  const handles = useCssHandles(CSS_HANDLES)

  const minicartFooterClasses = `${handles.minicartFooter} ${
    variation === 'drawer' ? 'pa4' : 'pv3'
  } sticky`

  return (
    <div className={minicartFooterClasses}>
      <ExtensionPoint
        id="checkout-summary"
        totalizers={totalizers}
        total={value}
      />
      <Button
        id="proceed-to-checkout"
        href={finishShoppingButtonLink || checkoutUrl}
        variation="primary"
        block
      >
        <FormattedMessage id="store/minicart.go-to-checkout" />
      </Button>
    </div>
  )
}

export default Summary
