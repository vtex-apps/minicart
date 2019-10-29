const isParentItem = ({ parentItemIndex, parentAssemblyBinding }: any) =>
  parentItemIndex == null && parentAssemblyBinding == null

export const shouldShowItem = (item: OrderFormItem) =>
  !!item.quantity && isParentItem(item)
