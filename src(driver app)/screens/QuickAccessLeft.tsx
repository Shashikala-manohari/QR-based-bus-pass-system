import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const QuickAccessLeft = () => {
  return (
    <View style={{
        height: 80,
        width:'90%',
        top: -40,
        backgroundColor: 'rgba(255,255,255,1)',
        borderTopRightRadius:80
      }}>
      <Text>QuickAccess</Text>
    </View>
  )
}

export default QuickAccessLeft

const styles = StyleSheet.create({})