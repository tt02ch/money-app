// SettingsScreen.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import ThemeContext from '../context/ThemeContext'; // Import the ThemeContext
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../color';

const SettingScreen = () => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext); // Use global theme context

  return (
    <SafeAreaView style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      {/* <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>
        Application Settings
      </Text> */}
      <View style={styles.settingRow}>
        <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>Dark Mode</Text>
        <Switch onValueChange={toggleDarkMode} value={isDarkMode} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal:16
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lightContainer: {
    backgroundColor: Colors.lightbg
  },
  lightText: {
    color: '#000000',
  },
  darkContainer: {
    backgroundColor: Colors.darkbg
  },
  darkText: {
    color: '#ffffff',
  },
});

export default SettingScreen;