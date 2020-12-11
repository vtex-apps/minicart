import React, { FC } from 'react'
import { useCssHandles, CssHandlesTypes } from 'vtex.css-handles'

const CSS_HANDLES = ['minicartEmptyStateContainer'] as const

interface Props {
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>
}

const EmptyState: FC<Props> = ({ classes, children }) => {
  const { handles } = useCssHandles(CSS_HANDLES, { classes })

  return (
    <div
      className={`${handles.minicartEmptyStateContainer} h-100 flex flex-column justify-center`}
    >
      {children}
    </div>
  )
}

export default EmptyState
