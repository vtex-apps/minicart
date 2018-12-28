import { values, partition, propEq, find } from 'ramda'

export const isParentItem = 
  ({ parentItemIndex, parentAssemblyBinding }) => parentItemIndex == null && parentAssemblyBinding == null

export const groupItemsWithParents = (orderForm) => {
  const [parentItems, options] = partition(isParentItem, orderForm.items)

  const parentMap = parentItems.reduce((prev, curr) => ({ ...prev, [curr.id]: { ...curr, addedOptions: [] } }), {})
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

export const isRequiredOption = (item, orderForm) => {
  const { parentItemIndex, parentAssemblyBinding } = item
  if (isParentItem(item)) { return false }
  const parentId = orderForm.items[parentItemIndex].id

  const parentMetadata = find(propEq('id', parentId))(orderForm.itemMetadata.items)
  if (!parentMetadata) { return false }

  const parentOptions = find(propEq('id', parentAssemblyBinding))(parentMetadata.assemblyOptions)
  if (!parentOptions) { return false }

  const { composition: { minQuantity, maxQuantity } } = parentOptions
  return minQuantity === 1 && maxQuantity === 1
}
