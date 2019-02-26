/* eslint-env jest */

import {
  isParentItem,
  groupItemsWithParents,
  getOptionChoiceType,
  CHOICE_TYPES,
} from '../utils/itemsHelper'
import orderForm from 'orderForm'

it('should return only items that dont have parent', () => {
  const parentItems = orderForm.items.filter(isParentItem)
  expect(parentItems.length).toBe(1)
})

it('should group items and its attachments', () => {
  const items = orderForm.items
  const itemsWithOptions = groupItemsWithParents(orderForm)
  const parentItemsCount = itemsWithOptions.length
  const addedOptionsCount = itemsWithOptions.reduce(
    (prev, curr) => prev + curr.addedOptions.length,
    0
  )
  expect(parentItemsCount).toBe(1)
  expect(addedOptionsCount).toBe(2)

  // Test if all orderForm items are present either as parents or as added options
  expect(parentItemsCount + addedOptionsCount).toBe(items.length)
})

it('should return crust item as single choice', () => {
  const items = orderForm.items
  const classicCrust = items.find(({ name }) => name === 'Classic Crust')
  const isCrustRequired = getOptionChoiceType(classicCrust, orderForm)
  expect(isCrustRequired).toBe(CHOICE_TYPES.SINGLE)
})

it('should return pepperoni item as toggle choice', () => {
  const items = orderForm.items
  const pepperoni = items.find(({ name }) => name === 'Pepperoni')
  const isPepperoniToggle = getOptionChoiceType(pepperoni, orderForm)
  expect(isPepperoniToggle).toBe(CHOICE_TYPES.TOGGLE)
})
