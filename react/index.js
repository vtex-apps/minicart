import { path, pathOr, pick } from 'ramda'
import React, { Component } from 'react'
import { Button } from 'vtex.styleguide'
import { isMobile } from 'react-device-detect'
import { withRuntimeContext } from 'vtex.render-runtime'
import { IconCart } from 'vtex.dreamstore-icons'
import { orderForm } from 'vtex.store-resources/Queries'
import { addToCart, updateItems } from 'vtex.store-resources/Mutations'
import { Pixel } from 'vtex.pixel-manager/PixelContext'
import { compose, graphql, withApollo } from 'react-apollo'

import MiniCartContent from './components/MiniCartContent'
import { MiniCartPropTypes } from './propTypes'
import Sidebar from './components/Sidebar'
import Popup from './components/Popup'
import { isParentItem } from './utils/itemsHelper'

import { fullMinicartQuery } from './linkState/queries'
import {
  updateItemsMutation,
  updateOrderFormMutation,
} from './linkState/mutations'

import minicart from './minicart.css'

const MINIMUM_MAX_QUANTITY = 1
const MAXIMUM_MAX_QUANTITY = 10
const DEFAULT_MAX_QUANTITY = 1
const DEFAULT_LABEL_CLASSES = ''
const DEFAULT_ICON_CLASSES = 'gray'

/**
 * Minicart component
 */
export class MiniCart extends Component {
  static propTypes = MiniCartPropTypes

  static defaultProps = {
    maxQuantity: DEFAULT_MAX_QUANTITY,
    labelClasses: DEFAULT_LABEL_CLASSES,
    iconClasses: DEFAULT_ICON_CLASSES,
  }

  state = {
    openContent: false,
    updatingOrderForm: false,
  }

  debounce = null

  async componentDidUpdate(prevProps) {
    this.handleItemsUpdate()
    this.handleOrderFormUpdate(prevProps)
  }

  getClientOnlyItems = () => {
    const clientItems = pathOr([], ['linkState', 'minicartItems'], this.props)
    return clientItems.filter(({ upToDate }) => !upToDate)
  }

  handleItemsUpdate = async () => {
    const clientOnlyItems = this.getClientOnlyItems()
    console.log(clientOnlyItems)
    if (clientOnlyItems.length && !this.state.updatingOrderForm) {
      return this.handleItemsDifference(clientOnlyItems)
    }
  }

  handleItemsDifference = async clientItems => {
    this.setState({ updatingOrderForm: true })
    try {
      const items = clientItems.map(pick(['id', 'index', 'quantity', 'seller']))
      const addItemsResponse = await this.addItems(items)
      const updateItemsResponse = await this.updateItems(items)
      const newOrderForm = pathOr(
        path(['data', 'addItem'], addItemsResponse),
        ['data', 'updateItems'],
        updateItemsResponse
      )
      await this.props.updateOrderForm(newOrderForm)
      this.props.push({
        event: 'addToCart',
        items: clientItems,
      })
    } catch (err) {
      // TODO: Toast error message
      console.error(err)
    } finally {
      this.setState({ updatingOrderForm: false })
    }
  }

  handleOrderFormUpdate = async prevProps => {
    const prevOrderForm = path(['data', 'orderForm'], prevProps)
    const orderForm = path(['data', 'orderForm'], this.props)
    if (!prevOrderForm && orderForm) {
      await this.props.updateOrderForm(orderForm)
    }
  }

  addItems = items => {
    const {
      orderForm: { orderFormId, items: serverItems },
    } = this.props.data
    const itemsToAdd = items.filter(
      ({ id }) => !serverItems.find(({ id: serverId }) => serverId === id)
    )

    if (itemsToAdd.length) {
      return this.props.addToCart({ variables: { orderFormId, items } })
    }
  }

  updateItems = items => {
    const {
      orderForm: { orderFormId, items: serverItems },
    } = this.props.data
    const itemsToUpdate = items.filter(({ id }) =>
      serverItems.find(({ id: serverId }) => serverId === id)
    )

    if (itemsToUpdate.length) {
      return this.props.updateItems({ variables: { orderFormId, items } })
    }
  }

  handleClickButton = event => {
    if (!this.props.hideContent) {
      this.setState({
        openContent: !this.state.openContent,
      })
    }
    event.persist()
  }

  handleUpdateContentVisibility = () => {
    this.setState({
      openContent: false,
    })
  }

  handleClickProduct = detailUrl => {
    this.setState({
      openContent: false,
    })
    const {
      runtime: { navigate },
    } = this.props
    navigate({
      to: detailUrl,
    })
  }

  get itemsQuantity() {
    const items = pathOr([], ['linkState', 'minicartItems'], this.props)
    return items.filter(item => isParentItem(item) && item.quantity).length
  }

