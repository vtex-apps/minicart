import { mergeDeepRight, prop, propEq } from 'ramda'

import { mapToMinicartItem, ITEMS_STATUS } from '../index'

const shouldBeInCart = (item, itemsRemovedIndexes) =>
  item.quantity !== 0 && !itemsRemovedIndexes.includes(item.parentItemIndex)

const updateItems = (cartItems, newItems) => {
  // Items provided to this function MUST have a valid index property
  const cleanNewItems = newItems.filter(({ index }) => index != null)
  const items = [...cartItems]

  const itemsToBeRemoved = cleanNewItems
    .filter(propEq('quantity', 0))
    .map(prop('index'))

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
    for (let index = 0; index < items.length; index++) {
      const item = items[index]
      if (shouldBeInCart(item, itemsToBeRemoved)) {
        item.optimisticIndex = index - itemsRemoved
      } else {
        itemsRemoved += 1
        // Set quantity to 0 for children of parent assembly options to be removed
        item.quantity = 0
      }
    }
  }
  return items
}

export default updateItems
