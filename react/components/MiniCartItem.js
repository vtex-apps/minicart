import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'render'
import CloseIcon from '@vtex/styleguide/lib/icon/Close'
import Button from '@vtex/styleguide/lib/Button'
import Spinner from '@vtex/styleguide/lib/Spinner'
import ProductName from 'vtex.store-components/ProductName'
import ProductPrice from 'vtex.store-components/ProductPrice'
import QuantitySelector from 'vtex.store-components/QuantitySelector'
import { MiniCartPropTypes } from '../propTypes'

import '../global.css'

/**
 * Minicart item component
 */
export default class MiniCartItem extends Component {
  static propTypes = {
    /* Item's id */
    id: PropTypes.string.isRequired,
    /* Item's image */
    imageUrl: PropTypes.string.isRequired,
    /* Item's name */
    name: PropTypes.string.isRequired,
    /* Item's selling price */
    sellingPrice: PropTypes.number.isRequired,
    /* Item's list price */
    listPrice: PropTypes.number.isRequired,
    /* Item's sku */
    skuName: PropTypes.string.isRequired,
    /* Quantity of the item in the card */
    quantity: PropTypes.number.isRequired,
    /* Detail url */
    detailUrl: PropTypes.string.isRequired,
    /* Remove item function */
    removeItem: PropTypes.func.isRequired,
    /* Update item function */
    updateItem: PropTypes.func.isRequired,
    /* Max quantity of the item */
    maxQuantity: PropTypes.number.isRequired,
    /* Reused props */
    showRemoveButton: MiniCartPropTypes.showRemoveButton,
    enableQuantitySelector: MiniCartPropTypes.enableQuantitySelector,
  }

  static defaultProps = {
    showRemoveButton: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      isRemovingItem: false,
    }
  }

  handleQuantityChange = quantity => {
    this.props.updateItem(this.props.id, quantity)
  }

  getItemId = detailUrl => {
    const regExp = /\/([^)]+)\//
    return regExp.exec(detailUrl)[1]
  }

  onClickRemove = (id) => {
    this.setState({
      isRemovingItem: true,
    })
    this.props.removeItem(id)
  }

  render() {
    const {
      id,
      detailUrl,
      imageUrl,
      name,
      skuName,
      sellingPrice,
      listPrice,
      showRemoveButton,
      enableQuantitySelector,
      quantity,
      maxQuantity,
    } = this.props

    const { isRemovingItem } = this.state

    return (
      <div className="relative">
        <Link
          className="pointer link black-90"
          page={'store/product'}
          params={{ slug: this.getItemId(detailUrl) }}>
          <div className="vtex-minicart__item flex flex-row relative bb b--silver mt4">
            <div className="vtex-minicart__img-container">
              <img className="vtex-minicart__item-image" src={imageUrl} alt={name} />
            </div>
            <div className="ml3 relative">
              <div>
                <div className="vtex-minicart__item-name mt3 tl overflow-hidden">
                  <ProductName name={name} />
                </div>
                <div className="vtex-minicart__sku-name tl absolute">
                  <div className="f7 dark-gray">
                    <ProductName name={skuName} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
        <div className="absolute right-0 bottom-0 mb4 flex flex-column">
          <ProductPrice
            sellingPrice={sellingPrice * quantity}
            listPrice={listPrice * quantity}
            showLabels={false}
            showListPrice={false} />
        </div>
        {enableQuantitySelector &&
          <div className="absolute bottom-0 right-0 mb7 pb2">
            <QuantitySelector
              maxQuantity={maxQuantity}
              currentQuantity={quantity}
              onQuantityChange={this.handleQuantityChange}
            />
          </div>
        }
        {(showRemoveButton && !isRemovingItem) && (
          <div className="vtex-minicart-item__remove-btn absolute right-0 top-0">
            <Button onClick={(e) => this.onClickRemove(id, e)}>
              <CloseIcon size={12} color="#BDBDBD" />
            </Button>
          </div>
        )}
        {(showRemoveButton && isRemovingItem) && (
          <div
            className="vtex-minicart-item__remove-btn absolute right-0 top-0 flex items-center justify-center pt2">
            <Spinner size={20} />
          </div>
        )}
      </div>
    )
  }
}

