import updateItems from '../localState/resolvers/updateItems'
import orderForm from 'orderForm'
import { ITEMS_STATUS } from '../localState'

it('should update quantity of item in cart', () => {
  const cartItems = orderForm.items
  const updateItemsPayload = [
    {index: 0, quantity: 2, id: orderForm.items[0].id}
  ]
  const writeItems = updateItems(cartItems, updateItemsPayload)

  const wereItemsModified = updateItemsPayload.every(({ index }) => writeItems[index].localStatus === ITEMS_STATUS.MODIFIED)

  expect(wereItemsModified).toBe(true)
  const itemsCorrect = updateItemsPayload.every(({ quantity, index }) => quantity === writeItems[index].quantity)
  expect(itemsCorrect).toBe(true)

  expect(writeItems.length).toBe(cartItems.length)
})

it('should update quantity of more than one item in cart', () => {
  const cartItems = orderForm.items
  const updateItemsPayload = [
    {index: 0, quantity: 2, id: orderForm.items[0].id},
    {index: 2, quantity: 9, id: orderForm.items[2].id},
  ]
  const writeItems = updateItems(cartItems, updateItemsPayload)

  const wereItemsModified = updateItemsPayload.every(({ index }) => writeItems[index].localStatus === ITEMS_STATUS.MODIFIED)

  expect(wereItemsModified).toBe(true)
  const itemsCorrect = updateItemsPayload.every(({ quantity, index }) => quantity === writeItems[index].quantity)
  expect(itemsCorrect).toBe(true)

  expect(writeItems.length).toBe(cartItems.length)
})