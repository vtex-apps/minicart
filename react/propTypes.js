import PropTypes from 'prop-types'
import { contextPropTypes } from 'vtex.store/OrderFormContext'

export const MiniCartPropTypes = {
  /* Set the minicart type */
  type: PropTypes.string,
  /* Set the content visibility */
  hideContent: PropTypes.bool,
  /* Label that wiil appear when the minicart is empty */
  labelMiniCartEmpty: PropTypes.string,
  /* Finish shopping button label */
  labelButtonFinishShopping: PropTypes.string,
  /* Icon's color */
  iconColor: PropTypes.string,
  /* Icon's size */
  iconSize: PropTypes.number,
  /* Icon's label */
  iconLabel: PropTypes.string,
  /* Label's color */
  labelColor: PropTypes.string,
  /* Set the visibility of remove button */
  showRemoveButton: PropTypes.bool,
  /* Set the discount visibility */
  showDiscount: PropTypes.bool,
  /* Set the visibility of the sku */
  showSku: PropTypes.bool,
  /* Set the visibility of the Quantity Selector */
  enableQuantitySelector: PropTypes.bool,
  /* Max quantity for the Quantity Selector */
  maxQuantity: PropTypes.number,
  /* Products in the cart */
  orderFormContext: contextPropTypes,
}
