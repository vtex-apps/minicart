import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'render'
import { Button, Spinner, IconClose, NumericStepper } from 'vtex.styleguide'
import ProductName from 'vtex.store-components/ProductName'
import ProductPrice from 'vtex.store-components/ProductPrice'
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
    showSku: MiniCartPropTypes.showSku,
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
    this.props.updateItem(this.props.id, quantity.value)
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
      showSku,
      enableQuantitySelector,
      quantity,
      maxQuantity,
    } = this.props

    const { isRemovingItem } = this.state

    return (
      <div className="vtex-minicart__item relative w-100">
        <Link
          className="pointer link black-90"
          page={'store/product'}
          params={{ slug: this.getItemId(detailUrl) }}>
          <div className="relative bb b--silver h-100 pa4">
            <div className={`${showRemoveButton ? 'vtex-minicart__item-name' : 'vtex-minicart__item-name-100'} mb2`}>
              <ProductName
                name={name}
                skuName={skuName}
                showSku={showSku} />
            </div>
            <div className="vtex-minicart__item-footer relative flex flex-row pb2 items-center w-100">
              <div className="vtex-minicart__img-container">
                <Image url={imageUrl} alt={name} />
              </div>
              <div className="absolute right-0 bottom-0 mb1">
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
          <div className="absolute top-0 right-0 mt8 pr1 mr4">
            <NumericStepper
              size="small"
              minValue={1}
              maxValue={maxQuantity}
              value={quantity}
              onChange={this.handleQuantityChange}
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

