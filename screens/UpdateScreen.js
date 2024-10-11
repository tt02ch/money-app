import { StatusBar } from "expo-status-bar";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  Image,
} from "react-native";
import { Text, Button } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import format from "date-fns/format";
import parse from "date-fns/parse";
import { Picker } from "@react-native-picker/picker";
import { db } from "../firebase"; // Ensure your firebase.js exports 'db' correctly
import { doc, onSnapshot, updateDoc } from "firebase/firestore"; // Import necessary Firestore v9 functions

const UpdateScreen = ({ route, navigation }) => {
  const { itemId } = route.params;
  const [input, setInput] = useState("");
  const [amount, setAmount] = useState("");
  const [selDate, setSelDate] = useState(new Date());
  const [selectedLanguage, setSelectedLanguage] = useState("expense");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Sửa chi tiêu" });
  }, [navigation]);

  useEffect(() => {
    const expenseDoc = doc(db, "expense", itemId);
    const unsubscribe = onSnapshot(expenseDoc, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setInput(data.text);
        setAmount(data.price);
        setSelDate(parse(data.userDate, "dd/MM/yyyy", new Date()));
        setSelectedLanguage(data.type);
      }
    });

    return () => unsubscribe();
  }, [itemId]);

  const updateExpense = async () => {
    if (input && amount && selDate && selectedLanguage) {
      setSubmitLoading(true);
      const expenseDoc = doc(db, "expense", itemId);

      try {
        await updateDoc(expenseDoc, {
          text: input,
          price: amount,
          date: selDate,
          type: selectedLanguage,
          timestamp: new Date(), // Replace with serverTimestamp() if needed
          userDate: format(selDate, "dd/MM/yyyy"),
        });
        clearInputFields();
      } catch (error) {
        alert(error.message);
        setSubmitLoading(false);
      }
    } else {
      alert("All fields are mandatory");
      setSubmitLoading(false);
    }
  };

  const clearInputFields = () => {
    alert("Updated Successfully");
    setInput("");
    setAmount("");
    setSelDate(new Date());
    setSelectedLanguage("expense");
    navigation.goBack();
    setSubmitLoading(false);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || selDate;
    setShow(Platform.OS === "ios");
    setSelDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const result = format(selDate, "dd/MM/yyyy");

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.inputContainer}>
        <Image
          source={{
            uri: "https://static-s.aa-cdn.net/img/gp/20600011886807/to-aGJ31KLwqc9AWaBUyL6NLbpFwN9VEliX7nQ_AU48aO4jH6M1MltWKmThWJPndJg=s300?v=1",
          }} // Replace with your icon URL
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Add Text"
          value={input}
          onChangeText={setInput}
        />

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={selDate}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}

        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Add Amount"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={styles.input} onPress={showDatepicker}>
          {result}
        </Text>

        <Picker
          selectedValue={selectedLanguage}
          onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
        >
          <Picker.Item label="Expense" value="expense" />
          <Picker.Item label="Income" value="income" />
        </Picker>

        <Button
          containerStyle={styles.button}
          title="Update"
          onPress={updateExpense}
          loading={submitLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default UpdateScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  inputContainer: {
    width: 300,
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  button: {
    width: 300,
    marginTop: 10,
  },
});
