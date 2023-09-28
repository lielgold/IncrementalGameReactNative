
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import IncrementalGame from './components/IncrementalGame';

export default function App() {
  return (
    <View style={styles.container}>  
        <Text style={{marginBottom: 10}}>Walk to get gold.</Text>        
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


