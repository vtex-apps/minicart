import React, { FC } from 'react'
import { useCssHandles } from 'vtex.css-handles'

import { useMinicartState } from './MinicartContext'

const CSS_HANDLES = ['minicartFooter'] as const

const StickyFooter: FC = ({ children }) => {
  const handles = useCssHandles(CSS_HANDLES)
  const { variation } = useMinicartState()
  const minicartFooterClasses = `${handles.minicartFooter} ${
    variation === 'drawer' ? 'pa4' : 'pv3'
  } sticky`

  return <div className={minicartFooterClasses}>{children}</div>
}

export default StickyFooter
