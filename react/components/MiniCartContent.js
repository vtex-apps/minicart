import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import { injectIntl, intlShape } from 'react-intl'
import updateItemsMutation from '../graphql/updateItemsMutation.gql'
import orderFormQuery from '../graphql/orderFormQuery.gql'
import MiniCartItem from './MiniCartItem'
import Button from '@vtex/styleguide/lib/Button'
import ProductPrice from 'vtex.store-components/ProductPrice'
import Spinner from '@vtex/styleguide/lib/Spinner'
import { MiniCartPropTypes } from '../propTypes'

import '../global.css'

/**
 * Minicart content component
 */
class MiniCartContent extends Component {
  static propTypes = {
    /* Function to be called when an item is removed */
    onUpdateItemsQuantity: PropTypes.func,
    /* Mutate function */
    mutate: PropTypes.func.isRequired,
    /* Internationalization */
    intl: intlShape.isRequired,
    /* Reused props */
    data: MiniCartPropTypes.data,
    labelMiniCartEmpty: MiniCartPropTypes.labelMiniCartEmpty,
    labelButton: MiniCartPropTypes.labelButtonFinishShopping,
    showRemoveButton: MiniCartPropTypes.showRemoveButton,
    enableQuantitySelector: MiniCartPropTypes.enableQuantitySelector,
    maxQuantity: MiniCartPropTypes.maxQuantity,
  }

  constructor(props) {
    super(props)
    this.state = { showSpinner: false }
  }

  handleClickButton = () => location.assign('/checkout/#/cart')

  onRemoveItem = id => {
    const { mutate, data: { orderForm } } = this.props
    const itemPayload = orderForm.items.find(item => item.id === id)
    const index = orderForm.items.indexOf(itemPayload)
    const updatedItem = [itemPayload].map(item => {
      return {
        id: parseInt(item.id),
        index: index,
        quantity: 0,
        seller: 1,
      }
    })
    mutate({
      variables: {
        orderFormId: orderForm.orderFormId,
        items: updatedItem,
      },
      refetchQueries: [{ query: orderFormQuery }],
    }).then(() => {
      this.props.onUpdateItemsQuantity(this.props.data.orderForm.items.length - 1)
    })
  }

  onUpdateItems = (id, quantity) => {
    this.setState({ showSpinner: true })
    const { mutate, data: { orderForm } } = this.props
    const itemPayload = orderForm.items.find(item => item.id === id)
    const index = orderForm.items.indexOf(itemPayload)
    const updatedItem = [itemPayload].map(item => {
      return {
        id: parseInt(item.id),
        index: index,
        quantity: quantity,
        seller: 1,
      }
    })
    mutate({
      variables: {
        orderFormId: orderForm.orderFormId,
        items: updatedItem,
      },
      refetchQueries: [{ query: orderFormQuery }],
    }).then(() => {
      this.setState({
        showSpinner: false,
      })
    })
  }

  renderWithoutItems = label => (
    <div className="vtex-minicart__item pa4 flex items-center justify-center relative bg-white">
      <span className="f5">{label}</span>
    </div>
  )

  renderMiniCartWithItems = (
    orderForm,
    label,
    showRemoveButton,
    enableQuantitySelector,
    maxQuantity,
    showSpinner
  ) => (
    <div className="flex flex-column relative" >
      <div className="bg-white">
        <div className="vtex-minicart__content pr4 pl4 overflow-auto overflow-x-hidden">
          {orderForm.items.map(item => (
            <div className="flex flex-row" key={item.id}>
              <MiniCartItem
                {...item}
                removeItem={this.onRemoveItem}
                updateItem={this.onUpdateItems}
                showRemoveButton={showRemoveButton}
                enableQuantitySelector={enableQuantitySelector}
                maxQuantity={maxQuantity} />
            </div>
          ))}
        </div>
        <div className="fl pa4">
          <Button primary onClick={this.handleClickButton}>{label}</Button>
        </div>
        <div className="flex flex-row fr pt4 mt2 mr4">
          {showSpinner &&
            <Spinner size={18} />
          }
          <ProductPrice
            sellingPrice={orderForm.value}
            listPrice={orderForm.value}
            showLabels={false}
            showListPrice={false} />
        </div>
      </div>
    </div>
  )

  renderLoading = () => (
    <div className="vtex-minicart__item pa4 flex items-center justify-center relative bg-white">
      <Spinner />
    </div>
  )

  componentDidMount() {
    this.props.data.refetch().then(() => {
      this.props.onUpdateItemsQuantity(this.props.data.orderForm.items.length)
    })
  }

  render() {
    const {
      data,
      labelMiniCartEmpty,
      labelButton,
      intl,
      showRemoveButton,
      enableQuantitySelector,
      maxQuantity,
    } = this.props
    const { showSpinner } = this.state

    if (data.loading) {
      return this.renderLoading()
    }

    if (!data.orderForm || !data.orderForm.items.length) {
      const label = labelMiniCartEmpty || intl.formatMessage({ id: 'minicart-empty' })
      return this.renderWithoutItems(label)
    }

    const label = labelButton || intl.formatMessage({ id: 'finish-shopping-button-label' })

    return this.renderMiniCartWithItems(
      data.orderForm,
      label,
      showRemoveButton,
      enableQuantitySelector,
      maxQuantity,
      showSpinner
    )
  }
}

export default injectIntl(graphql(updateItemsMutation)(MiniCartContent))
