import { ITEMS_STATUS } from '../index'

const addToCart = (cartItems, newItems) => {
  const newCartItems = newItems.map(item => ({
    ...item,
    localStatus: navigator.onLine
      ? ITEMS_STATUS.MODIFIED
      : ITEMS_STATUS.LOCAL_ITEM,
  }))
  const writeItems = [...cartItems, ...newCartItems]
  return writeItems
}

export default addToCart
