import React, { Component } from 'react'
import orderFormQuery from './graphql/orderFormQuery.gql'
import { graphql } from 'react-apollo'
import PropTypes from 'prop-types'
import Button from '@vtex/styleguide/lib/Button'
import CartIcon from './CartIcon'
import MiniCartContent from './MiniCartContent'

import './global.css'

/**
 * Minicart component
 */
export class MiniCart extends Component {
  static propTypes = {
    /* Label to appear when the minicart is empty */
    labelMiniCartEmpty: PropTypes.string,
    /* Finish shopping button label */
    labelButtonFinishShopping: PropTypes.string,
    /* Mini cart icon color */
    miniCartIconColor: PropTypes.string,
    /* Show the remove item button or not */
    showRemoveButton: PropTypes.bool.isRequired,
    /* Products in the cart */
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      /* Function to refetch the orderForm query */
      refetch: PropTypes.func.isRequired,
      /* Order form */
      orderForm: PropTypes.shape({
        /* Order form id */
        orderFormId: PropTypes.string,
        /* Total price of the order */
        value: PropTypes.number,
        /* Items in the mini cart */
        items: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.string,
          /* Item's name */
          name: PropTypes.string,
          /* Item's url details */
          detailUrl: PropTypes.string,
          /* Item's image url */
          imageUrl: PropTypes.string,
          /* Item's quantity */
          quantity: PropTypes.number,
          /* Item's selling price */
          sellingPrice: PropTypes.number,
          /* Item's list price */
          listPrice: PropTypes.number,
          /* Item's sku name */
          skuName: PropTypes.string,
        })),
      }),
    }).isRequired,
  }

  static schema = {
    title: 'Mini Cart',
    description: 'The mini cart component',
    type: 'object',
    properties: {
      showRemoveButton: {
        title: 'Show remove item button',
        type: 'boolean',
      },
      labelMiniCartEmpty: {
        title: 'Text to appear when the mini cart is empty',
        type: 'string',
      },
      labelButtonFinishShopping: {
        title: 'Text to appear in the finish shopping button',
        type: 'string',
      },
    },
  }

  constructor(props) {
    super(props)
    this.state = { isMouseOnButton: false, isMouseOnMiniCart: false, quantityItems: 0 }
  }
  componentDidMount() {
    document.addEventListener('item:adicionado', () => {
      // TODO - UPDATE BADGE COUNT
    })
  }

  handleUpdateQuantityItems = (quantity) => this.setState({ quantityItems: quantity })

  handleClickButton = () => location.assign('/checkout/#/cart')

  handleMouseEnterButton = () => this.setState({ isMouseOnButton: true })

  handleMouseLeaveButton = () => this.setState({ isMouseOnButton: false })

  handleMouseEnterCartItems = () => this.setState({ isMouseOnMiniCart: true })

  handleMouseLeaveCartItems = () => this.setState({ isMouseOnMiniCart: false })

  render() {
    const { isMouseOnButton, isMouseOnMiniCart, quantityItems } = this.state
    const { labelMiniCartEmpty, labelButtonFinishShopping, miniCartIconColor, showRemoveButton } = this.props
    const quantity = (!this.props.data.loading && !quantityItems) ? this.props.data.orderForm.items.length : quantityItems
    return (
      <div className="relative fr" >
        <Button
          icon
          onClick={this.handleClickButton}
          onMouseEnter={this.handleMouseEnterButton}
          onMouseLeave={this.handleMouseLeaveButton}>
          <CartIcon fillColor={miniCartIconColor} />
          <span className="vtex-minicart__bagde mt1 mr1">
            {quantity}
          </span>
        </Button>
        {
          (isMouseOnMiniCart || isMouseOnButton) &&
          <div
            className="vtex-minicart__box absolute right-0 bg-white z-max"
            onMouseLeave={this.handleMouseLeaveCartItems}
            onMouseEnter={this.handleMouseEnterCartItems}>
            <MiniCartContent
              data={this.props.data}
              onUpdateItemsQuantity={this.handleUpdateQuantityItems}
              showRemoveButton={showRemoveButton}
              labelMiniCartEmpty={labelMiniCartEmpty}
              labelButton={labelButtonFinishShopping} />
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
