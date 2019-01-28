import { all, values, partition, propEq, find } from 'ramda'

export const CHOICE_TYPES = {
  SINGLE: 'SINGLE',
  MULTIPLE: 'MULTIPLE',
  TOGGLE: 'TOGGLE',
}

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

const findParentOption = (item, orderForm) => {
  const { parentItemIndex, parentAssemblyBinding } = item
  if (isParentItem(item)) { return null }
  const parentId = orderForm.items[parentItemIndex].id

  const parentMetadata = find(propEq('id', parentId))(orderForm.itemMetadata.items)
  if (!parentMetadata) { return null }

  return find(propEq('id', parentAssemblyBinding))(parentMetadata.assemblyOptions)
}

const isParentOptionSingleChoice = ({composition: { minQuantity, maxQuantity }}) =>
  minQuantity === 1 && maxQuantity === 1

const isParentOptionToggleChoice = ({ composition: { items }}) => all(propEq('maxQuantity', 1))(items)

export const getOptionChoiceType = (item, orderForm) => {
  const parentOption = findParentOption(item, orderForm)
  if (!parentOption) { return CHOICE_TYPES.MULTIPLE }
  const isSingle = isParentOptionSingleChoice(parentOption)
  if (isSingle) { return CHOICE_TYPES.SINGLE }
  const isToggle = isParentOptionToggleChoice(parentOption)
  if (isToggle) { return CHOICE_TYPES.TOGGLE }

  return CHOICE_TYPES.MULTIPLE
}
