import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'
import { useCheckoutURL } from 'vtex.checkout-resources/Utils'

interface Props {
  finishShoppingButtonLink: string
}

const CheckoutButton: FC<Props> = ({ finishShoppingButtonLink }) => {
  const { url: checkoutUrl } = useCheckoutURL()

  return (
    <div className="mv3">
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
