import { mapToMinicartItem, ITEMS_STATUS } from '../index'

const addToCart = (cartItems, newItems) => {
  const newCartItems = newItems.map(item =>
    mapToMinicartItem({ ...item, localStatus: ITEMS_STATUS.MODIFIED })
  )
  const writeItems = [...cartItems, ...newCartItems]
  return writeItems
}

export default addToCart
