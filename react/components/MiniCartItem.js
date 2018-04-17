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
      <div>
        <Link
          page={'store/product'}
          params={{ id: productId }}>
          <img src={imageUrl} alt={productId} />
          <div className="w-70 fr items-center">
            <div className="w-100 tc">
              <span className="f6">{name}</span>
            </div>
            <div className="fr f7 mt4">
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
        <hr />
      </div>
    )
  }
}