  render() {
    const { openContent } = this.state
    const {
      labelMiniCartEmpty,
      labelButtonFinishShopping,
      iconClasses,
      iconSize,
      iconLabel,
      labelClasses,
      showRemoveButton,
      showDiscount,
      showSku,
      enableQuantitySelector,
      maxQuantity,
      data,
      type,
      hideContent,
      showShippingCost,
      linkState: { minicartItems, orderForm },
    } = this.props

    const quantity = this.itemsQuantity

    const isSizeLarge =
      (type && type === 'sidebar') ||
      isMobile ||
      (window && window.innerWidth <= 480)

    const miniCartContent = (
      <MiniCartContent
        isSizeLarge={isSizeLarge}
        data={{
          ...data,
          orderForm: {
            ...orderForm,
            items: minicartItems,
          },
        }}
        showRemoveButton={showRemoveButton}
        showDiscount={showDiscount}
        showSku={showSku}
        labelMiniCartEmpty={labelMiniCartEmpty}
        labelButton={labelButtonFinishShopping}
        enableQuantitySelector={enableQuantitySelector}
        maxQuantity={maxQuantity}
        onClickProduct={this.handleClickProduct}
        onClickAction={this.handleUpdateContentVisibility}
        showShippingCost={showShippingCost}
        updatingOrderForm={this.state.updatingOrderForm}
      />
    )

    return (
      <aside
        className={`${minicart.container} relative flex items-center fr`}
        ref={e => {
          this.iconRef = e
        }}
      >
        <Button
          variation="tertiary"
          icon
          onClick={event => this.handleClickButton(event)}
        >
          <span className="flex items-center">
            <span className={`relative ${iconClasses}`}>
              <IconCart size={iconSize} />
              {quantity > 0 && (
                <span
                  className={`${
                    minicart.badge
                  } c-on-emphasis absolute t-mini bg-emphasis br4 w1 h1 pa1 flex justify-center items-center lh-solid`}
                >
                  {quantity}
                </span>
              )}
            </span>
            {iconLabel && (
              <span
                className={`${minicart.label} dn-m db-l t-action--small pl${
                  quantity > 0 ? '6' : '4'
                } ${labelClasses}`}
              >
                {iconLabel}
              </span>
            )}
          </span>
        </Button>
        {!hideContent &&
          (isSizeLarge ? (
            <Sidebar
              quantity={quantity}
              iconSize={iconSize}
              onOutsideClick={this.handleUpdateContentVisibility}
              isOpen={openContent}
            >
              {miniCartContent}
            </Sidebar>
          ) : (
            openContent && (
              <Popup
                onOutsideClick={this.handleUpdateContentVisibility}
                buttonOffsetWidth={this.iconRef.offsetWidth}
              >
                {miniCartContent}
              </Popup>
            )
          ))}
      </aside>
    )
  }
}

MiniCart.getSchema = props => {
  const getQuantitySelectorSchema = () => {
    return {
      maxQuantity: {
        title: 'editor.minicart.maxQuantity.title',
        type: 'number',
        minimum: MINIMUM_MAX_QUANTITY,
        maximum: MAXIMUM_MAX_QUANTITY,
        default: DEFAULT_MAX_QUANTITY,
        widget: {
          'ui:widget': 'range',
        },
        isLayout: true,
      },
    }
  }

  const generatedSchema =
    props && props.enableQuantitySelector && getQuantitySelectorSchema()

  return {
    title: 'editor.minicart.title',
    description: 'editor.minicart.description',
    type: 'object',
    properties: {
      type: {
        title: 'editor.minicart.type.title',
        type: 'string',
        default: 'popup',
        enum: ['popup', 'sidebar'],
        enumNames: [
          'editor.minicart.type.popup',
          'editor.minicart.type.sidebar',
        ],
        widget: {
          'ui:widget': 'radio',
          'ui:options': {
            inline: true,
          },
        },
        isLayout: true,
      },
      showRemoveButton: {
        title: 'editor.minicart.showRemoveButton.title',
        type: 'boolean',
        isLayout: true,
      },
      showDiscount: {
        title: 'editor.minicart.showDiscount.title',
        type: 'boolean',
        isLayout: true,
      },
      showSku: {
        title: 'editor.minicart.showSku.title',
        type: 'boolean',
        isLayout: true,
      },
      labelMiniCartEmpty: {
        title: 'editor.minicart.labelMiniCartEmpty.title',
        type: 'string',
        isLayout: false,
      },
      labelButtonFinishShopping: {
        title: 'editor.minicart.labelButtonFinishShopping.title',
        type: 'string',
        isLayout: false,
      },
      enableQuantitySelector: {
        title: 'editor.minicart.enableQuantitySelector.title',
        type: 'boolean',
        isLayout: true,
      },
      ...generatedSchema,
    },
  }
}

const withLinkStateMinicartQuery = graphql(fullMinicartQuery, {
  props: ({ data: { minicart } }) => ({
    linkState: {
      minicartItems: minicart && minicart.items,
      orderForm: minicart && minicart.orderForm,
    },
  }),
})

const withLinkStateUpdateItemsMutation = graphql(updateItemsMutation, {
  name: 'updateLinkStateItems',
  props: ({ updateLinkStateItems }) => ({
    updateLinkStateItems: items =>
      updateLinkStateItems({ variables: { items } }),
  }),
})

const withLinkStateUpdateOrderFormMutation = graphql(updateOrderFormMutation, {
  name: 'updateOrderForm',
  props: ({ updateOrderForm }) => ({
    updateOrderForm: orderForm => updateOrderForm({ variables: { orderForm } }),
  }),
})

export default compose(
  graphql(orderForm, { options: () => ({ ssr: false }) }),
  graphql(addToCart, { name: 'addToCart' }),
  graphql(updateItems, { name: 'updateItems' }),
  withLinkStateMinicartQuery,
  withLinkStateUpdateItemsMutation,
  withLinkStateUpdateOrderFormMutation,
  withRuntimeContext,
  withApollo,
  Pixel
)(MiniCart)
