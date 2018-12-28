/* eslint-env jest */

import { isParentItem, isRequiredOption, groupItemsWithParents } from '../itemsHelper'
import orderForm from '../__mocks__/orderForm.json'

it('should return only items that dont have parent', () => {
  const parentItems = orderForm.items.filter(isParentItem)
  expect(parentItems.length).toBe(1)
})

it('should group items and its attachments', () => {
  const items = orderForm.items
  const itemsWithOptions = groupItemsWithParents(orderForm)
  const parentItemsCount = itemsWithOptions.length
  const addedOptionsCount = 
    itemsWithOptions.reduce((prev, curr) => prev + curr.addedOptions.length, 0)
  expect(parentItemsCount).toBe(1)
  expect(addedOptionsCount).toBe(2)

  // Test if all orderForm items are present either as parents or as added options
  expect(parentItemsCount + addedOptionsCount).toBe(items.length)
})

it('should return crust item as required', () => {
  const items = orderForm.items
  const classicCrust = items.find(({ name }) => name === 'Classic Crust')
  const isCrustRequired = isRequiredOption(classicCrust, orderForm)
  expect(isCrustRequired).toBe(true)
  
  const pepperoni = items.find(({ name }) => name === 'Pepperoni')
  const isPepperoniRequired = isRequiredOption(pepperoni, orderForm)
  // should be false
  expect(isPepperoniRequired).toBe(false)
})

