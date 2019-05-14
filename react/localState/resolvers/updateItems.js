import { mergeDeepRight } from 'ramda'

import { mapToMinicartItem, ITEMS_STATUS } from '../index'

const shouldBeInCart = (item, itemsRemovedIndexes) =>
  item.quantity !== 0 && !itemsRemovedIndexes.includes(item.parentItemIndex)

const updateItems = (cartItems, newItems) => {
  // Items provided to this function MUST have a valid index property
  const cleanNewItems = newItems.filter(({ index }) => index != null)
  const items = [...cartItems]

  const itemsToBeRemoved = cleanNewItems
    .filter(({ quantity }) => quantity === 0)
    .map(({ cartIndex }) => cartIndex)

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

  let itemsRemoved = 0
  if (itemsToBeRemoved.length > 0) {
    for (const item of items) {
      if (shouldBeInCart(item, itemsToBeRemoved)) {
        item.cartIndex -= itemsRemoved
      } else {
        itemsRemoved += 1
        // Set quantity to 0 for children of parent assembly options to be removed
        item.quantity = 0
      }
    }
  }

  return items.filter(Boolean)
}

export default updateItems
