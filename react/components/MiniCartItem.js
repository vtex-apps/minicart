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
    return (
      <div className="relative">
        <Link
          page={'store/product'}
          params={{ id: productId }}>
          <img src={imageUrl} alt={productId} />
          <div className="w-70 fr pa1">
            <div className="w-100">
              <span className="f6">{name}</span>
            </div>
            <div className="f7 absolute bottom-0 right-0 mr3">
              <FormattedNumber
                value={price}
                style="currency"
                currency={this.context.culture.currency}
                minimumFractionDigits={2}
                maximumFractionDigits={2}
              />
            </div>
          </div>
        </Link>
      </div>
    )
  }
}
