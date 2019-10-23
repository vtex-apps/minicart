import React, { useState } from 'react'
import { ButtonWithIcon, Button } from 'vtex.styleguide'
import { IconCart } from 'vtex.store-icons'
import { ExtensionPoint } from 'vtex.render-runtime'
import { OrderQueueProvider } from 'vtex.order-manager/OrderQueue'
import { OrderFormProvider, useOrderForm } from 'vtex.order-manager/OrderForm'

import Popup from './Popup'

const Minicart = () => {
  const { loading, orderForm } = useOrderForm()
  const [isOpen, setIsOpen] = useState(false)

  console.log(orderForm)

  if (loading) {
    return <span>Loading...</span>
  }

  // const getFilteredItems = () => {
  //   return orderForm.items.filter(shouldShowItem)
  // }

  // const itemsToShow = getFilteredItems()
  // const totalItemsSum = arr =>
  //   arr.reduce((sum, product) => sum + product.quantity, 0)
  // const quantity = showTotalItemsQty
  //   ? totalItemsSum(itemsToShow)
  //   : itemsToShow.length

  // const priceClasses = classNames(
  //   `${styles.label} dn-m db-l t-action--small ${labelClasses}`,
  //   {
  //     pl6: quantity > 0,
  //     pl4: quantity <= 0,
  //   }
  // )

  // const isPriceVisible = false
  // const iconLabelClasses = classNames(
  //   `${styles.label} dn-m db-l ${
  //     isPriceVisible ? 't-mini' : 't-action--small'
  //   } ${labelClasses}`,
  //   {
  //     pl6: quantity > 0,
  //     pl4: quantity <= 0,
  //   }
  // )

  return (
    <aside className={`relative fr flex items-center`}>
      <div className="flex flex-column">
        <ButtonWithIcon
          icon={
            <span className={`relative`}>
              <IconCart />
              {/* {quantity > 0 && (
                <span
                  data-testid="item-qty"
                  className={`${styles.badge} c-on-emphasis absolute t-mini bg-emphasis br4 w1 h1 pa1 flex justify-center items-center lh-solid`}
                >
                  {quantity}
                </span>
              )} */}
            </span>
          }
          variation="tertiary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* {(iconLabel || isPriceVisible) && (
            <span className="flex items-center">
              <span className="flex flex-column items-start">
                {iconLabel && (
                  <span className={iconLabelClasses}>{iconLabel}</span>
                )}
                {isPriceVisible && (
                  <span data-testid="total-price" className={priceClasses}>
                    <div>
                      <ProductPrice
                        showLabels={false}
                        showListPrice={false}
                        sellingPrice={orderForm.value}
                      />
                    </div>
                  </span>
                )}
              </span>
            </span>
          )} */}
        </ButtonWithIcon>
        {isOpen && (
          <Popup onOutsideClick={() => setIsOpen(!isOpen)}>
            <ExtensionPoint id="minicart-product-list-wrapper" />
            <div className="pv3">
              <Button
                id="proceed-to-checkout"
                href="/checkout/#payment"
                variation="primary"
                size="large"
                block
              >
                {/* <FormattedMessage id="store/cart.checkout" /> */}
                Go to checkout
              </Button>
            </div>
          </Popup>
        )}
        {/* {!hideContent &&
          (isSizeLarge ? (
            <Sidebar
              quantity={quantity}
              iconSize={iconSize}
              onOutsideClick={handleUpdateContentVisibility}
              isOpen={isOpen}
            >
              {miniCartContent}
            </Sidebar>
          ) : (
            isOpen && (
              <Popup onOutsideClick={handleUpdateContentVisibility}>
                {miniCartContent}
              </Popup>
            )
          ))} */}
      </div>
    </aside>
  )
}

const EnhancedMinicart = () => (
  <OrderQueueProvider>
    <OrderFormProvider>
      <Minicart />
    </OrderFormProvider>
  </OrderQueueProvider>
)

export default EnhancedMinicart
