import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'render'
import { Button, Spinner, IconClose, NumericStepper } from 'vtex.styleguide'
import { ProductName, ProductPrice } from 'vtex.store-components'
import classNames from 'classnames'

import { MiniCartPropTypes } from '../propTypes'
import Image from './Image'
import minicart from '../minicart.css'

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

  state = {
    isRemovingItem: false,
  }

  handleQuantityChange = event => {
    this.props.updateItem(this.props.id, event.value)
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
      onClickProduct
    } = this.props

    const { isRemovingItem } = this.state

    const nameClasses = classNames(`${minicart.itemName} h2 mb3`, {
      [`${minicart.itemNameLarge}`]: showRemoveButton,
    })

    return (
      <div className={`${minicart.item} h4 relative w-100`}>
        <Link
          className="pointer link black-90"
          page={'store.product'}
          params={{ slug: this.getItemId(detailUrl) }}>
          <div className="relative bb b--muted-3 h-100 pa4">
            <div className={nameClasses}>
              <ProductName
                name={name}
                skuName={skuName}
                showSku={showSku}
              />
            </div>
            <div className={`${minicart.itemFooter} relative flex flex-row pb2 items-center w-100`}>
              <div className={`${minicart.imgContainer} h3 w3 mw3`}>
                <Image url={imageUrl} alt={name} />
              </div>
              <div className="absolute right-0 bottom-0 mb1">
                <ProductPrice
                  sellingPrice={sellingPrice * quantity}
                  listPrice={listPrice * quantity}
                  showLabels={false}
                  showListPrice={false}
                />
              </div>
            </div>
          </div>
          {enableQuantitySelector &&
            <div className="absolute top-0 right-0 mt8 pr1 mr4 pt2">
              <NumericStepper
                minValue={1}
                maxValue={maxQuantity}
                value={quantity}
                onChange={this.handleQuantityChange}
              />
            </div>
          }
          {(showRemoveButton && !isRemovingItem) && (
            <div className={`${minicart.itemRemoveBtn} absolute right-0 top-0 mr4`}>
              <Button icon variation="tertiary" onClick={(e) => this.onClickRemove(id, e)}>
                <IconClose size={20} color="b--muted-3" />
              </Button>
            </div>
          )}
          {(showRemoveButton && isRemovingItem) && (
            <div
              className={`${minicart.itemRemoveBtn} absolute right-0 top-0 flex items-center justify-center mt3 mr4`}
            >
              <Spinner size={20} />
            </div>
          )}
        </Link>
      </div>
    )
  }
}

