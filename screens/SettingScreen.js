// SettingsScreen.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity,Alert } from 'react-native';
import ThemeContext from '../context/ThemeContext'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../color';

const SettingScreen = () => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext); 

  const sendFeedback = () => {
    const email = 'mealsapp@email.com'; 
    const subject = 'Góp ý về ứng dụng'; 
    const body = 'Xin chào, tôi có góp ý sau về ứng dụng...'; 

    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.openURL(mailtoUrl).catch(err => console.error('Error opening email app:', err));
  };

  const confirmSendFeedback = () => {
    Alert.alert(
      "Góp ý",
      "Bạn có muốn gửi góp ý qua email không?",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: sendFeedback
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      {/* <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>
        Application Settings
      </Text> */}
      <View style={styles.settingRow}>
        <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>Dark Mode</Text>
        <Switch onValueChange={toggleDarkMode} value={isDarkMode} />
      </View>
      <TouchableOpacity onPress={confirmSendFeedback} style={styles.feedbackButton}>
        <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>
          Góp ý
        </Text>
      </TouchableOpacity>
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
  feedbackButton: {
    paddingVertical: 15,
    paddingHorizontal:16,
  },
});

export default SettingScreen;