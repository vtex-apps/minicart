import addToCart from '../localState/resolvers/addToCart'
import orderForm from 'orderForm'
import { ITEMS_STATUS } from '../localState'

it('should append new items to end of cart', () => {
  const cartItems = orderForm.items
  const newItems = [{
    id: '100',
    name: 'Chiclete',
    imageUrl: 'imageUrl',
    detailUrl: '/chiclete/p',
    skuName: 'chiclete',
    quantity: 1,
    sellingPrice: 0,
    listPrice: 0,
    parentItemIndex: null,
    parentAssemblyBinding: null,
    assemblyOptions: {
      added: [],
      removed: [],
      parentPrice: 0,
    },
  },{
    id: '101',
    name: 'Chiclete de menta',
    imageUrl: 'imageUrl',
    detailUrl: '/chiclete-de-menta/p',
    skuName: 'chiclete de menta',
    quantity: 1,
    sellingPrice: 0,
    listPrice: 0,
    parentItemIndex: null,
    parentAssemblyBinding: null,
    assemblyOptions: {
      added: [],
      removed: [],
      parentPrice: 0,
    },
  }]
  const writeItems = addToCart(orderForm.items, newItems)
  expect(writeItems.length).toBe(cartItems.length + newItems.length)

  const lastItems = writeItems.slice(orderForm.items.length)
  // Test if the last item is identical to the item just added
  const areEqual = (a, b) => a.name === b.name && a.id === b.id
  expect(lastItems.every((addedItem, index) => areEqual(addedItem, newItems[index]))).toBe(true)

  //Test if recently added item has correct status
  expect(lastItems.every(addedItem => addedItem.localStatus === ITEMS_STATUS.MODIFIED)).toBe(true)
})
