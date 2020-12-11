import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'
import { CssHandlesTypes, useCssHandles } from 'vtex.css-handles'
import { useCheckoutURL } from 'vtex.checkout-resources/Utils'

import useCheckout from './modules/checkoutHook'

const CSS_HANDLES = ['minicartCheckoutButton'] as const

interface Props {
  finishShoppingButtonLink: string
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>
}

const CheckoutButton: FC<Props> = ({ finishShoppingButtonLink, classes }) => {
  const { url: checkoutUrl } = useCheckoutURL()
  const { handles } = useCssHandles(CSS_HANDLES, { classes })
  const goToCheckout = useCheckout()

  return (
    <div className={`${handles.minicartCheckoutButton} mv3 ph4 ph6-l`}>
      <Button
        id="proceed-to-checkout"
        onClick={() => goToCheckout(finishShoppingButtonLink || checkoutUrl)}
        variation="primary"
        block
      >
        <FormattedMessage id="store/minicart.go-to-checkout" />
      </Button>
    </div>
  )
}

export default CheckoutButton
