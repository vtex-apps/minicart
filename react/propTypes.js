import PropTypes from 'prop-types'

export const MiniCartPropTypes = {
  /* Set the minicart type */
  type: PropTypes.string.isRequired,
  /* Label that wiil appear when the minicart is empty */
  labelMiniCartEmpty: PropTypes.string,
  /* Finish shopping button label */
  labelButtonFinishShopping: PropTypes.string,
  /* Mini cart icon color */
  miniCartIconColor: PropTypes.string,
  /* Set the visibility of remove button */
  showRemoveButton: PropTypes.bool,
  /* Set the visibility of the Quantity Selector */
  enableQuantitySelector: PropTypes.bool,
  /* Max quantity for the Quantity Selector */
  maxQuantity: PropTypes.number,
  /* Products in the cart */
  data: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    /* Function to refetch the orderForm query */
    refetch: PropTypes.func.isRequired,
    /* Order form */
    orderForm: PropTypes.shape({
      /* Order form id */
      orderFormId: PropTypes.string,
      /* Total price of the order */
      value: PropTypes.number,
      /* Items in the mini cart */
      items: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
}
