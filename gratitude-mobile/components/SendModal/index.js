import React from 'react'
import {
  View,
  StyleSheet,
  Modal,
  Text
} from 'react-native'

const styles = StyleSheet.create({
  modalContent: {
    borderTopWidth: 1,
    borderTopColor: '#727272',
    paddingTop: 60
  }
})

class SendModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }
  render () {
    return (
      <Modal
        onDismiss={() => this.setState({ text: '' })}
        animationType='slide'
        visible={this.props.isOpen}>
        <View style={styles.container}>
          <Text>Foobar</Text>
        </View>
      </Modal>
    )
  }
}

export default SendModal
