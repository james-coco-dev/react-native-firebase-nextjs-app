import React from 'react'

// eslint-disable-next-line
import brands from 'raw-loader!./brands.html'

class Brands extends React.Component {
  render () {
    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: brands }} />
      </>
    )
  }
}

export default Brands
