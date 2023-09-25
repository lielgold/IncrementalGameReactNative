
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import IncrementalGame from './components/IncrementalGame';

export default function App() {
  return (
    <View style={styles.container}>  
        <Text>Open up App.tsx to start working on your app!</Text>
        <Text>Test</Text>
        {/* <HealthConnectComp/> */}
        <IncrementalGame/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'blue',
  },
  white_text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },  
});


