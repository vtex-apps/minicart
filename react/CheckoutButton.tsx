import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'
import { CssHandlesTypes, useCssHandles } from 'vtex.css-handles'
import { useCheckoutURL } from 'vtex.checkout-resources/Utils'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { mapCartItemToPixel } from './modules/pixelHelper'
import { usePixel } from 'vtex.pixel-manager'
import useCheckout from './modules/checkoutHook'
const CSS_HANDLES = ['minicartCheckoutButton'] as const

interface Props {
  finishShoppingButtonLink: string
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>
}

const CheckoutButton: FC<Props> = ({ finishShoppingButtonLink, classes }) => {
  const { url: checkoutUrl } = useCheckoutURL()
  const { handles } = useCssHandles(CSS_HANDLES, { classes })
  const { orderForm }: OrderFormContext = useOrderForm()
  const { push } = usePixel()

  const goToCheckout = useCheckout()

  const emitEventAdobeLaunch = () => {   
    if(orderForm.items?.length > 0){
      const data = orderForm.items.map(mapCartItemToPixel)
      push({
        event: "cart",
        items: data
      })
    }
  }

  const handleClick = () => {
    emitEventAdobeLaunch()
    goToCheckout(finishShoppingButtonLink || checkoutUrl)
  }

  return (
    <div className={`${handles.minicartCheckoutButton} mv3 ph4 ph6-l`}>
      <Button
        id="proceed-to-checkout"
        onClick={handleClick}
        variation="primary"
        block
      >
        <FormattedMessage id="store/minicart.go-to-checkout" />
      </Button>
    </div>
  )
}

export default CheckoutButton
