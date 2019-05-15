import updateItems from '../localState/resolvers/updateItems'
import orderForm from 'orderForm'
import { ITEMS_STATUS } from '../localState'

it('should update quantity of item in cart', () => {
  const cartItems = orderForm.items
  const updateItemsPayload = [
    { index: 0, quantity: 2, id: orderForm.items[0].id },
  ]
  const writeItems = updateItems(cartItems, updateItemsPayload)

  const wereItemsModified = updateItemsPayload.every(
    ({ index }) => writeItems[index].localStatus === ITEMS_STATUS.MODIFIED
  )

  expect(wereItemsModified).toBe(true)
  const itemsCorrect = updateItemsPayload.every(
    ({ quantity, index }) => quantity === writeItems[index].quantity
  )
  expect(itemsCorrect).toBe(true)

  expect(writeItems.length).toBe(cartItems.length)
})

it('should update quantity of more than one item in cart', () => {
  const cartItems = orderForm.items
  const updateItemsPayload = [
    { index: 0, quantity: 2, id: orderForm.items[0].id },
    { index: 2, quantity: 9, id: orderForm.items[2].id },
  ]
  const writeItems = updateItems(cartItems, updateItemsPayload)

  const wereItemsModified = updateItemsPayload.every(
    ({ index }) => writeItems[index].localStatus === ITEMS_STATUS.MODIFIED
  )

  expect(wereItemsModified).toBe(true)
  const itemsCorrect = updateItemsPayload.every(
    ({ quantity, index }) => quantity === writeItems[index].quantity
  )
  expect(itemsCorrect).toBe(true)

  expect(writeItems.length).toBe(cartItems.length)
})

it('should update items correctly after deleting an item', () => {
  const cartItems = [
    { id: '0', name: 'item0', quantity: 5, cartIndex: 0 },
    { id: '1', name: 'item1', quantity: 1, cartIndex: 1 },
    { id: '2', name: 'item3', quantity: 5, cartIndex: 2 },
  ]
  //delete middle item
  const deleteItem = [{ index: 1, quantity: 0, id: '1' }]
  const itemsDeleted = updateItems(cartItems, deleteItem)
  expect(itemsDeleted[2].optimisticIndex).toBe(1)

  // update previous third (now second) item
  const updateItem = [{ index: 2, quantity: 3, id: '2' }]
  const finalItems = updateItems(cartItems, updateItem)
  expect(finalItems[2].quantity).toBe(3)
})

it('should update items correctly after deleting an item with children', () => {
  const cartItems = [
    ...orderForm.items,
    { id: '0', name: 'item0', quantity: 5, cartIndex: orderForm.items.length },
  ]

  //delete first item, should delete all its children
  const deleteItem = [{ index: 0, quantity: 0, id: orderForm.items[0].id }]
  const itemsDeleted = updateItems(cartItems, deleteItem)
  expect(itemsDeleted[5].optimisticIndex).toBe(0)

  // update previous last (now only) item
  const updateItem = [{ index: 5, quantity: 3, id: '0' }]
  const finalItems = updateItems(cartItems, updateItem)
  expect(finalItems[5].quantity).toBe(3)
})
