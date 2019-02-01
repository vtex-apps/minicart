import { equals, isNil, path, pathOr, pick } from 'ramda'
import React, { Component } from 'react'
import { Button } from 'vtex.styleguide'
import { isMobile } from 'react-device-detect'
import { withRuntimeContext } from 'vtex.render-runtime'
import { IconCart } from 'vtex.dreamstore-icons'
import { orderForm } from 'vtex.store-resources/Queries'
import { addToCart, updateItems } from 'vtex.store-resources/Mutations'
import { Pixel } from 'vtex.pixel-manager/PixelContext'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import MiniCartContent from './components/MiniCartContent'
import { MiniCartPropTypes } from './propTypes'
import Sidebar from './components/Sidebar'
import Popup from './components/Popup'
import { isParentItem } from './utils/itemsHelper'
import { minicartItemsQuery } from './LinkState'

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

  async componentDidUpdate(prevProps, prevState) {
    const serverItems = path(['data', 'orderForm', 'items'], this.props)
    const clientItems = path(['linkState', 'minicartItems'], this.props)

    if (serverItems && clientItems) {
      const prevClientItems = path(['linkState', 'minicartItems'], prevProps)

      if (!equals(prevClientItems, clientItems)) {
        if (this.debounce) {
          clearTimeout(this.debounce)
        }
        this.debounce = setTimeout(
          () => this.handleItemsDifference({ clientItems }),
          2000
        )
      } else if (serverItems.length && !clientItems.length) {
        return this.fillClientMinicart(serverItems)
      } else if (prevState.updatingOrderForm && !this.state.updatingOrderForm) {
        const {
          data: {
            orderForm: { items },
          },
        } = await this.props.data.refetch()
        return this.fillClientMinicart(items)
      }
    }
  }

  handleItemsDifference = async ({ clientItems }) => {
    const clientOnlyItems = clientItems
      .map(pick(['id', 'index', 'quantity', 'seller']))
      .filter(({ seller }) => !isNil(seller))
    if (!clientOnlyItems.length) return

    this.setState({ updatingOrderForm: true })
    try {
      await this.addItems(clientOnlyItems)
      await this.updateItems(clientOnlyItems)
      this.props.push({
        event: 'addToCart',
        items: clientOnlyItems,
      })
    } catch (err) {
      // TODO: Toast error message
      console.error(err)
    } finally {
      this.setState({ updatingOrderForm: false })
    }
  }

  addItems = async items => {
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

  updateItems = async items => {
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

  fillClientMinicart = items => this.props.fillCart(items)

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

  handleItemAdd = () => {
    this.props.data.refetch()
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
      linkState,
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
            ...data.orderForm,
            items: linkState.minicartItems,
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
        onUpdateContentVisibility={this.handleUpdateContentVisibility}
        onClickAction={this.handleUpdateContentVisibility}
        showShippingCost={showShippingCost}
      />
    )

    return (
      <div
        className={`${minicart.container} relative fr flex items-center`}
        ref={e => {
          this.iconRef = e
        }}
      >
        <Button
          variation="tertiary"
          icon
          onClick={event => this.handleClickButton(event)}
        >
          <div className="flex items-center">
            <div className={`relative ${iconClasses}`}>
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
            </div>
            {iconLabel && (
              <span
                className={`${minicart.label} dn-m db-l t-action--small pl${
                  quantity > 0 ? '6' : '4'
                } ${labelClasses}`}
              >
                {iconLabel}
              </span>
            )}
          </div>
        </Button>
        {!hideContent &&
          (isSizeLarge ? (
            <Sidebar
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
      </div>
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

const withLinkStateQuery = graphql(minicartItemsQuery, {
  props: ({ data: { minicart } }) => ({
    linkState: {
      minicartItems: minicart && minicart.items,
    },
  }),
})

const withLinkStateFillCartMutation = graphql(
  gql`
    mutation fillCart($items: [MinicartItem]) {
      fillCart(items: $items) @client
    }
  `,
  {
    name: 'fillCart',
    props: ({ fillCart }) => ({
      fillCart: items => fillCart({ variables: { items } }),
    }),
  }
)

export default compose(
  graphql(orderForm, { options: () => ({ ssr: false }) }),
  graphql(addToCart, { name: 'addToCart' }),
  graphql(updateItems, { name: 'updateItems' }),
  withLinkStateQuery,
  withLinkStateFillCartMutation,
  withRuntimeContext,
  Pixel
)(MiniCart)
=======
const withQuery = graphql(
  gql`
    query {
      minicart @client {
        items
      }
    }
  `,
  { props: ({ data: { items } }) => ({ items }) }
)

export default withQuery(withRuntimeContext(miniHOC))
>>>>>>> Add the initial LinkState configuration
