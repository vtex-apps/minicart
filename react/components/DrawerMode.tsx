import React, { FC } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Drawer } from 'vtex.store-drawer'

import MinicartIconButton from './MinicartIconButton'

const DRAWER_CLOSE_ICON_HEIGHT = 58
const CSS_HANLDES = ['minicartSideBarContentWrapper']

interface Props {
  maxDrawerWidth: number | string
  drawerSlideDirection:
    | 'horizontal'
    | 'vertical'
    | 'rightToLeft'
    | 'leftToRight'
}

const DrawerMode: FC<Props> = ({
  maxDrawerWidth,
  drawerSlideDirection,
  children,
}) => {
  const handles = useCssHandles(CSS_HANLDES)

  return (
    <Drawer
      maxWidth={maxDrawerWidth}
      slideDirection={drawerSlideDirection}
      customIcon={<MinicartIconButton />}
    >
      <div
        className={`${handles.minicartSideBarContentWrapper} w-100 h-100 ph4`}
        style={{
          height: window.innerHeight - DRAWER_CLOSE_ICON_HEIGHT,
        }}
      >
        {children}
      </div>
    </Drawer>
  )
}

export default DrawerMode
