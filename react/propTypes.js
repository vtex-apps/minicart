import PropTypes from 'prop-types'

export const MiniCartPropTypes = {
  /* Set the minicart type */
  type: PropTypes.string,
  /* Set the content visibility */
  hideContent: PropTypes.bool,
  /* Label that wiil appear when the minicart is empty */
  labelMiniCartEmpty: PropTypes.string,
  /* Finish shopping button label */
  labelButtonFinishShopping: PropTypes.string,
  /* Icon's classnames */
  iconClasses: PropTypes.string,
  /* Icon's size */
  iconSize: PropTypes.number,
  /* Icon's label */
  iconLabel: PropTypes.string,
  /* Label's classnames */
  labelClasses: PropTypes.string,
  /* Set the visibility of remove button */
  showRemoveButton: PropTypes.bool,
  /* Set the discount visibility */
  showDiscount: PropTypes.bool,
  /* Set the visibility of the sku */
  showSku: PropTypes.bool,
  /* Set the visibility of the Quantity Selector */
  enableQuantitySelector: PropTypes.bool,
  /* The orderForm object */
  orderForm: PropTypes.shape({
    /* Order form id */
    orderFormId: PropTypes.string,
    /* Total price of the order */
    value: PropTypes.number,
    /* Items in the mini cart */
    items: PropTypes.arrayOf(PropTypes.object),
    /* Shipping Address */
    shippingData: PropTypes.shape({
      address: PropTypes.shape({
        addressName: PropTypes.string,
        addressType: PropTypes.string,
        city: PropTypes.string,
        complement: PropTypes.string,
        country: PropTypes.string,
        id: PropTypes.string,
        neighborhood: PropTypes.string,
        number: PropTypes.string,
        postalCode: PropTypes.string,
        receiverName: PropTypes.string,
        reference: PropTypes.string,
        state: PropTypes.string,
        street: PropTypes.string,
        userId: PropTypes.string,
      }),
      /* Available Addresses */
      availableAddresses: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
  /* Max quantity for the Quantity Selector */
  maxQuantity: PropTypes.number,
  /* Set the shipping fee visibility */
  showShippingCost: PropTypes.bool,
}
