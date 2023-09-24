
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button} from 'react-native';

import { initialize, requestPermission, readRecords} from 'react-native-health-connect';

export default function App() {
  const [result, setResult] = useState("readSampleData not called");
  const [err_log, setErrLog] = useState("err_log not set");

  const readSampleData = async () => {
    try {
      setErrLog("before initilization + ");

      // initialize the client
      const isInitialized = await initialize();

      if(isInitialized){        
        setErrLog(prv_err => prv_err + "initilization worked + ");
      }
      else{        
        setErrLog(prv_err => prv_err + "initilization didn't work + ");
      }
    
      // request permissions
      const grantedPermissions = await requestPermission([
        { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
      ]);

      if(grantedPermissions.length===0){
        setErrLog(prv_err => prv_err + "no permission granted + ");
      }      
      else{
        setErrLog(prv_err => prv_err + "permission granted + ");
      }

    
      // check if granted  
      const result = await readRecords('ActiveCaloriesBurned', {
        timeRangeFilter: {
          operator: 'between',
          startTime: '2023-01-09T12:00:00.405Z',
          endTime: '2023-01-09T23:53:15.405Z',
        },
      });
      // Set the result in the state
      setResult(JSON.stringify(result, null, 2));      
    }
    catch (error) {
      setResult("no data received");
      setErrLog(prv_err => prv_err + " " + error);
    }
  };  


  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Text>Test</Text>
      <Button title="Read Sample Data" onPress={readSampleData} />
      {result && (
        <Text style={{ marginTop: 10 }}>
          Result:
          {result}
        </Text>
      )}      
      {err_log && (
        <Text style={{ marginTop: 10 }}>
          error log:
          {err_log}
        </Text>
      )}      
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
});


