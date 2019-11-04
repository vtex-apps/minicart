import React, { useState, Fragment, FC } from 'react'
import { ButtonWithIcon } from 'vtex.styleguide'
import { IconCart } from 'vtex.store-icons'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useDevice } from 'vtex.device-detector'
import { useCssHandles } from 'vtex.css-handles'
import { Drawer } from 'vtex.store-drawer'

import Popup from './Popup'
import Content from './Content'

const CSS_HANDLES = [
  'minicartWrapperContainer',
  'minicartContent',
  'minicartSideBarContentWrapper',
  'minicartContainer',
  'minicartIconContainer',
  'minicartQuantityBadge',
  'minicartFooter',
  'minicartEmptyStateText',
  'minicartEmptyStateContainer',
] as const

interface Props {
  type: 'popup' | 'sidebar'
  maxSidebarWidth: number | string
}

const Minicart: FC<Props> = ({ type, maxSidebarWidth = 340 }) => {
  const {
    orderForm,
    loading,
  }: { loading: boolean; orderForm: OrderForm } = useOrderForm()
  const [isOpen, setIsOpen] = useState(false)
  const handles = useCssHandles(CSS_HANDLES)
  const { isMobile } = useDevice()

  if (loading) {
    return null
  }

  const itemQuantity = orderForm.items.length

  const isSideBarMode =
    (type && type === 'sidebar') ||
    isMobile ||
    (window && window.innerWidth <= 480)

  const MinicartIconButton = (
    <ButtonWithIcon
      icon={
        <span className={`${handles.minicartIconContainer} relative`}>
          <IconCart />
          {itemQuantity > 0 && (
            <span
              data-testid="item-qty"
              style={{
                top: '-0.7rem',
                right: '-0.8rem',
              }}
              className={`${handles.minicartQuantityBadge} c-on-emphasis absolute t-mini bg-emphasis br4 w1 h1 pa1 flex justify-center items-center lh-solid`}
            >
              {itemQuantity}
            </span>
          )}
        </span>
      }
      variation="tertiary"
      onClick={() => setIsOpen(!isOpen)}
    />
  )

  return (
    <aside
      className={`${handles.minicartWrapperContainer} relative fr flex items-center`}
    >
      <div className={`${handles.minicartContainer} flex flex-column`}>
        {isSideBarMode ? (
          <Drawer
            maxWidth={maxSidebarWidth}
            slideDirection="rightToLeft"
            customIcon={MinicartIconButton}
          >
            <div
              className={`${handles.minicartSideBarContentWrapper} ph4`}
              style={{ maxHeight: '100vh' }}
            >
              <Content />
            </div>
          </Drawer>
        ) : (
          <Fragment>
            {MinicartIconButton}
            {isOpen && (
              <Popup onOutsideClick={() => setIsOpen(!isOpen)}>
                <Content />
              </Popup>
            )}
          </Fragment>
        )}
      </div>
    </aside>
  )
}

export default Minicart
