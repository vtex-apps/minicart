import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useCheckoutURL } from 'vtex.checkout-resources/Utils'
import { useCssHandles } from 'vtex.css-handles'
import { Button } from 'vtex.styleguide'

import { useMinicartState } from './MinicartContext'

import styles from './styles.css'

interface Props {
  sideBarMode: boolean
  finishShoppingButtonLink: string
}

const CSS_HANDLES = [
  'minicartContent',
  'minicartFooter',
  'minicartEmptyStateText',
  'minicartEmptyStateContainer',
] as const

const Content: FC<Props> = ({ finishShoppingButtonLink }) => {
  const { orderForm, loading }: OrderFormContext = useOrderForm()
  const handles = useCssHandles(CSS_HANDLES)
  const { variation } = useMinicartState()
  const { url: checkoutUrl } = useCheckoutURL()

  const minicartContentClasses = `${handles.minicartContent} ${
    variation === 'drawer' ? styles.drawerStyles : styles.popupStyles
  } flex flex-column justify-between`

  const minicartFooterClasses = `${handles.minicartFooter} ${
    variation === 'drawer' ? 'pa4' : 'pv3'
  } sticky`

  const emptyStateClasses = `${handles.minicartEmptyStateContainer} ${styles.minicartEmptyStateContainerDefault} pa9 flex justify-center`

  return !loading && orderForm.items.length === 0 ? (
    <div className={emptyStateClasses}>
      <span className={`${handles.minicartEmptyStateText} t-body`}>
        <FormattedMessage id="store/minicart.empty-state" />
      </span>
    </div>
  ) : (
    <div className={minicartContentClasses}>
      <div className="w-100 overflow-y-auto">
        <h3 className="t-heading-3 mv2 c-on-base">
          <FormattedMessage id="store/minicart.title" />
        </h3>
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
