# Incremental walking game

Incremental game where walking progresse the game, rather than clicking or waiting for time to pass. Made in React Native, supported by Health Connect rather than Google Fit, so it either requires a phone with Android 14, or installing the [Health Connect app](https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata&hl=en&gl=US).

## Requirements

To run this game, you'll need the following dependencies:

- [React Native Health Connect](https://github.com/matinzd/react-native-health-connect)
- expo-build-properties

## Health Connect Permissions

The game gets data on the number of steps made by the player from Health Connect. In the app there are two permission options:
1. Grant permissions to Google Fit: With this option, the game works as expected, and the data is up to date.
2. Grant only step data permissions: Choosing this option may result in less up-to-date data, usually delayed by a couple of days.


[Link to an unsigned APK](https://drive.google.com/file/d/1DEnhvZJl1aSD7N0dokGB3Dbcthdi3MTV/view?usp=sharing)
