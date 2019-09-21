import React from 'react'
import {
  View,
  Text,
  Modal,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from 'react-native'

import Context from '../../lib/context'
import { db } from '../../lib/firebase'
import colors from '../../lib/colors'

import {
  Input
} from '../../components'

const styles = StyleSheet.create({
  modalContent: {
    borderTopWidth: 1,
    borderTopColor: '#727272',
    paddingTop: 60
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE'
  },
  headerItem: {
    flexDirection: 'row'
  },
  content: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 50
  },
  title: {
    fontSize: 32,
    color: colors.text,
    paddingBottom: 30
  },
  placeholder: {

  }
})

class WriteAnswerModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text: '',
      title: props.data.title
    }
  }

  componentDidUpdate = (prevProps) => {
    // if the component receives a new title prop, update state
    if (this.props.data.title !== prevProps.data.title) {
      this.setState({ title: this.props.data.title })
    }
  }

  handleSubmit = async (state, store) => {
    if (state.text.length > 4) {
      try {
        await db.collection('users').doc(store.currentUser.uid).collection('dreams').add({
          title: state.title,
          text: state.text
        })
        await this.props.close()
        await this.props.navigation.navigate('OnboardingSuccess')
      } catch (err) {
        console.error(err)
      }
    } else {
      window.alert('Your dream must be at least 5 characters long.')
    }
  }

  render () {
    return (
      <Context.Consumer>
        {store => {
          return (
            <Modal
              onDismiss={() => this.setState({ text: '' })}
              animationType='slide'
              visible={this.props.isOpen}>
              <View style={styles.modalContent}>
                <View style={styles.headerRow}>
                  <TouchableOpacity onPress={this.props.close}>
                    <View style={{ ...styles.headerItem, paddingLeft: 15 }}>
                      <Text>Close</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={{ ...styles.headerItem, width: '33%' }}>
                    <Text style={{ fontSize: 18 }}>Write Answer</Text>
                  </View>
                  <TouchableOpacity onPress={() => this.handleSubmit(this.state, store)}>
                    <View style={{ ...styles.headerItem, paddingRight: 15 }}>
                      <Text>Save</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.content}>
                  <TextInput style={styles.title} value={this.state.title} onChangeText={v => this.setState({ title: v })} />
                  <Input value={this.state.text} placeholder={this.props.data.placeholder} onChangeText={v => this.setState({ text: v })} />
                </View>
              </View>
            </Modal>
          )
        }}
      </Context.Consumer>

    )
  }
}

export default WriteAnswerModal
