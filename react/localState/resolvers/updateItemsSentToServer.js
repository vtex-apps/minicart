import { ITEMS_STATUS } from '../index'

const updateItemsSentToServer = cartItems => {
  const itemsWithStatus = cartItems.map(item => {
    if (item.localStatus === ITEMS_STATUS.MODIFIED) {
      return {
        ...item,
        localStatus: ITEMS_STATUS.WAITING_SERVER,
      }
    }
    return item
  })
  return itemsWithStatus
}

export default updateItemsSentToServer
