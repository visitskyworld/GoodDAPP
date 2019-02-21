// @flow
import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import TabsView from '../appNavigation/TabsView'
import { AccountConsumer } from '../appNavigation/AccountProvider'
import { normalize } from 'react-native-elements'
import { createStackNavigator, PushButton } from '../appNavigation/stackNavigation'

import Claim from './Claim'
import FaceRecognition from './FaceRecognition'
import Receive from './Receive'
import Send from './Send'
import SendConfirmation from './SendConfirmation'

import { Wrapper, Section, Avatar, BigNumber } from '../common'

export type DashboardProps = {
  screenProps: any,
  navigation: any
}

class Dashboard extends Component<DashboardProps, {}> {
  static navigationOptions = {
    navigationBarHidden: true
  }

  render() {
    const { screenProps, navigation }: DashboardProps = this.props

    return (
      <AccountConsumer>
        {({ balance, entitlement }) => (
          <View>
            <TabsView goTo={navigation.navigate} routes={screenProps.routes} />
            <Wrapper>
              <Section>
                <Section.Row style={styles.centered}>
                  <Avatar size={80} />
                </Section.Row>
                <Section.Row style={styles.centered}>
                  <Section.Title>John Doe</Section.Title>
                </Section.Row>
                <Section.Row style={styles.centered}>
                  <BigNumber number={balance} unit="GD" />
                </Section.Row>
                <Section.Row style={styles.buttonRow}>
                  <PushButton routeName={'Send'} screenProps={screenProps} style={styles.leftButton}>
                    Send
                  </PushButton>
                  <PushButton routeName={'Claim'} screenProps={screenProps}>
                    <Text style={[styles.buttonText]}>Claim</Text>
                    <br />
                    <Text style={[styles.buttonText, styles.grayedOutText]}>{entitlement}GD</Text>
                  </PushButton>
                  <PushButton routeName={'Receive'} screenProps={screenProps} style={styles.rightButton}>
                    Receive
                  </PushButton>
                </Section.Row>
              </Section>
            </Wrapper>
          </View>
        )}
      </AccountConsumer>
    )
  }
}

const styles = StyleSheet.create({
  buttonText: {
    fontFamily: 'Helvetica, "sans-serif"',
    fontSize: normalize(16),
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  buttonRow: {
    alignItems: 'stretch',
    marginTop: normalize(10)
  },
  grayedOutText: {
    color: '#d5d5d5',
    fontSize: normalize(10)
  },
  leftButton: {
    flex: 1,
    marginRight: normalize(10)
  },
  rightButton: {
    flex: 1,
    marginLeft: normalize(10)
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'baseline'
  }
})

export default createStackNavigator({
  Dashboard,
  Claim,
  Receive,
  Send,
  SendConfirmation,
  FaceRecognition
})
