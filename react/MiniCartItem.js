import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CloseIcon from '@vtex/styleguide/lib/icon/Close'
import { Price } from '@vtex/product-details'
import Button from '@vtex/styleguide/lib/Button'

export default class MiniCartItem extends Component {
  render() {
    const { imageUrl, name, skuName, price, callback } = this.props
    return (
      <div className="minicart-item flex flex-row relative bb b--silver mb3">
        <img className="image-size" src={imageUrl} />
        <div className="ml3">
          <div className="name-size mt3">
            <span className="b">{name}</span>
          </div>
          <div className="sku-size">
            <span className="f7 dark-gray">{skuName}</span>
            <div className="absolute right-0 bottom-0 mb5 mr5">
              <Price sellingPrice={price} listPrice={price} showLabels={false} showListPrice={false} />
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0">
          <Button onClick={callback} icon><CloseIcon size={12} /></Button>
        </div>
      </div>
    )
  }
}

MiniCartItem.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  skuName: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
}

