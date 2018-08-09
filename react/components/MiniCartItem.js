import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'render'
import { Button, Spinner, IconClose } from 'vtex.styleguide'
import ProductName from 'vtex.store-components/ProductName'
import ProductPrice from 'vtex.store-components/ProductPrice'
import QuantitySelector from 'vtex.store-components/QuantitySelector'
import { MiniCartPropTypes } from '../propTypes'
import Image from './Image'

/**
 * Minicart item component
 */
export default class MiniCartItem extends Component {
  static propTypes = {
    /* Item's id */
    id: PropTypes.string.isRequired,
    /* Item's type */
    type: PropTypes.string,
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
      <div className="vtex-minicart__item relative pv3 w-100 ph4 mb2">
        <Link
          className="pointer link black-90"
          page={'store/product'}
          params={{ slug: this.getItemId(detailUrl) }}>
          <div className="relative bb b--silver">
            <div className="vtex-minicart__item-name mb2">
              <ProductName name={name} />
              <div className="vtex-minicart__item-sku f7">
                <ProductName name={skuName} />
              </div>
            </div>
            <div className="vtex-minicart__item-footer relative flex flex-row pb2 items-center w-100">
              <div className="vtex-minicart__img-container">
                <Image url={imageUrl} alt={name} />
              </div>
              <div className="justify-end absolute right-0 pt6">
                <ProductPrice
                  sellingPrice={sellingPrice * quantity}
                  listPrice={listPrice * quantity}
                  showLabels={false}
                  showListPrice={false} />
              </div>
            </div>
          </div>
        </Link>
        {enableQuantitySelector &&
          <div className="absolute bottom-0 left-0 mb4 pl9">
            <QuantitySelector
              maxQuantity={maxQuantity}
              currentQuantity={quantity}
              onQuantityChange={this.handleQuantityChange}
            />
          </div>
        }
        {(showRemoveButton && !isRemovingItem) && (
          <div className="vtex-minicart-item__remove-btn absolute right-0 top-0 mr4">
            <Button icon variation="tertiary" onClick={(e) => this.onClickRemove(id, e)}>
              <IconClose size={20} color="#BDBDBD" />
            </Button>
          </div>
        )}
        {(showRemoveButton && isRemovingItem) && (
          <div
            className="vtex-minicart-item__remove-btn absolute right-0 top-0 flex items-center justify-center mt3 mr4">
            <Spinner size={20} />
          </div>
        )}
      </div>
    )
  }
}

