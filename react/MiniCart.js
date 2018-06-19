import React, { Component } from 'react'
import orderFormQuery from './graphql/orderFormQuery.gql'
import { graphql } from 'react-apollo'
import Button from '@vtex/styleguide/lib/Button'
import CartIcon from './images/CartIcon'
import MiniCartContent from './components/MiniCartContent'
import { MiniCartPropTypes } from './propTypes'

import './global.css'

/**
 * Minicart component
 */
export class MiniCart extends Component {
  static propTypes = MiniCartPropTypes

  static getSchema = props => {
    const getQuantitySelectorSchema = () => {
      return {
        maxQuantity: {
          title: 'editor.minicart.maxQuantity.title',
          type: 'number',
          maximum: 10,
          minimum: 1,
          widget: {
            'ui:widget': 'range',
          },
          default: 1,
        },
      }
    }

    const generatedSchema = props.enableQuantitySelector && getQuantitySelectorSchema()

    return {
      title: 'editor.minicart.title',
      description: 'editor.minicart.description',
      type: 'object',
      properties: {
        showRemoveButton: {
          title: 'editor.minicart.showRemoveButton.title',
          type: 'boolean',
        },
        labelMiniCartEmpty: {
          title: 'editor.minicart.labelMiniCartEmpty.title',
          type: 'string',
        },
        labelButtonFinishShopping: {
          title: 'editor.minicart.labelButtonFinishShopping.title',
          type: 'string',
        },
        enableQuantitySelector: {
          title: 'editor.minicart.enableQuantitySelector.title',
          type: 'boolean',
        },
        ...generatedSchema,
      },
    }
  }

  constructor(props) {
    super(props)
    this.state = { isMouseOnButton: false, isMouseOnMiniCart: false, quantityItems: 0 }
  }

  componentDidMount() {
    document.addEventListener('item:add', () => {
      const { quantityItems } = this.state
      this.setState({ quantityItems: quantityItems + 1 })
    })
  }

  handleUpdateQuantityItems = quantity => this.setState({ quantityItems: quantity })

  handleClickButton = () => location.assign('/checkout/#/cart')

  handleMouseEnterButton = () => this.setState({ isMouseOnButton: true })

  handleMouseLeaveButton = () => this.setState({ isMouseOnButton: false })

  handleMouseEnterCartItems = () => this.setState({ isMouseOnMiniCart: true })

  handleMouseLeaveCartItems = () => this.setState({ isMouseOnMiniCart: false })

  render() {
    const { isMouseOnButton, isMouseOnMiniCart, quantityItems } = this.state
    const { labelMiniCartEmpty, labelButtonFinishShopping, miniCartIconColor, showRemoveButton, enableQuantitySelector, maxQuantity, data: { orderForm } } = this.props
    const quantity = !quantityItems && orderForm && orderForm.items ? orderForm.items.length : quantityItems
    return (
      <div className="relative fr" >
        <Button
          icon
          onClick={this.handleClickButton}
          onMouseEnter={this.handleMouseEnterButton}
          onMouseLeave={this.handleMouseLeaveButton}>
          <CartIcon fillColor={miniCartIconColor} />
          {quantity > 0 && <span className="vtex-minicart__bagde mt1 mr1">
            {quantity}
          </span>}
        </Button>
        {
          (isMouseOnMiniCart || isMouseOnButton) &&
          <div
            className="vtex-minicart__box absolute right-0 z-max flex flex-colunm"
            onMouseLeave={this.handleMouseLeaveCartItems}
            onMouseEnter={this.handleMouseEnterCartItems}>
            <div className="vtex-minicart__arrow-up absolute top-0 right-0 shadow-3">
            </div>
            <div className="shadow-3 mt3">
              <MiniCartContent
                data={this.props.data}
                onUpdateItemsQuantity={this.handleUpdateQuantityItems}
                showRemoveButton={showRemoveButton}
                labelMiniCartEmpty={labelMiniCartEmpty}
                labelButton={labelButtonFinishShopping}
                enableQuantitySelector={enableQuantitySelector}
                maxQuantity={maxQuantity} />
            </div>
          </div>
        }
      </div>
    )
  }
}

const options = {
  options: () => ({
    ssr: false,
  }),
}

export default graphql(orderFormQuery, options)(MiniCart)
