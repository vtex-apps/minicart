import React, { Component } from 'react'
import orderFormQuery from './graphql/orderFormQuery.gql'
import { graphql } from 'react-apollo'
import { Button } from 'vtex.styleguide'

import CartIcon from './images/CartIcon'
import MiniCartContent from './components/MiniCartContent'
import { MiniCartPropTypes } from './propTypes'
import Sidebar from './components/Sidebar'
import Popup from './components/Popup'

import './global.css'

const MINIMUM_MAX_QUANTITY = 1
const MAXIMUM_MAX_QUANTITY = 10
const DEFAULT_MAX_QUANTITY = 1

/**
 * Minicart component
 */
export class MiniCart extends Component {
  static propTypes = MiniCartPropTypes

  static defaultProps = {
    maxQuantity: DEFAULT_MAX_QUANTITY,
  }

  static getSchema = props => {
    const getQuantitySelectorSchema = () => {
      return {
        maxQuantity: {
          title: 'editor.minicart.maxQuantity.title',
          type: 'number',
          minimum: MINIMUM_MAX_QUANTITY,
          maximum: MAXIMUM_MAX_QUANTITY,
          default: DEFAULT_MAX_QUANTITY,
          widget: {
            'ui:widget': 'range',
          },
          isLayout: true,
        },
      }
    }

    const generatedSchema = props.enableQuantitySelector && getQuantitySelectorSchema()

    return {
      title: 'editor.minicart.title',
      description: 'editor.minicart.description',
      type: 'object',
      properties: {
        type: {
          title: 'editor.minicart.type.title',
          type: 'string',
          default: 'popup',
          enum: ['popup', 'sidebar'],
          enumNames: [
            'editor.minicart.type.popup',
            'editor.minicart.type.sidebar',
          ],
          widget: {
            'ui:widget': 'radio',
            'ui:options': {
              'inline': true,
            },
          },
          isLayout: true,
        },
        showRemoveButton: {
          title: 'editor.minicart.showRemoveButton.title',
          type: 'boolean',
          isLayout: true,
        },
        showDiscount: {
          title: 'editor.minicart.showDiscount.title',
          type: 'boolean',
          isLayout: true,
        },
        labelMiniCartEmpty: {
          title: 'editor.minicart.labelMiniCartEmpty.title',
          type: 'string',
          isLayout: false,
        },
        labelButtonFinishShopping: {
          title: 'editor.minicart.labelButtonFinishShopping.title',
          type: 'string',
          isLayout: false,
        },
        enableQuantitySelector: {
          title: 'editor.minicart.enableQuantitySelector.title',
          type: 'boolean',
          isLayout: true,
        },
        ...generatedSchema,
      },
    }
  }

  _mounted = false

  state = {
    quantityItems: 0,
    openContent: false,
    isMobile: false,
  }

  componentDidMount() {
    this._mounted = true

    document.addEventListener('item:add', this.handleItemAdd)

    import('ismobilejs')
      .then(module => module.default)
      .then(isMobile => {
        if (!this._mounted) {
          return
        }

        this.setState({
          isMobile: isMobile.any,
        })
      })
  }

  handleClickButton = (event) => {
    if (!this.props.hideContent) {
      this.setState({
        openContent: !this.state.openContent,
      })
    }
    event.persist()
  }

  handleUpdateContentVisibility = () => {
    this.setState({
      openContent: false,
    })
  }

  componentWillUnmount() {
    this._mounted = false
    document.removeEventListener('item:add', this.handleItemAdd)
  }

  handleItemAdd = () => {
    this.props.data.refetch()
  }

  handleUpdateQuantityItems = quantity => this.setState({ quantityItems: quantity })

  render() {
    const {
      openContent,
      isMobile,
    } = this.state
    const {
      labelMiniCartEmpty,
      labelButtonFinishShopping,
      miniCartIconColor,
      showRemoveButton,
      showDiscount,
      enableQuantitySelector,
      maxQuantity,
      data,
      type,
      hideContent,
    } = this.props
    const { orderForm } = data
    const quantity = orderForm && orderForm.items ? orderForm.items.length : 0
    const large = type && type === 'sidebar' || isMobile
    const miniCartContent = (
      <MiniCartContent
        large={large}
        data={data}
        onUpdateItemsQuantity={this.handleUpdateQuantityItems}
        showRemoveButton={showRemoveButton}
        showDiscount={showDiscount}
        labelMiniCartEmpty={labelMiniCartEmpty}
        labelButton={labelButtonFinishShopping}
        enableQuantitySelector={enableQuantitySelector}
        maxQuantity={maxQuantity}
      />
    )

    return (
      <div className="vtex-minicart relative fr">
        <Button variation="tertiary" icon onClick={event => this.handleClickButton(event)} >
          <CartIcon fillColor={miniCartIconColor} />
          {quantity > 0 &&
            <span className="vtex-minicart__bagde mt1 mr1">
              {quantity}
            </span>
          }
        </Button>
        {!hideContent && large ? openContent &&
          <Sidebar onOutsideClick={this.handleUpdateContentVisibility}>
            {miniCartContent}
          </Sidebar>
          : openContent &&
          <Popup showDiscount={showDiscount} onOutsideClick={this.handleUpdateContentVisibility}>
            {miniCartContent}
          </Popup>
        }
      </div>
    )
  }
}

const options = {
  options: () => ({
    ssr: false,
  }),
}

export default graphql(orderFormQuery, options)(MiniCart)
