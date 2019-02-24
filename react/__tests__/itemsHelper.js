import {
  shouldShowItem
} from '../utils/itemsHelper'
import orderFormAttachments from '../__mocks__/orderFormAttachments.json'
import orderForm from '../__mocks__/orderForm'

it('should return one item to show', () => {
  const parentItems = orderFormAttachments.items.filter(shouldShowItem)
  expect(parentItems.length).toBe(1)
})

it('should return all items to show', () => {
  const parentItems = orderForm.items.filter(shouldShowItem)
  expect(parentItems.length).toBe(orderForm.items.length)
})
