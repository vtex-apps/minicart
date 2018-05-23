import PropTypes from 'prop-types'

export const MiniCartPropTypes = {
  /* Label that wiil appear when the minicart is empty */
  labelMiniCartEmpty: PropTypes.string,
  /* Finish shopping button label */
  labelButtonFinishShopping: PropTypes.string,
  /* Mini cart icon color */
  miniCartIconColor: PropTypes.string,
  /* Show the remove item button or not */
  showRemoveButton: PropTypes.bool,
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
      items: PropTypes.arrayOf(PropTypes.shape({
        /* Item's id */
        id: PropTypes.string,
        /* Item's name */
        name: PropTypes.string,
        /* Item's url details */
        detailUrl: PropTypes.string,
        /* Item's image url */
        imageUrl: PropTypes.string,
        /* Item's quantity */
        quantity: PropTypes.number,
        /* Item's selling price */
        sellingPrice: PropTypes.number,
        /* Item's list price */
        listPrice: PropTypes.number,
        /* Item's sku name */
        skuName: PropTypes.string,
      })),
    }),
  }).isRequired,
}
