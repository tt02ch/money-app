import { StatusBar } from 'expo-status-bar';
import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, TextInput, Platform, Image } from 'react-native';
import { Text, Button } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import format from 'date-fns/format';
import { Picker } from '@react-native-picker/picker';
import { db, auth } from '../firebase'; // Ensure the path to your firebase config is correct
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'; // Import Firestore functions

const AddScreen = ({ navigation }) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [input, setInput] = useState('');
  const [amount, setAmount] = useState('');
  const [selDate, setSelDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');
  const [selectedLanguage, setSelectedLanguage] = useState('expense');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Thêm chi tiêu',
    });
  }, [navigation]);

  const createExpense = async () => {
    // Validate input fields
    if (input.trim() && amount.trim() && auth.currentUser) {
      setSubmitLoading(true);
      const expenseData = {
        email: auth.currentUser.email,
        text: input,
        price: parseFloat(amount), // Ensure amount is a number
        date: selDate,
        type: selectedLanguage,
        timestamp: serverTimestamp(), // Use Firestore's server timestamp
        userDate: format(selDate, 'dd/MM/yyyy'), // Store formatted date
      };

      try {
        // Add expense to Firestore
        await addDoc(collection(db, 'expense'), expenseData);
        clearInputFields();
      } catch (error) {
        alert(error.message);
        setSubmitLoading(false);
      }
    } else {
      alert('All fields are mandatory');
      setSubmitLoading(false);
    }
  };

  const clearInputFields = () => {
    alert('Created Successfully');
    setInput('');
    setAmount('');
    setSelDate(new Date());
    setSelectedLanguage('expense');
    navigation.navigate('Home');
    setSubmitLoading(false);
  };

  const onChange = (event, selectedDate) => {
    if (event.type === 'set') { // Check if date is set
      setSelDate(selectedDate || selDate);
    }
    setShow(Platform.OS === 'ios');
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const formattedDate = format(selDate, 'dd/MM/yyyy');

  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar style='dark' />
      <View style={styles.inputContainer}>
        <Image 
          source={{ uri: 'https://static-s.aa-cdn.net/img/gp/20600011886807/to-aGJ31KLwqc9AWaBUyL6NLbpFwN9VEliX7nQ_AU48aO4jH6M1MltWKmThWJPndJg=s300?v=1' }} // Replace with your icon URL
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder='Nhập nội dung thu chi'
          value={input}
          onChangeText={(text) => setInput(text)}
        />

        {show && (
          <DateTimePicker
            testID='dateTimePicker'
            value={selDate}
            mode={mode}
            is24Hour={true}
            display='default'
            onChange={onChange}
          />
        )}

        <TextInput
          style={styles.input}
          keyboardType='numeric'
          placeholder='Nhập số tiền'
          value={amount}
          onChangeText={(text) => setAmount(text)}
        />

        <Text style={styles.dateText} onPress={showDatepicker}>
          {formattedDate}
        </Text>

        <Picker
          selectedValue={selectedLanguage}
          onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
        >
          <Picker.Item label='Chi tiền' value='expense' />
          <Picker.Item label='Tiền về' value='income' />
        </Picker>

        <Button
          containerStyle={styles.button}
          title='Add'
          onPress={createExpense}
          loading={submitLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  inputContainer: {
    width: 300,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  dateText: {
    height: 50,
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 10,
    textAlign: 'center',
    color: 'gray', // To indicate it's not an editable field
  },
  button: {
    width: 300,
    marginTop: 10,
  },
  icon: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
});
