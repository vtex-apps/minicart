import React, { FC } from 'react'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['minicartEmptyStateContainer'] as const

const EmptyState: FC = ({ children }) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div
      className={`${handles.minicartEmptyStateContainer} h-100 flex flex-column justify-center`}
    >
      {children}
    </div>
  )
}

export default EmptyState
