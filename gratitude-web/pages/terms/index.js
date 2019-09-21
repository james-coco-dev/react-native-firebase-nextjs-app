import React from 'react'

// eslint-disable-next-line
import terms from 'raw-loader!./terms.html'

class Terms extends React.Component {
  render () {
    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: terms }} />
      </>
    )
  }
}

export default Terms
