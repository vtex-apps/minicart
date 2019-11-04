import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useCssHandles } from 'vtex.css-handles'
import { Button } from 'vtex.styleguide'

interface OrderFormContext {
  orderForm: OrderForm
  loading: boolean
}

const CSS_HANDLES = [
  'minicartContent',
  'minicartFooter',
  'minicartEmptyStateText',
  'minicartEmptyStateContainer',
] as const

const Content: FC = () => {
  const { orderForm, loading }: OrderFormContext = useOrderForm()
  const handles = useCssHandles(CSS_HANDLES)

  return !loading && orderForm.items.length === 0 ? (
    <div
      className={`${handles.minicartEmptyStateContainer} pa9 flex items-center justify-center relative bg-base`}
    >
      <span className={`${handles.minicartEmptyStateText} t-body`}>
        <FormattedMessage id="store/minicart.empty-state" />
      </span>
    </div>
  ) : (
    <div className={`${handles.minicartContent} flex flex-column`}>
      <ExtensionPoint id="minicart-product-list" />
      <div className={`${handles.minicartFooter} pv3 sticky`}>
        <ExtensionPoint id="minicart-summary" />
        <Button
          id="proceed-to-checkout"
          href="/checkout/#/cart"
          variation="primary"
          size="large"
          block
        >
          <FormattedMessage id="store/minicart.go-to-checkout" />
        </Button>
      </div>
    </div>
  )
}

export default Content
