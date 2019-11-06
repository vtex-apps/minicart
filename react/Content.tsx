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

interface Props {
  sideBarMode: boolean
}

const CSS_HANDLES = [
  'minicartContent',
  'minicartFooter',
  'minicartEmptyStateText',
  'minicartEmptyStateContainer',
] as const

const Content: FC<Props> = ({ sideBarMode }) => {
  const { orderForm, loading }: OrderFormContext = useOrderForm()
  const handles = useCssHandles(CSS_HANDLES)

  const sideBarStyles = {
    height: '100%',
  }

  const popupStyles = {
    maxHeight: 500,
  }

  return !loading && orderForm.items.length === 0 ? (
    <div
      className={`${handles.minicartEmptyStateContainer} pa9 flex justify-center`}
      style={{ width: 340 }}
    >
      <span className={`${handles.minicartEmptyStateText} t-body`}>
        <FormattedMessage id="store/minicart.empty-state" />
      </span>
    </div>
  ) : (
    <div
      className={`${handles.minicartContent} flex flex-column`}
      style={sideBarMode ? sideBarStyles : popupStyles}
    >
      <h3 className="t-heading-3 mv2 c-on-base">Cart</h3>
      <ExtensionPoint id="minicart-product-list" />
      <div
        className={`${handles.minicartFooter} ${
          sideBarMode ? 'pa4' : 'pv3'
        } sticky`}
      >
        <ExtensionPoint id="minicart-summary" />
        <Button
          id="proceed-to-checkout"
          href="/checkout/#/cart"
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
