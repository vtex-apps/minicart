import { shouldShowItem } from '../utils/itemsHelper'
import orderForm, { fullItems } from 'orderForm'

it('should return one item to show', () => {
  const parentItems = orderForm.items.filter(shouldShowItem)
  expect(parentItems.length).toBe(1)
})

it('should return all items to show', () => {
  const parentItems = fullItems.items.filter(shouldShowItem)
  expect(parentItems.length).toBe(fullItems.items.length)
})
