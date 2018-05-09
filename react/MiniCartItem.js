import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Price } from '@vtex/product-details'
import { Link } from 'render'
import CloseIcon from '@vtex/styleguide/lib/icon/Close'
import Button from '@vtex/styleguide/lib/Button'

import './global.css'

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
    /* Detail url */
    detailUrl: PropTypes.string.isRequired,
    /* Remove item function */
    removeItem: PropTypes.func.isRequired,
  }

  getItemId = detailUrl => {
    const regExp = /\/([^)]+)\//
    return regExp.exec(detailUrl)[1]
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
      removeItem,
    } = this.props

    return (
      <div className="relative">
        <Link
          className="pointer link black-90"
          page={'store/product'}
          params={{ slug: this.getItemId(detailUrl) }}>
          <div className="vtex-minicart__item flex flex-row relative bb b--silver">
            <img className="vtex-minicart__item-image" src={imageUrl} alt={name} />
            <div className="ml3">
              <div className="vtex-minicart__item-name mt3 tl">
                <span className="b">{name}</span>
              </div>
              <div className="vtex-minicart__sku-name tl">
                <span className="f7 dark-gray">{skuName}</span>
              </div>
              <div className="absolute right-0 bottom-0 mb3 f3">
                <Price
                  sellingPrice={sellingPrice}
                  listPrice={listPrice}
                  showLabels={false}
                  showListPrice={false} />
              </div>
            </div>
          </div>
        </Link>
        <div className="vtex-minicart-item__remove-btn absolute right-0 top-0">
          <Button onClick={(e) => removeItem(id, e)}>
            <CloseIcon size={12} color="#BDBDBD" />
          </Button>
        </div>
      </div>
    )
  }
}

