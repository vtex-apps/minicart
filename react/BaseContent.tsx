import React, {
  FC,
  useEffect,
  Children,
  ReactElement,
  Fragment,
  memo,
} from 'react'
import { FormattedMessage } from 'react-intl'
import { ExtensionPoint, useRuntime } from 'vtex.render-runtime'
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

const MinicartHeader: FC<{ minicarTitleHandle: string }> = memo(
  ({ minicarTitleHandle }) => (
    <h3 className={`${minicarTitleHandle} t-heading-3 mv2 c-on-base`}>
      <FormattedMessage id="store/minicart.title" />
    </h3>
  )
)

const Content: FC<Props> = ({ finishShoppingButtonLink, children }) => {
  const { orderForm, loading }: OrderFormContext = useOrderForm()
  const push = useDebouncedPush()
  const handles = useCssHandles(CSS_HANDLES)
  const { variation } = useMinicartState()
  const { url: checkoutUrl, major } = useCheckoutURL()
  const { navigate } = useRuntime()

  const goToCheckout = (url: string) => {
    if (major) {
      navigate({ to: url })
    } else {
      window.location.href = url
    }
  }

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

  if (isCartEmpty) {
    return (
      <Fragment>
        <MinicartHeader minicarTitleHandle={handles.minicartTitle} />
        <ExtensionPoint id="minicart-empty-state" />
      </Fragment>
    )
  }

  if (hasChildren) {
    return (
      <div className={minicartContentClasses}>
        <MinicartHeader minicarTitleHandle={handles.minicartTitle} />
        {Children.map(children, child =>
          React.cloneElement(child as ReactElement, { renderAsChildren: true })
        )}
      </div>
    )
  }

  return (
    <div className={minicartContentClasses}>
      <div
        className={`w-100 h-100 overflow-y-auto ${handles.minicartProductListContainer}`}
      >
        <MinicartHeader minicarTitleHandle={handles.minicartTitle} />
        <ExtensionPoint id="minicart-product-list" />
      </div>
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
    </div>
  )
}

export default Content
