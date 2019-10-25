import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Spinner } from 'vtex.styleguide'

import styles from '../minicart.css'
import MiniCartWithItems from './MiniCartWithItems'

const MiniCartWithoutItems = ({ labelMiniCartEmpty }) => (
  <div
    className={`${styles.item} pa9 flex items-center justify-center relative bg-base`}
  >
    <span className="t-body">
      {labelMiniCartEmpty || <FormattedMessage id="store/minicart-empty" />}
    </span>
  </div>
)

const Loading = () => (
  <div
    className={`${styles.item} pa4 flex items-center justify-center relative bg-base`}
  >
    <Spinner />
  </div>
)

/**
 * Minicart content component
 */

const MiniCartContent = ({
  itemsToShow,
  labelMiniCartEmpty,
  labelButton,
  showDiscount,
  onClickAction,
  isSizeLarge,
  showShippingCost,
  orderForm,
  loading,
  updatingOrderForm,
  linkButton,
}) => {
  if (loading) {
    return <Loading />
  }

  if (!orderForm || !itemsToShow.length) {
    return <MiniCartWithoutItems labelMiniCartEmpty={labelMiniCartEmpty} />
  }

  return (
    <MiniCartWithItems
      itemsToShow={itemsToShow}
      orderForm={orderForm}
      updatingOrderForm={updatingOrderForm}
      linkButton={linkButton}
      labelButton={labelButton}
      showDiscount={showDiscount}
      onClickAction={onClickAction}
      isSizeLarge={isSizeLarge}
      showShippingCost={showShippingCost}
    />
  )
}

export default MiniCartContent
