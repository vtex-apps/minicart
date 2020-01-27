import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { useCheckoutURL } from 'vtex.checkout-resources/Utils'

interface Props {
  finishShoppingButtonLink: string
}

const CSS_HANDLES = ['minicartCheckoutButton'] as const

const CheckoutButton: FC<Props> = ({ finishShoppingButtonLink }) => {
  const { url: checkoutUrl } = useCheckoutURL()
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={`${handles.minicartCheckoutButton} mv3`}>
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

export default CheckoutButton
