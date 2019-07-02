import { ITEMS_STATUS } from '../index'

const addToCart = (cartItems, newItems) => {
  const newCartItems = newItems.map(item => ({
    ...item,
    localStatus: ITEMS_STATUS.MODIFIED,
  }))
  const writeItems = [...cartItems, ...newCartItems]
  return writeItems
}

export default addToCart
