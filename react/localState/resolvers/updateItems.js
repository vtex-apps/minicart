import { mergeDeepRight } from 'ramda'

import { mapToMinicartItem, ITEMS_STATUS } from '../index'

const updateItems = (cartItems, newItems) => {
  const items = [...cartItems]

  for (const newItem of newItems) {
    const { index } = newItem
    const prevItem = cartItems[index]
    items[index] = mapToMinicartItem(
      mergeDeepRight(prevItem, {
        ...newItem,
        localStatus: ITEMS_STATUS.MODIFIED,
      })
    )
  }
  return items.filter(Boolean)
}

export default updateItems
