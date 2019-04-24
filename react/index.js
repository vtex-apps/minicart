import classNames from 'classnames'
import hoistNonReactStatics from 'hoist-non-react-statics'
import PropTypes from 'prop-types'
import { map, partition, path, pathOr, pick } from 'ramda'
import React, { Component, useEffect } from 'react'
import { Button, withToast } from 'vtex.styleguide'
import { isMobile } from 'react-device-detect'
import { withRuntimeContext } from 'vtex.render-runtime'
import { IconCart } from 'vtex.store-icons'
import { orderForm } from 'vtex.store-resources/Queries'
import { addToCart, updateItems } from 'vtex.store-resources/Mutations'
import { Pixel } from 'vtex.pixel-manager/PixelContext'
import { compose, graphql, withApollo } from 'react-apollo'
import { injectIntl, intlShape, defineMessages } from 'react-intl'

import MiniCartContent from './components/MiniCartContent'
import { MiniCartPropTypes } from './propTypes'
import Sidebar from './components/Sidebar'
import Popup from './components/Popup'
import { shouldShowItem } from './utils/itemsHelper'

import { fullMinicartQuery } from './localState/queries'
import {
  updateItemsMutation,
  updateOrderFormMutation,
  updateItemsSentToServerMutation,
} from './localState/mutations'

import createLocalState, { ITEMS_STATUS } from './localState'

import minicart from './minicart.css'

const DEFAULT_LABEL_CLASSES = ''
const DEFAULT_ICON_CLASSES = 'gray'

/**
 * Minicart component
 */
class MiniCart extends Component {
  static propTypes = { 
    ...MiniCartPropTypes,
    intl: intlShape.isRequired,
    showToast: PropTypes.func.isRequired,
  }

  static defaultProps = {
    labelClasses: DEFAULT_LABEL_CLASSES,
    iconClasses: DEFAULT_ICON_CLASSES,
  }

  state = {
    openContent: false,
    updatingOrderForm: false,
  }

  async componentDidUpdate(prevProps) {
    await this.handleItemsUpdate()
    this.handleOrderFormUpdate(prevProps)
  }

  getModifiedItemsOnly = () => {
    const clientItems = pathOr([], ['linkState', 'minicartItems'], this.props)
    return clientItems.filter(({ localStatus }) => localStatus === ITEMS_STATUS.MODIFIED)
  }

  handleItemsUpdate = async () => {
    const modifiedItems = this.getModifiedItemsOnly()
    if (modifiedItems.length && !this.state.updatingOrderForm) {
      return this.handleItemsDifference(modifiedItems)
    }
  }

  partitionItemsAddUpdate = clientItems => {
    const isNotInCart = item => item.cartIndex == null
    return partition(isNotInCart, clientItems)
  }

  handleItemsDifference = modifiedItems => {
    this.setState({ updatingOrderForm: true }, () => this.sendModifiedItemsToServer(modifiedItems))
  }

  sendModifiedItemsToServer = async modifiedItems => {
    const { showToast, intl, updateItemsSentToServer } = this.props
    const [itemsToAdd, itemsToUpdate] = this.partitionItemsAddUpdate(modifiedItems)
    await updateItemsSentToServer()
    const pickProps = map(pick(['id', 'index', 'quantity', 'seller', 'options']))
    try {
      const updateItemsResponse = await this.updateItems(pickProps(itemsToUpdate))
      const removedItems = itemsToUpdate.filter(({ quantity }) => quantity === 0)
      if (removedItems.length) {
        this.props.push({
          event: 'removeFromCart',
          items: removedItems,
        })
      }
      const addItemsResponse = await this.addItems(pickProps(itemsToAdd))
      itemsToAdd.length > 0 && this.props.push({
          event: 'addToCart',
          items: itemsToAdd,
        })
      const newModifiedItems = this.getModifiedItemsOnly()
      if (newModifiedItems.length > 0) {
        // If there are new modified items in cart, recursively call this function to send requests to server
        return this.sendModifiedItemsToServer(newModifiedItems)
      }

      const newOrderForm = pathOr(
        path(['data', 'addItem'], addItemsResponse),
        ['data', 'updateItems'],
        updateItemsResponse
      )
      await this.props.updateOrderForm(newOrderForm)
    } catch (err) {
      // TODO: Toast error message into Alert
      console.error(err)
      // Rollback items and orderForm
      const orderForm = path(['data', 'orderForm'], this.props)
      showToast({ message: intl.formatMessage( messages.failure ) })
      await this.props.updateOrderForm(orderForm)
    }
    this.setState({ updatingOrderForm: false })
  }

  handleOrderFormUpdate = async prevProps => {
    const prevOrderForm = path(['data', 'orderForm'], prevProps)
    const orderForm = path(['data', 'orderForm'], this.props)
    if (!prevOrderForm && orderForm) {
      await this.props.updateOrderForm(orderForm)
    }
  }

  addItems = items => {
    const { orderForm: { orderFormId } } = this.props.data
    if (items.length) {
      return this.props.addToCart({
        variables: { orderFormId, items },
      })
    }
  }

