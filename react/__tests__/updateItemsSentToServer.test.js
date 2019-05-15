import updateItemsSentToServer from '../localState/resolvers/updateItemsSentToServer'
import orderForm from 'orderForm'
import { ITEMS_STATUS } from '../localState'

it('should append new items to end of cart', () => {
  const cartItems = orderForm.items
  for (const cartItem of cartItems) {
    cartItem.localStatus = ITEMS_STATUS.NONE
  }
  cartItems[0].localStatus = ITEMS_STATUS.MODIFIED
  cartItems[2].localStatus = ITEMS_STATUS.MODIFIED
  cartItems[3].localStatus = ITEMS_STATUS.WAITING_SERVER

  const writeItems = updateItemsSentToServer(cartItems)
  // Testing if modified items are now in waiting server status
  expect(writeItems[0].localStatus === ITEMS_STATUS.WAITING_SERVER).toBe(true)
  expect(writeItems[2].localStatus === ITEMS_STATUS.WAITING_SERVER).toBe(true)

  // Testing if unmodified items are now in their old state
  expect(writeItems[1].localStatus === ITEMS_STATUS.NONE).toBe(true)
  expect(writeItems[3].localStatus === ITEMS_STATUS.WAITING_SERVER).toBe(true)
  // Testing that there are NO items in MODIFIED status
  expect(writeItems.every(({ localStatus }) => localStatus !== ITEMS_STATUS.MODIFIED))
})
