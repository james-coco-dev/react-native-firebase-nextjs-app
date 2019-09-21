import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native'
import Carousel from 'react-native-snap-carousel'

import colors from '../../lib/colors'

import {
  Button,
  WriteAnswerModal
} from '../../components'

const Elevation = {
  1: {
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 2,
      height: 2
    },
    shadowRadius: 3
  }
}

const { width } = Dimensions.get('screen')

const styles = StyleSheet.create({
  slide: {
    backgroundColor: 'white',
    flex: 1,
    width: (width - 100),
    ...Elevation[1],
    borderRadius: 20,
    padding: 20,
    marginBottom: 10
  },
  title: {
    fontSize: 32,
    color: colors.text,
    paddingTop: 100,
    fontWeight: '600'
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  placeholder: {
    color: '#999999'
  }
})

const data = [
  {
    title: 'This year I want to',
    placeholder: 'Sell 10 of my paintings on Etsy'
  },
  {
    title: 'This year I want to',
    placeholder: 'Sell 10 of my paintings on Etsy'
  },
  {
    title: 'This year I want to',
    placeholder: 'Sell 10 of my paintings on Etsy'
  },
  {
    title: 'This year I want to',
    placeholder: 'Sell 10 of my paintings on Etsy'
  },
  {
    title: 'This year I want to',
    placeholder: 'Sell 10 of my paintings on Etsy'
  },
  {
    title: 'This year I want to',
    placeholder: 'Sell 10 of my paintings on Etsy'
  },
  {
    title: 'This year I want to',
    placeholder: 'Sell 10 of my paintings on Etsy'
  }
]

class MyCarousel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: false,
      data: {}
    }
  }

  _renderItem = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        <Text style={styles.title}>{ item.title }</Text>
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholder}>{ item.placeholder }</Text>
        </View>
        <Button title='Answer' onPress={() => this.setState({
          isOpen: true,
          data: item
        })} />
      </View>
    )
  }

  render () {
    return (
      <>
        <WriteAnswerModal close={() => this.setState({ isOpen: false })} isOpen={this.state.isOpen} data={this.state.data} {...this.props} />
        <Carousel
          ref={(c) => { this._carousel = c }}
          data={data}
          removeClippedSubviews={false}
          loop
          renderItem={this._renderItem}
          sliderWidth={width}
          itemWidth={(width - 100)}
        />
      </>
    )
  }
}

export default MyCarousel
