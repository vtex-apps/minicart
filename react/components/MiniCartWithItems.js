import React, { Fragment } from 'react'
import classNames from 'classnames'
import { usePixel } from 'vtex.pixel-manager/PixelContext'
import { ExtensionPoint } from 'vtex.render-runtime'
import { Button } from 'vtex.styleguide'
import { useMutation } from 'react-apollo'
import { propEq, find } from 'ramda'
import { IconDelete } from 'vtex.store-icons'

import { ITEMS_STATUS } from '../localState/index'
import updateItemsMutation from '../localState/graphql/updateItemsMutation.gql'
import updateLocalItemsMutation from '../localState/graphql/updateLocalItemsMutation.gql'
import styles from '../minicart.css'
import MiniCartFooter from './MiniCartFooter'
import { mapCartItemToPixel } from '../utils/pixelHelper'
import { changeImageUrlSize, toHttps } from '../utils/urlHelpers'

const MIN_ITEMS_TO_SCROLL = 2

const getShippingCost = orderForm => {
  const totalizer = find(propEq('id', 'Shipping'))(orderForm.totalizers || [])
  return (totalizer && totalizer.value / 100) || 0
}

const calculateDiscount = items =>
  items.reduce(
    (sum, { listPrice, sellingPrice, quantity }) =>
      sum + (listPrice - sellingPrice) * quantity,
    0
  )

const sumItemsPrice = items =>
  items.reduce(
    (sum, { sellingPrice, quantity }) => sum + sellingPrice * quantity,
    0
  )

const calculateTotalValue = orderForm =>
  getShippingCost(orderForm) ? orderForm.value : sumItemsPrice(orderForm.items)

const createProductShapeFromItem = item => ({
  productName: item.name,
  linkText: item.detailUrl.replace(/^\//, '').replace(/\/p$/, ''),
  sku: {
    seller: {
      commertialOffer: {
        Price: item.sellingPriceWithAssemblies * item.quantity,
        ListPrice: item.listPrice,
      },
      sellerId: item.seller,
    },
    name: item.skuName,
    itemId: item.id,
    image: {
      imageUrl: changeImageUrlSize(toHttps(item ? item.imageUrl : ''), 240),
    },
  },
  assemblyOptions: item.assemblyOptions,
  quantity: item.quantity,
  cartIndex: item.cartIndex,
})

const MiniCartWithItems = ({
  itemsToShow,
  orderForm,
  updatingOrderForm,
  linkButton,
  labelButton,
  showDiscount,
  onClickAction,
  isSizeLarge,
  showShippingCost,
}) => {
  const [updateItems] = useMutation(updateItemsMutation)
  const [updateLocalItems] = useMutation(updateLocalItemsMutation)
  const { push } = usePixel()
  const { items } = orderForm

  const classes = classNames(`${styles.content} overflow-x-hidden pa1`, {
    [`${styles.contentSmall} bg-base`]: !isSizeLarge,
    [`${styles.contentLarge}`]: isSizeLarge,
    'overflow-y-scroll':
      itemsToShow.length > MIN_ITEMS_TO_SCROLL && !isSizeLarge,
  })

  const handleItemRemoval = async (item, index) => {
    const updatedItems = [
      {
        id: item.id,
        index: item.cartIndex != null ? item.cartIndex : index,
        quantity: 0,
      },
    ]

    try {
      if (item.cartIndex != null) {
        await updateItems({ variables: { items: updatedItems } })
      } else {
        await updateLocalItems({ variables: { items: updatedItems } })
      }

      push({
        event: 'removeFromCart',
        items: [mapCartItemToPixel(item)],
      })
    } catch (error) {
      // TODO: Toast error message
      console.error(error)
    }
  }

  const isUpdating =
    updatingOrderForm || items.some(item => item.quantity === 0)

  return (
    <Fragment>
      <div className={classes}>
        {itemsToShow.map((item, index) => (
          <Fragment key={item.id}>
            <section className="relative flex">
              <div className="fr absolute top-0 right-0">
                <Button
                  icon
                  variation="tertiary"
                  onClick={() => handleItemRemoval(item, index)}
                >
                  <IconDelete size={15} activeClassName="c-muted-2" />
                </Button>
              </div>
              <ExtensionPoint
                id="product-summary"
                showBorders
                product={createProductShapeFromItem(item)}
                name={item.name}
                displayMode="inlinePrice"
                showListPrice={false}
                showBadge={false}
                showInstallments={false}
                showLabels={false}
                actionOnClick={onClickAction}
                muted={item.localStatus !== ITEMS_STATUS.NONE}
                index={index}
              />
            </section>
          </Fragment>
        ))}
      </div>
      <MiniCartFooter
        shippingCost={getShippingCost(orderForm)}
        isUpdating={isUpdating}
        totalValue={calculateTotalValue(orderForm)}
        discount={calculateDiscount(orderForm.items)}
        buttonLink={linkButton}
        buttonLabel={labelButton}
        isSizeLarge={isSizeLarge}
        showDiscount={showDiscount}
        showShippingCost={showShippingCost}
      />
    </Fragment>
  )
}

export default MiniCartWithItems
