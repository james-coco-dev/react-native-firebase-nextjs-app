import React from 'react'
import {
  View,
  Image
} from 'react-native'
import styled from 'styled-components/native'

const Container = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 2000;
`

const Loading = props => {
  if (!props.loading) return null
  return (
    <Container
      onPress={e => e.stopPropagation()}>
      <Image
        alt='loading spinner'
        source={require('../../static/loading-spinner.gif')} />
    </Container>
  )
}

Loading.defaultProps = {
  loading: false
}

export default Loading
