import React, { FC, useEffect, Children } from 'react'
import { FormattedMessage } from 'react-intl'
import { ExtensionPoint, useChildBlock } from 'vtex.render-runtime'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useCheckoutURL } from 'vtex.checkout-resources/Utils'
import { useCssHandles } from 'vtex.css-handles'
import { Button } from 'vtex.styleguide'

import { useMinicartState } from './MinicartContext'
import styles from './styles.css'
import { mapCartItemToPixel } from './modules/pixelHelper'
import useDebouncedPush from './modules/debouncedPixelHook'

interface Props {
  sideBarMode: boolean
  finishShoppingButtonLink: string
}

const CSS_HANDLES = [
  'minicartContentContainer',
  'minicartProductListContainer',
  'minicartTitle',
  'minicartFooter',
] as const

const Content: FC<Props> = ({ finishShoppingButtonLink, children }) => {
  const { orderForm, loading }: OrderFormContext = useOrderForm()
  const push = useDebouncedPush()
  const handles = useCssHandles(CSS_HANDLES)
  const { variation } = useMinicartState()
  const { url: checkoutUrl } = useCheckoutURL()
  const hasMinicartFooter = useChildBlock({ id: 'sticky-layout' })

  useEffect(() => {
    if (loading) {
      return
    }

    push({
      event: 'cartChanged',
      items: orderForm.items.map(mapCartItemToPixel),
    })
  }, [push, loading, orderForm.items])

  const minicartContentClasses = `${handles.minicartContentContainer} ${
    variation === 'drawer' ? styles.drawerStyles : styles.popupStyles
  } flex flex-column justify-between`

  const minicartFooterClasses = `${handles.minicartFooter} ${
    variation === 'drawer' ? 'pa4' : 'pv3'
  } sticky`

  const isCartEmpty = !loading && orderForm.items.length === 0
  const hasChildren = Children.toArray(children).some(Boolean)

  return (
    <div className={minicartContentClasses}>
      <div
        className={`w-100 h-100 overflow-y-auto ${handles.minicartProductListContainer}`}
      >
        <h3 className={`${handles.minicartTitle} t-heading-3 mv2 c-on-base`}>
          <FormattedMessage id="store/minicart.title" />
        </h3>
        {isCartEmpty ? (
          <ExtensionPoint id="minicart-empty-state" />
        ) : hasChildren ? (
          children
        ) : (
          <ExtensionPoint id="minicart-product-list" />
        )}
      </div>
      {!isCartEmpty &&
        (hasMinicartFooter ? (
          <ExtensionPoint id="sticky-layout" />
        ) : (
          <div className={minicartFooterClasses}>
            <ExtensionPoint id="minicart-summary" />
            <Button
              id="proceed-to-checkout"
              href={finishShoppingButtonLink || checkoutUrl}
              variation="primary"
              block
            >
              <FormattedMessage id="store/minicart.go-to-checkout" />
            </Button>
          </div>
        ))}
    </div>
  )
}

export default Content
