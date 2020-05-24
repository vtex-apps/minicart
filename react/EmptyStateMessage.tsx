import React, { FC, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import EmptyStateIcon from './components/EmptyStateIcon'

const CSS_HANDLES = ['emptyStateIconWrapper', 'emptyStateMessage'] as const

const EmptyStateMessage: FC = () => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <Fragment>
      <div className={`${handles.emptyStateIconWrapper} tc pv8`}>
        <EmptyStateIcon />
      </div>
      <p className={`${handles.emptyStateMessage} c-muted-1 pv9 tc`}>
        <FormattedMessage id="store/minicart.empty-state" />
      </p>
    </Fragment>
  )
}

export default EmptyStateMessage
