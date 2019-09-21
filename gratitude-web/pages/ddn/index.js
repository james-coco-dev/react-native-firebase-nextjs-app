import React from 'react'

// eslint-disable-next-line
import ddn from 'raw-loader!./ddn.html'

class DDN extends React.Component {
  render () {
    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: ddn }} />
      </>
    )
  }
}

export default DDN
