import React, { Component } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

import { initialize, requestPermission, readRecords } from 'react-native-health-connect';

function getMidnightAsString(): string {
  // Get the current date
  const currentDate = new Date();

  // Set the start time to today at 00:00:00
  const start_time = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(), // Day of the month
    0, // Hours (midnight)
    0, // Minutes
    0, // Seconds
    0 // Milliseconds
  );
  return start_time.toISOString();
}

interface HealthConnectCompState {
    result: string;
    err_log: string;
  }

  class HealthConnectComp extends Component<{}, HealthConnectCompState> {
  constructor(props) {
    super(props);

    this.state = {
      result: "readSampleData not called",
      err_log: "err_log not set",
    };
  }

  componentDidMount() {
    // Call readSampleData when the component mounts
    this.readSampleData();
  }

  async readSampleData() {
    try {
      this.setErrLog("before initialization + ");

      // initialize the client
      const isInitialized = await initialize();

      if (isInitialized) {
        this.setErrLog(prevErr => prevErr + "initialization worked + ");
      } else {
        this.setErrLog(prevErr => prevErr + "initialization didn't work + ");
      }

      // request permissions
      const grantedPermissions = await requestPermission([
        { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
      ]);

      if (grantedPermissions.length === 0) {
        this.setErrLog(prevErr => prevErr + "no permission granted + ");
      } else {
        this.setErrLog(prevErr => prevErr + "permission granted + ");
      }

      const start_time = getMidnightAsString();
      const end_time = new Date().toISOString();

      // check if granted
      const data = await readRecords('ActiveCaloriesBurned', {
        timeRangeFilter: {
          operator: 'between',
          startTime: start_time,
          endTime: end_time,
        },
      });
      // Set the result in the state
      this.setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      this.setResult("no data received");
      this.setErrLog(prevErr => prevErr + " " + error);
    }
  }

  setErrLog = (log) => {
    this.setState({ err_log: log });
  };

  setResult = (result) => {
    this.setState({ result });
  };

  render() {
    return (
      <View style={styles.container}>
        <Pressable style={styles.button} onPress={this.readSampleData}>
          <Text style={styles.white_text}>Read Sample Data</Text>
        </Pressable>

        {this.state.result && (
          <Text style={{ marginTop: 10 }}>
            Result:
            {this.state.result}
          </Text>
        )}
        {this.state.err_log && (
          <Text style={{ marginTop: 10 }}>
            Error Log:
            {this.state.err_log}
          </Text>
        )}
      </View>
    );
  }
}

export default HealthConnectComp;

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
