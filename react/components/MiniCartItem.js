import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedNumber } from 'react-intl'
import { Link } from 'render'

export default class MiniCartItem extends Component {
  static propTypes = {
    imageUrl: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
    productId: PropTypes.string,
  }

  static contextTypes = {
    culture: PropTypes.object,
  }

  render() {
    const { imageUrl, name, price, productId } = this.props
    console.log(imageUrl)
    return (
      <div className="w-100">
        <Link
          page={'store/product'}
          params={{ id: productId }}>
          <img src={imageUrl} alt={productId} />
          <div className="w-60 fr tc">
            <span className="w-50 tc">{name}</span>
            <FormattedNumber
              className="w-50 fl tc"
              value={price}
              style="currency"
              currency={this.context.culture.currency}
              minimumFractionDigits={2}
              maximumFractionDigits={2}
            />
          </div>
        </Link>
      </div>
    )
  }
}
