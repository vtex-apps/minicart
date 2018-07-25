import React, { Component } from 'react'
import { Button } from 'vtex.styleguide'
import { isMobile } from 'react-device-detect'

import CartIcon from './images/CartIcon'
import MiniCartContent from './components/MiniCartContent'
import { MiniCartPropTypes } from './propTypes'
import Sidebar from './components/Sidebar'
import Popup from './components/Popup'
import { orderFormConsumer } from 'vtex.store/OrderFormContext'

import './global.css'

const MINIMUM_MAX_QUANTITY = 1
const MAXIMUM_MAX_QUANTITY = 10
const DEFAULT_MAX_QUANTITY = 1

/**
 * Minicart component
 */
class MiniCart extends Component {
  static propTypes = MiniCartPropTypes

  static defaultProps = {
    maxQuantity: DEFAULT_MAX_QUANTITY,
  }

  static getSchema = props => {
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
      props.enableQuantitySelector && getQuantitySelectorSchema()

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

  state = {
    openContent: false,
  }

  handleClickButton = event => {
    if (!this.props.hideContent) {
      if (isMobile && this.props.type !== 'sidebar') {
        location.assign('/checkout/#/cart')
      } else {
        this.setState({
          openContent: !this.state.openContent,
        })
      }
    }
    event.persist()
  }

  handleUpdateContentVisibility = () => {
    this.setState({
      openContent: false,
    })
  }

  handleItemAdd = () => {
    this.props.orderFormContext.refetch()
  }

  render() {
    if (!this.props.orderFormContext) return null

    const { openContent } = this.state
    const {
      labelMiniCartEmpty,
      labelButtonFinishShopping,
      miniCartIconColor,
      showRemoveButton,
      showDiscount,
      enableQuantitySelector,
      maxQuantity,
      orderFormContext,
      type,
      hideContent,
    } = this.props
    const { orderForm } = orderFormContext
    const quantity =
      orderForm && !orderForm.loading && orderForm.items
        ? orderForm.items.length
        : 0
    const large = type && type === 'sidebar'
    const miniCartContent = (
      <MiniCartContent
        large={large}
        data={orderFormContext}
        showRemoveButton={showRemoveButton}
        showDiscount={showDiscount}
        labelMiniCartEmpty={labelMiniCartEmpty}
        labelButton={labelButtonFinishShopping}
        enableQuantitySelector={enableQuantitySelector}
        maxQuantity={maxQuantity}
      />
    )

    return (
      <div className="vtex-minicart relative fr">
        <Button
          variation="tertiary"
          icon
          onClick={event => this.handleClickButton(event)}
        >
          <CartIcon fillColor={miniCartIconColor} />
          {quantity > 0 && (
            <span className="vtex-minicart__bagde mt1 mr1">{quantity}</span>
          )}
        </Button>
        {!hideContent && large
          ? openContent && (
              <Sidebar onOutsideClick={this.handleUpdateContentVisibility}>
                {miniCartContent}
              </Sidebar>
            )
          : openContent && (
              <Popup
                showDiscount={showDiscount}
                onOutsideClick={this.handleUpdateContentVisibility}
              >
                {miniCartContent}
              </Popup>
            )}
      </div>
    )
  }
}

export default orderFormConsumer(MiniCart)
