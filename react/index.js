import React, { Component } from 'react'
import { Button } from 'vtex.styleguide'
import { isMobile } from 'react-device-detect'
import { withRuntimeContext } from 'vtex.render-runtime'
import { IconCart } from 'vtex.dreamstore-icons'

import MiniCartContent from './components/MiniCartContent'
import { MiniCartPropTypes } from './propTypes'
import Sidebar from './components/Sidebar'
import Popup from './components/Popup'
import { shouldShowItem } from './utils/itemsHelper'
import { orderFormConsumer } from 'vtex.store-resources/OrderFormContext'
import classNames from 'classnames'

import minicart from './minicart.css'

const DEFAULT_LABEL_CLASSES = ''
const DEFAULT_ICON_CLASSES = 'gray'

/**
 * Minicart component
 */
export class MiniCart extends Component {
  static propTypes = MiniCartPropTypes

  static defaultProps = {
    labelClasses: DEFAULT_LABEL_CLASSES,
    iconClasses: DEFAULT_ICON_CLASSES,
  }

  state = {
    openContent: false,
  }

  handleClickButton = event => {
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

  handleItemAdd = () => {
    this.props.orderFormContext.refetch()
  }

  onClickProduct = detailUrl => {
    this.setState({
      openContent: false,
    })
    const {
      runtime: { navigate },
    } = this.props
    navigate({
      to: detailUrl,
    })
  }

  getFilteredItems = () => {
    const {
      orderFormContext: { orderForm },
    } = this.props
    if (!orderForm || !orderForm.items) return []
    return orderForm.items.filter(shouldShowItem)
  }

  render() {
    const { openContent } = this.state
    const {
      labelMiniCartEmpty,
      labelButtonFinishShopping,
      iconClasses,
      iconSize,
      iconLabel,
      labelClasses,
      showDiscount,
      orderFormContext,
      type,
      hideContent,
      showShippingCost,
    } = this.props

    const itemsToShow = this.getFilteredItems()
    const quantity = itemsToShow.length

    const isSizeLarge =
      (type && type === 'sidebar') ||
      isMobile ||
      (window && window.innerWidth <= 480)

    const miniCartContent = (
      <MiniCartContent
        isSizeLarge={isSizeLarge}
        itemsToShow={itemsToShow}
        data={orderFormContext}
        showDiscount={showDiscount}
        labelMiniCartEmpty={labelMiniCartEmpty}
        labelButton={labelButtonFinishShopping}
        onClickProduct={this.onClickProduct}
        handleUpdateContentVisibility={this.handleUpdateContentVisibility}
        actionOnClick={this.handleUpdateContentVisibility}
        showShippingCost={showShippingCost}
      />
    )

    const iconLabelClasses = classNames(
      `${minicart.label} dn-m db-l t-action--small ${labelClasses}`,
      {
        'pl6': quantity > 0,
        'pl4': quantity <= 0
      }
    )

    return (
      <aside
        className={`${minicart.container} relative fr flex items-center`}
        ref={e => this.iconRef = e}
      >
        <Button
          variation="tertiary"
          icon
          onClick={event => this.handleClickButton(event)}
        >
          <span className="flex items-center">
            <span className={`relative ${iconClasses}`}>
              <IconCart size={iconSize} />
              {quantity > 0 && (
                <span
                  className={`${
                    minicart.badge
                    } c-on-emphasis absolute t-mini bg-emphasis br4 w1 h1 pa1 flex justify-center items-center lh-solid`}
                >
                  {quantity}
                </span>
              )}
            </span>
            {iconLabel && (
              <span className={iconLabelClasses}>
                {iconLabel}
              </span>
            )}
          </span>
        </Button>
        {!hideContent &&
          (isSizeLarge ? (
            <Sidebar
              onOutsideClick={this.handleUpdateContentVisibility}
              isOpen={openContent}
            >
              {miniCartContent}
            </Sidebar>
          ) : (
              openContent && (
                <Popup
                  onOutsideClick={this.handleUpdateContentVisibility}
                  buttonOffsetWidth={this.iconRef.offsetWidth}
                >
                  {miniCartContent}
                </Popup>
              )
            ))}
      </aside>
    )
  }
}

const miniHOC = orderFormConsumer(MiniCart)

miniHOC.schema = {
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
          inline: true,
        },
      },
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
  },
}

export default withRuntimeContext(miniHOC)
