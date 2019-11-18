import React from 'react'
import { ButtonWithIcon } from 'vtex.styleguide'
import { IconCart } from 'vtex.store-icons'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['minicartIconContainer', 'minicartQuantityBadge'] as const

const MinicartIconButton = () => {
  const {
    orderForm,
    loading,
  }: { loading: boolean; orderForm: OrderForm } = useOrderForm()
  const handles = useCssHandles(CSS_HANDLES)

  const itemQuantity = loading ? 0 : orderForm.items.length

  return (
    <ButtonWithIcon
      icon={
        <span
          ref={minicartIconRef}
          className={`${handles.minicartIconContainer} gray relative`}
        >
          <IconCart />
          {itemQuantity > 0 && (
            <span
              data-testid="item-qty"
              style={{
                top: '-0.7rem',
                right: '-0.8rem',
              }}
              className={`${handles.minicartQuantityBadge} c-on-emphasis absolute t-mini bg-emphasis br4 w1 h1 pa1 flex justify-center items-center lh-solid`}
            >
              {itemQuantity}
            </span>
          )}
        </span>
      }
      variation="tertiary"
      onClick={() => setIsOpen(!isOpen)}
    />
  )
}

export default MinicartIconButton
