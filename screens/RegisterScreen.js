import { StatusBar } from "expo-status-bar";
import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Modal } from "react-native";
import { Input, Button, Text, Image, Icon } from "react-native-elements";
import { auth, db } from "../firebase"; // Import Firestore instance
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

// Hàm kiểm tra định dạng email
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Back to Login",
    });
  }, [navigation]);

  const signUp = async () => {
    if (fullName && email && password) {
      if (!isValidEmail(email)) {
        setModalMessage("Vui lòng nhập địa chỉ email hợp lệ.");
        setModalVisible(true);
        return;
      }
      if (password.length < 6) {
        setModalMessage("Mật khẩu phải ít nhất 6 ký tự.");
        setModalVisible(true);
        return;
      }
      
      setSubmitLoading(true); // Bắt đầu trạng thái tải
      
      try {
        // Đăng ký người dùng mới
        const authUser = await createUserWithEmailAndPassword(auth, email, password);
        
        // Lưu thông tin người dùng vào Firestore với UID làm document ID
        await setDoc(doc(db, "users", authUser.user.uid), {
          fullName: fullName,
          email: email,
          imageUrl: imageUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVe0cFaZ9e5Hm9X-tdWRLSvoZqg2bjemBABA&usqp=CAU",
        });
  
        setModalMessage("Đăng ký thành công!"); // Thông báo thành công
        setModalVisible(true);
        
      } catch (error) {
        // Xử lý lỗi trong quá trình đăng ký hoặc lưu thông tin
        setModalMessage(`Đăng ký thất bại: ${error.message}`);
        setModalVisible(true);
      } finally {
        // Tắt trạng thái tải
        setSubmitLoading(false);
      }
    } else {
      setModalMessage("Vui lòng điền đầy đủ thông tin.");
      setModalVisible(true);
    }
  };

  const clearInputFields = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setImageUrl("");
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={{
          uri: "https://static-s.aa-cdn.net/img/gp/20600011886807/to-aGJ31KLwqc9AWaBUyL6NLbpFwN9VEliX7nQ_AU48aO4jH6M1MltWKmThWJPndJg=s300?v=1",
        }}
        style={{ width: 100, height: 100, marginBottom: 50 }}
      />
      <View style={styles.inputContainer}>
        <Input
          placeholder="Họ và tên"
          value={fullName}
          onChangeText={(text) => setFullName(text)}
          autoCapitalize="words"
          leftIcon={
            <Icon name="user" type="font-awesome" size={24} color="gray" />
          }
          inputContainerStyle={{ marginLeft: 10 }} // Khoảng cách giữa icon và placeholder
          inputStyle={{ paddingLeft: 10 }} // Khoảng cách giữa text và icon
        />
        <Input
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
          leftIcon={
            <Icon name="envelope" type="font-awesome" size={24} color="gray" />
          }
          inputContainerStyle={{ marginLeft: 10 }}
          inputStyle={{ paddingLeft: 10 }}
        />
        <Input
          placeholder="Mật khẩu"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          leftIcon={
            <Icon name="lock" type="font-awesome" size={24} color="gray" />
          }
          inputContainerStyle={{ marginLeft: 10 }}
          inputStyle={{ paddingLeft: 10 }}
        />
        <Input
          placeholder="Ảnh đại diện (URL)"
          value={imageUrl}
          onChangeText={(text) => setImageUrl(text)}
          onSubmitEditing={signUp}
          autoCapitalize="none"
          onFocus={() => setImageUrl("")}
          leftIcon={
            <Icon name="image" type="font-awesome" size={24} color="gray" />
          }
          inputContainerStyle={{ marginLeft: 10 }}
          inputStyle={{ paddingLeft: 10 }}
        />
      </View>
      <Button
        containerStyle={styles.button}
        title="Đăng Ký"
        loading={submitLoading}
        onPress={signUp}
      />
      <Button
        onPress={() => navigation.navigate("Login")}
        containerStyle={styles.button}
        title="Đã có tài khoản? Đăng nhập"
        type="outline"
      />

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <Button
              title="Đóng"
              onPress={() => {
                setModalVisible(false);
                if (modalMessage !== "Đăng ký thành công!") {
                  clearInputFields(); // Chỉ xóa dữ liệu nếu có lỗi
                }
              }}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
  },
  inputContainer: {
    width: 300,
  },
  button: {
    width: 300,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
