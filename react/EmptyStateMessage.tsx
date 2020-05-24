import React, { FC, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import EmptyStateIcon from './components/EmptyStateIcon'

const EmptyStateMessage: FC = () => {
  return (
    <Fragment>
      <div className="tc pv8">
        <EmptyStateIcon />
      </div>
      <div className="c-muted-2 pv9 tc">
        <p>
          <FormattedMessage id="store/minicart.empty-state" />
        </p>
      </div>
    </Fragment>
  )
}

export default EmptyStateMessage
