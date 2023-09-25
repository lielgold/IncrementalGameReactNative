
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

import { initialize, requestPermission, readRecords} from 'react-native-health-connect';
import AsyncStorage from '@react-native-async-storage/async-storage';


function getMidnightDate():Date{
  // Get the current date
  const currentDate = new Date();

  // Set the start time to today at 00:00:00
  const start_time = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(), // Day of the month
    0, // Hours (midnight)
    0, // Minutes
    1, // Seconds
    0 // Milliseconds
  );
  return start_time;
}

export default function HealthConnectComp() {
  const [result, setResult] = useState("readSampleData not called");
  const [err_log, setErrLog] = useState("err_log not set");
  const [lastUpdate, setLastUpdate] = useState(new Date(1970, 0, 1));

  const saveStateData = async () => {
    try {
      await AsyncStorage.setItem('lastUpdate', JSON.stringify(lastUpdate));
    } catch (error) {
      console.error('Error saving game data:', error);
    }
  };  

  const loadStateData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('lastUpdate');
      if (savedData) {
        const parsedData = new Date(JSON.parse(savedData));
        if (!isNaN(parsedData.getTime())) {
          // Check if parsedData is a valid Date object
          setLastUpdate(parsedData);
        } else {
          console.error('Invalid date format in LastUpdate saved data.');
        }
      }
    } catch (error) {
      console.error('Error loading state data:', error);
    }
  };  

  useEffect(() => {
    loadStateData();
  }, []);  

  const readSampleData = async () => {
    try {
      setErrLog("before initilization + ");      

      var start_time_date = getMidnightDate();

      //get time from latest update, or from midnight
      // if (lastUpdate>start_time_date){
      //   start_time_date = lastUpdate;
      // }
      
      const start_time = start_time_date.toISOString();
      const end_time = new Date().toISOString();

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
        //{ accessType: 'read', recordType: 'ActiveCaloriesBurned' },
        { accessType: 'read', recordType: 'Steps' },
      ]);

      if(grantedPermissions.length===0){
        setErrLog(prv_err => prv_err + "no permission granted + ");
      }      
      else{
        setErrLog(prv_err => prv_err + "permission granted + ");
      }
    
      // check if granted        
      //const result = await readRecords('ActiveCaloriesBurned', {
      const result = await readRecords('Steps', {
        timeRangeFilter: {
          operator: 'between',
          startTime: start_time,
          endTime: end_time,
        },
      });
      // Set the result in the state
      setResult(JSON.stringify(result, null, 2));  
      await saveStateData();    
    }
    catch (error) {
      setResult("no data received");
      setErrLog(prv_err => prv_err + " " + error);
    }
  };  


  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={readSampleData}>
        <Text style={styles.white_text}>Read Sample Data</Text>
      </Pressable>      

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

      <Text style={{ marginTop: 10 }}>Last Update: {lastUpdate.toTimeString()}</Text>
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


