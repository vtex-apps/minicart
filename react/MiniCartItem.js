import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'render'
import CloseIcon from '@vtex/styleguide/lib/icon/Close'
import Button from '@vtex/styleguide/lib/Button'
import Spinner from '@vtex/styleguide/lib/Spinner'
import ProductName from 'vtex.storecomponents/ProductName'
import ProductPrice from 'vtex.storecomponents/ProductPrice'
import { MiniCartPropTypes } from './MiniCartPropTypes'

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
    /* Reused props */
    showRemoveButton: MiniCartPropTypes.showRemoveButton,
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
    } = this.props

    const { isRemovingItem } = this.state

    return (
      <div className="relative">
        <Link
          className="pointer link black-90"
          page={'store/product'}
          params={{ slug: this.getItemId(detailUrl) }}>
          <div className="vtex-minicart__item flex flex-row relative bb b--silver mt4">
            <img className="vtex-minicart__item-image" src={imageUrl} alt={name} />
            <div className="ml3">
              <div className="vtex-minicart__item-name mt3 tl">
                <ProductName name={name} />
              </div>
              <div className="vtex-minicart__sku-name tl">
                <div className="f7 dark-gray">
                  <ProductName name={skuName} />
                </div>
              </div>
              <div className="absolute right-0 bottom-0 mb4">
                <ProductPrice
                  sellingPrice={sellingPrice}
                  listPrice={listPrice}
                  showLabels={false}
                  showListPrice={false} />
              </div>
            </div>
          </div>
        </Link>
        {
          (showRemoveButton && !isRemovingItem) &&
          <div className="vtex-minicart-item__remove-btn absolute right-0 top-0 mt4">
            <Button onClick={(e) => this.onClickRemove(id, e)}>
              <CloseIcon size={12} color="#BDBDBD" />
            </Button>
          </div>
        }
        {
          (showRemoveButton && isRemovingItem) &&
          <div className="vtex-minicart-item__remove-btn absolute right-0 top-0 flex items-center justify-center mt5 pt2">
            <Spinner size={20} />
          </div>
        }
      </div>
    )
  }
}

