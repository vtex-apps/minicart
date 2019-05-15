import { mergeDeepRight } from 'ramda'

import { mapToMinicartItem, ITEMS_STATUS } from '../index'

const updateItems = (cartItems, newItems) => {
  // Items provided to this function MUST have a valid index property
  const cleanNewItems = newItems.filter(({ index }) => index != null)
  const items = [...cartItems]

  for (const newItem of cleanNewItems) {
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