  updateItems = items => {
    const { orderForm: { orderFormId } } = this.props.data
    if (items.length) {
      return this.props.updateItems({
        variables: { orderFormId, items },
      })
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

  getFilteredItems = () => {
    const items = pathOr([], ['linkState', 'minicartItems'], this.props)
    return items.filter(shouldShowItem)
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
      showDiscount,
      data,
      type,
      hideContent,
      showShippingCost,
      linkState: { minicartItems: items, orderForm },
    } = this.props

    const itemsToShow = this.getFilteredItems()
    const quantity = itemsToShow.length

    const isSizeLarge =
      (type && type === 'sidebar') ||
      isMobile ||
      (window && window.innerWidth <= 480)

    const miniCartContent = (
      <MiniCartContent
        isSizeLarge={isSizeLarge}
        itemsToShow={itemsToShow}
        orderForm={{
          ...orderForm,
          items,
        }}
        loading={data.loading}
        showDiscount={showDiscount}
        labelMiniCartEmpty={labelMiniCartEmpty}
        labelButton={labelButtonFinishShopping}
        onClickProduct={this.handleClickProduct}
        onClickAction={this.handleUpdateContentVisibility}
        showShippingCost={showShippingCost}
        updatingOrderForm={this.state.updatingOrderForm}
      />
    )

    const iconLabelClasses = classNames(
      `${minicart.label} dn-m db-l t-action--small ${labelClasses}`,
      {
        pl6: quantity > 0,
        pl4: quantity <= 0,
      }
    )

    return (
      <aside
        className={`${minicart.container} relative fr flex items-center`}
        ref={e => (this.iconRef = e)}
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
            {iconLabel && <span className={iconLabelClasses}>{iconLabel}</span>}
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

const messages = defineMessages({
  failure: {
    id: 'admin/minicart.checkout-failure',
    defaultMessage: 'Something went wrong. Please, try again.',
  },
  minicartDescription: {
    id: 'admin/editor.minicart.description',
    defaultMessage: 'A simple mini cart that shows all products added to it',
  },
  minicartTitle: {
    id: 'admin/editor.minicart.title',
    defaultMessage: 'Mini Cart',
  },
  minicartTypeTitle: {
    id: 'admin/editor.minicart.type.title',
    defaultMessage: 'Mini Cart Type',
  },
  minicartTypePopup: {
    id: 'admin/editor.minicart.type.popup',
    defaultMessage: 'Pop Up',
  },
  minicartTypeSidebar: {
    id: 'admin/editor.minicart.type.sidebar',
    defaultMessage: 'Sidebar',
  },
  minicartShowdDiscountTitle: {
    id: 'admin/editor.minicart.showDiscount.title',
    defaultMessage: 'Mini Cart Type',
  },
  minicartLabelMinicartEmptyTitle: {
    id: 'admin/editor.minicart.labelMiniCartEmpty.title',
    defaultMessage: 'Text to appear when the mini cart is empty',
  },
  minicartLabelButtonFinishShoppingTitle: {
    id: 'admin/editor.minicart.labelButtonFinishShopping.title',
    defaultMessage: 'Text to appear in the finish shopping button'
  }
})

MiniCart.schema = {
  title: messages.minicartTitle.id,
  description: messages.minicartDescription.id,
  type: 'object',
  properties: {
    type: {
      title: messages.minicartTypeTitle.id,
      type: 'string',
      default: 'popup',
      enum: ['popup', 'sidebar'],
      enumNames: [messages.minicartTypePopup.id, messages.minicartTypeSidebar.id],
      widget: {
        'ui:widget': 'radio',
        'ui:options': {
          inline: true,
        },
      },
      isLayout: true,
    },
    showDiscount: {
      title: messages.minicartShowdDiscountTitle.id,
      type: 'boolean',
      isLayout: true,
    },
    labelMiniCartEmpty: {
      title: messages.minicartLabelMinicartEmptyTitle.id,
      type: 'string',
      isLayout: false,
    },
    labelButtonFinishShopping: {
      title: messages.minicartLabelButtonFinishShoppingTitle.id,
      type: 'string',
      isLayout: false,
    },
  },
}

const withLinkStateMinicartQuery = graphql(fullMinicartQuery, {
  options: () => ({ ssr: false }),
  props: ({ data: { minicart } }) => ({
    linkState: {
      minicartItems: minicart && JSON.parse(minicart.items),
      orderForm: minicart && JSON.parse(minicart.orderForm),
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

const withLinkStateUpdateItemsSentToServerMutation = graphql(updateItemsSentToServerMutation, {
  name: 'updateItemsSentToServer',
  props: ({ updateItemsSentToServer }) => ({
    updateItemsSentToServer: () => updateItemsSentToServer(),
  }),
})

const withLinkState = WrappedComponent => {
  const Component = ({ client, ...props }) => {
    useEffect(() => {
      const { resolvers, initialState } = createLocalState(client)
      client.addResolvers(resolvers)
      // Add the initial state to if there is not there
      try {
        client.readQuery({ query: fullMinicartQuery })
      } catch (err) {
        client.writeData({ data: initialState })
      }
    }, [])

    return <WrappedComponent client={client} {...props} />
  }

  Component.displayName = `withLinkState(${WrappedComponent.displayName})`
  Component.propTypes = {
    client: PropTypes.object.isRequired,
  }
  return hoistNonReactStatics(Component, WrappedComponent)
}

export default compose(
  graphql(orderForm, { options: () => ({ ssr: false }) }),
  graphql(addToCart, { name: 'addToCart' }),
  graphql(updateItems, { name: 'updateItems' }),
  withApollo,
  withLinkState,
  withLinkStateMinicartQuery,
  withLinkStateUpdateItemsMutation,
  withLinkStateUpdateOrderFormMutation,
  withLinkStateUpdateItemsSentToServerMutation,
  withRuntimeContext,
  Pixel,
  withToast,
  injectIntl,
)(MiniCart)
