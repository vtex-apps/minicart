import React, { Component } from 'react'
import orderFormQuery from './graphql/orderFormQuery.gql'
import { graphql } from 'react-apollo'
import { Button } from 'vtex.styleguide'

import CartIcon from './images/CartIcon'
import MiniCartContent from './components/MiniCartContent'
import { MiniCartPropTypes } from './propTypes'
import Sidebar from './components/Sidebar'

import './global.css'

/**
 * Minicart component
 */
export class MiniCart extends Component {
  static propTypes = MiniCartPropTypes

  static getSchema = props => {
    const getQuantitySelectorSchema = () => {
      return {
        maxQuantity: {
          title: 'editor.minicart.maxQuantity.title',
          type: 'number',
          minimum: 1,
          maximum: 10,
          default: 1,
          widget: {
            'ui:widget': 'range',
          },
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
        },
        showRemoveButton: {
          title: 'editor.minicart.showRemoveButton.title',
          type: 'boolean',
        },
        labelMiniCartEmpty: {
          title: 'editor.minicart.labelMiniCartEmpty.title',
          type: 'string',
        },
        labelButtonFinishShopping: {
          title: 'editor.minicart.labelButtonFinishShopping.title',
          type: 'string',
        },
        enableQuantitySelector: {
          title: 'editor.minicart.enableQuantitySelector.title',
          type: 'boolean',
        },
        ...generatedSchema,
      },
    }
  }

  state = {
    quantityItems: 0,
    showSideBar: false,
  }

  componentDidMount() {
    document.addEventListener('item:add', this.handleItemAdd)
  }

  handleClickButton = () => {
    const { hideContent, type } = this.props
    if (!hideContent) {
      if (type && type === 'sidebar') {
        this.setState({
          showSideBar: true,
        })
      } else {
        location.assign('/checkout/#/cart')
      }
    }
  }

  handleCloseSideBarButtonClick = () => {
    this.setState({
      showSideBar: false,
    })
  }

  componentWillUnmount() {
    document.removeEventListener('item:add', this.handleItemAdd)
  }

  handleItemAdd = () => {
    this.props.data.refetch()
  }

  handleUpdateQuantityItems = quantity => this.setState({ quantityItems: quantity })

  render() {
    const { showSideBar } = this.state
    const {
      labelMiniCartEmpty,
      labelButtonFinishShopping,
      miniCartIconColor,
      showRemoveButton,
      enableQuantitySelector,
      maxQuantity,
      data,
      type,
      hideContent,
    } = this.props
    const { orderForm } = data
    const quantity = orderForm && orderForm.items ? orderForm.items.length : 0
    return (
      <div className="vtex-minicart relative fr">
        <Button
          variation="tertiary"
          icon
          onClick={this.handleClickButton}
        >
          <CartIcon fillColor={miniCartIconColor} />
          {quantity > 0 && <span className="vtex-minicart__bagde mt1 mr1">
            {quantity}
          </span>}
        </Button>
        {!hideContent && ((type && type === 'sidebar') ? (showSideBar &&
          <Sidebar
            onBackClick={this.handleCloseSideBarButtonClick}
          >
            <MiniCartContent
              large
              data={data}
              onUpdateItemsQuantity={this.handleUpdateQuantityItems}
              showRemoveButton={showRemoveButton}
              labelMiniCartEmpty={labelMiniCartEmpty}
              labelButton={labelButtonFinishShopping}
              enableQuantitySelector={enableQuantitySelector}
              maxQuantity={maxQuantity}
            />
          </Sidebar>)
          : (!showSideBar &&
            <div className="vtex-minicart__box absolute right-0 z-max flex flex-colunm">
              <div className="shadow-3">
                <div className="vtex-minicart__arrow-up absolute top-0 right-0 shadow-3" />
                <div className="vtex-minicart__content-container mt3 bg-white relative">
                  <MiniCartContent
                    data={data}
                    onUpdateItemsQuantity={this.handleUpdateQuantityItems}
                    showRemoveButton={showRemoveButton}
                    labelMiniCartEmpty={labelMiniCartEmpty}
                    labelButton={labelButtonFinishShopping}
                    enableQuantitySelector={enableQuantitySelector}
                    maxQuantity={maxQuantity}
                  />
                </div>
              </div>
            </div>
          ))}
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
