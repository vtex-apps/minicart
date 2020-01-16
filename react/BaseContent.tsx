import React, { FC, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { ExtensionPoint, useChildBlock } from 'vtex.render-runtime'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useCssHandles } from 'vtex.css-handles'

import { useMinicartState } from './MinicartContext'
import styles from './styles.css'
import { mapCartItemToPixel } from './modules/pixelHelper'
import useDebouncedPush from './modules/debouncedPixelHook'

interface Props {
  finishShoppingButtonLink: string
}

const CSS_HANDLES = [
  'minicartContentContainer',
  'minicartProductListContainer',
  'minicartTitle',
  'minicartFooter',
] as const

const Content: FC<Props> = ({ finishShoppingButtonLink }) => {
  const { orderForm, loading }: OrderFormContext = useOrderForm()
  const push = useDebouncedPush()
  const handles = useCssHandles(CSS_HANDLES)
  const { variation } = useMinicartState()

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

  const isCartEmpty = !loading && orderForm.items.length === 0

  const hasMinicartContentBlock = useChildBlock({ id: 'minicart-content' })

  if (hasMinicartContentBlock) {
    return (
      <div className={minicartContentClasses}>
        <div className={`w-100 ${handles.minicartProductListContainer}`}>
          <h3 className={`${handles.minicartTitle} t-heading-3 mv2 c-on-base`}>
            <FormattedMessage id="store/minicart.title" />
          </h3>
          {isCartEmpty ? (
            <ExtensionPoint id="minicart-empty-state" />
          ) : (
            <ExtensionPoint id="minicart-content" />
          )}
        </div>
      </div>
    )
  }

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
        ) : (
          <ExtensionPoint id="minicart-product-list" />
        )}
      </div>
      {!isCartEmpty && (
        <ExtensionPoint
          id="minicart-summary"
          finishShoppingButtonLink={finishShoppingButtonLink}
        />
      )}
    </div>
  )
}

export default Content
