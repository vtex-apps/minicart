import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import { injectIntl, intlShape } from 'react-intl'
import orderFormQuery from './graphql/orderFormQuery.gql'
import MiniCartItem from './MiniCartItem'
import Button from '@vtex/styleguide/lib/Button'
import { Price } from '@vtex/product-details'
import Spinner from '@vtex/styleguide/lib/Spinner'
import './global.css'

/**
 * Minicart component
 */
class MiniCart extends Component {
  static propTypes = {
    /* Products in the cart */
    data: PropTypes.shape({
      loading: PropTypes.bool,
      orderForm: PropTypes.object,
    }).isRequired,
    /* Label to appear when the minicart is empty */
    labelMiniCartEmpty: PropTypes.string,
    /* Label to appear in the finish shopping button */
    labelButton: PropTypes.string,
    /* Internationalization */
    intl: intlShape.isRequired,
  }

  handleClickButton = () => location.assign('/checkout/#/cart')

  renderWithoutItems = (label) => (
    <div className="vtex-minicart__item pa4 shadow-4 flex items-center justify-center">
      <span className="f5">{label}</span>
    </div>
  )

  renderMiniCartWithItems = (orderForm, label) => (
    <div className="flex flex-column" >
      <div className="vtex-minicart__arrow-up self-end mr3 pr1"></div>
      <div className="shadow-3">
        <div className="vtex-minicart__content pa4 overflow-auto">
          {orderForm.items.map(item => (
            <div className="flex flex-row" key={item.id}>
              <MiniCartItem {...item} />
            </div>
          ))}
        </div>
        <div className="relative pr4 pl4 pb4">
          <Button primary onClick={this.handleClickButton}>{label}</Button>
          <div className="fr mt2">
            <Price
              sellingPrice={orderForm.value}
              listPrice={orderForm.value}
              showLabels={false}
              showListPrice={false} />
          </div>
        </div>
      </div>
    </div >
  )

  renderLoading = () => (
    <div className="vtex-minicart__item shadow-3 pa4 flex items-center justify-center">
      <Spinner />
    </div>
  )

  render() {
    const { data, labelMiniCartEmpty, labelButton, intl } = this.props
    let content
    if (data.loading) {
      content = this.renderLoading()
    } else if (!data.orderForm.items.length) {
      content = this.renderWithoutItems(labelMiniCartEmpty || intl.formatMessage({ id: 'minicart-empty' }))
    } else {
      content = this.renderMiniCartWithItems(data.orderForm,
        labelButton || intl.formatMessage({ id: 'finish-shopping-button-label' }))
    }
    return content
  }
}

export default injectIntl(graphql(orderFormQuery)(MiniCart))
