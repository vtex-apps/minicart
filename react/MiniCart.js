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
          minimum: 1,
          maximum: 10,
          default: 1,
          widget: {
            'ui:widget': 'range',
          },
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

  state = {
    quantityItems: 0,
  }

  componentDidMount() {
    document.addEventListener('item:add', this.handleItemAdd)
  }

  componentWillUnmount() {
    document.removeEventListener('item:add', this.handleItemAdd)
  }

  handleItemAdd = () => {
    const { quantityItems } = this.state
    this.setState({ quantityItems: quantityItems + 1 })
  }

  handleUpdateQuantityItems = quantity => this.setState({ quantityItems: quantity })

  handleClickButton = () => location.assign('/checkout/#/cart')

  render() {
    const { quantityItems } = this.state
    const {
      labelMiniCartEmpty,
      labelButtonFinishShopping,
      miniCartIconColor,
      showRemoveButton,
      enableQuantitySelector,
      maxQuantity,
      data,
    } = this.props
    const { orderForm } = data
    const quantity = !quantityItems && orderForm && orderForm.items ? orderForm.items.length : quantityItems
    return (
      <div className="vtex-minicart relative fr">
        <Button
          icon
          onClick={this.handleClickButton}
        >
          <CartIcon fillColor={miniCartIconColor} />
          {quantity > 0 && <span className="vtex-minicart__bagde mt1 mr1">
            {quantity}
          </span>}
        </Button>
        <div className="vtex-minicart__box absolute right-0 z-max flex flex-colunm">
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
              maxQuantity={maxQuantity}
            />
          </div>
        </div>
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
