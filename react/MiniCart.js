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
export class MiniCart extends Component {
  static propTypes = MiniCartPropTypes

  static defaultProps = {
    maxQuantity: DEFAULT_MAX_QUANTITY,
  }

  state = {
    openContent: false,
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

  handleItemAdd = () => {
    this.props.orderFormContext.refetch()
  }

  render() {
    const { openContent } = this.state
    const {
      labelMiniCartEmpty,
      labelButtonFinishShopping,
      iconColor,
      iconSize,
      iconLabel,
      showRemoveButton,
      showDiscount,
      showSku,
      enableQuantitySelector,
      maxQuantity,
      orderFormContext,
      type,
      hideContent,
    } = this.props

    const { orderForm } = orderFormContext
    const quantity = orderForm && orderForm.items ? orderForm.items.length : 0

    const large =
      (type && type === 'sidebar') ||
      isMobile ||
      (window && window.innerWidth <= 480)

    const miniCartContent = (
      <MiniCartContent
        large={large}
        data={orderFormContext}
        showRemoveButton={showRemoveButton}
        showDiscount={showDiscount}
        showSku={showSku}
        labelMiniCartEmpty={labelMiniCartEmpty}
        labelButton={labelButtonFinishShopping}
        enableQuantitySelector={enableQuantitySelector}
        maxQuantity={maxQuantity}
      />
    )

    return (
      <div
        className="vtex-minicart relative fr"
        ref={e => {
          this.iconRef = e
        }}
      >
        <Button
          variation="tertiary"
          icon
          onClick={event => this.handleClickButton(event)}
        >
          <CartIcon fillColor={iconColor} size={iconSize} />
          {quantity > 0 && (
            <span className="vtex-minicart__bagde mt1 mr1">{quantity}</span>
          )}
          {iconLabel && (
            <span className={`vtex-minicart__label white f6 pl${quantity > 0 ? '6' : '4'} `}>
              {iconLabel}
            </span>
          )}
        </Button>
        {!hideContent &&
          (large ? (
            <Sidebar
              onOutsideClick={this.handleUpdateContentVisibility}
              isOpen={openContent}
            >
              {miniCartContent}
            </Sidebar>
          ) : (
            openContent && (
              <Popup
                showDiscount={showDiscount}
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

const miniHOC = orderFormConsumer(MiniCart)

miniHOC.getSchema = props => {
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

export default miniHOC
