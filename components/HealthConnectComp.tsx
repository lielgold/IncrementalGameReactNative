
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import {Picker} from '@react-native-picker/picker';

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

export default function HealthConnectComp({ addGoldFunction }) {
  const [result, setResult] = useState("readSampleData not called");
  const [err_log, setErrLog] = useState("err_log not set");
  const [lastUpdate, setLastUpdate] = useState(new Date(1970, 0, 1));
  const [stepSum, setStepSum] = useState(0);  
  const [selectedDaysNumber, setSelectedDaysNumber] = useState(0); // the step count will be in the time interval of date.now() - selectedDaysNumber 


  const saveStateData = async () => {
    try {
      await AsyncStorage.setItem('lastUpdate', JSON.stringify(lastUpdate));
      await AsyncStorage.setItem('stepSum', JSON.stringify(stepSum));
    } catch (error) {
      console.error('Error saving game data:', error);
    }
  }; 

  
  useEffect(() => {
    const loadStateData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('lastUpdate');
        if (savedData) {
          const parsedDate = new Date(JSON.parse(savedData));
          if (!isNaN(parsedDate.getTime())) {
            // Check if parsedData is a valid Date object
            setLastUpdate(parsedDate);
          } else {
            console.error('Invalid date format in LastUpdate saved data.');
          }

          const savedStepSum = await AsyncStorage.getItem('stepSum');
          if (savedStepSum !== null) {
            // Parse the savedStepSum to a number
            const parsedStepSum = JSON.parse(savedStepSum);
            setStepSum(parsedStepSum);
          }
          else{
            console.error('Problem loading stepSum.');            
          }        
        }
      } catch (error) {
        console.error('Error loading state data:', error);
      }
    };  

    loadStateData();
  }, []);  

  const readSampleData = async () => {
    try {
      setErrLog("before initilization + ");  

      var start_time_date = getMidnightDate();

      // this needs to be uncommented for updates to work properly in terms of the game
      //get time from latest update, or from midnight
      // if (lastUpdate>start_time_date){
      //   start_time_date = lastUpdate;
      // }      
      
      start_time_date.setDate(start_time_date.getDate() - selectedDaysNumber);      

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

      // sum the steps in the results
      var sum_steps = 0;
      for (var i = 0; i < result.length; i++) {
        sum_steps += result[i].count;
      }
            
      // Set the result in the state
      setResult(JSON.stringify(result, null, 2));  
      setStepSum(prevStepSum => prevStepSum + sum_steps);      
      
      addGoldFunction(sum_steps);
      setLastUpdate(new Date());

      await saveStateData();          
    }
    catch (error) {
      setResult("no data received");
      setErrLog(prv_err => prv_err + " " + error);
    }
  };  

  

  return (
    <View >
      <Pressable style={styles.button} onPress={readSampleData}>
        <Text style={styles.white_text}>Update Step Count</Text>
      </Pressable>      

      <Text>How many days back to include in the count:</Text>
      <Picker 
        selectedValue={selectedDaysNumber}
        onValueChange={(itemValue, itemIndex) => {
          console.log(itemValue);
          setSelectedDaysNumber(itemValue);          
        }
          
        }>
        {Array.from({ length: 15 }, (_, index) => (
          <Picker.Item label={index.toString()} value={index} key={index} />
        ))}
      </Picker>      

      <Text>Total Steps: {stepSum.toString()}</Text>
      <Text>Last Update: {lastUpdate.toTimeString()}</Text>      

      <Text>error log: {err_log}</Text>

      {/* Result needs to be commented out */}
      <Text>Result: {result}</Text>
      
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