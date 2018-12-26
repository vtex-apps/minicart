import { values, partition } from 'ramda'

export const isParentItem = 
  ({ parentItemIndex, parentAssemblyBinding }) => parentItemIndex == null && parentAssemblyBinding == null

export const groupItemsWithParents = (orderForm) => {
  const [parentItems, options] = partition(isParentItem, orderForm.items)

  const parentMap = parentItems.reduce((prev, curr) => ({ ...prev, [curr.id]: { ...curr, addedOptions: [] } }),{})
  return values(
    options.reduce((prev, currOption) => {
      const { parentItemIndex } = currOption
      const parentId = orderForm.items[parentItemIndex].id
      const parentObj = prev[parentId]
      parentObj.addedOptions.push({ ...currOption })
      return { 
        ...prev,
        [parentId]: parentObj,
      }
    }, parentMap)
  )
}