import React from 'react'
export const withRuntimeContext = Comp => {
  return class extends React.Component {
    runtime = { account: 'Account' }

    render() {
      return <Comp runtime={this.runtime} />
    }
  }
}
