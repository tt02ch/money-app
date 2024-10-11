import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Modal } from 'react-native';
import { Input, Button, Image, Text, Icon } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { auth } from '../firebase'; 
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return regex.test(email);
  };

  const signIn = () => {
    if (!email || !password) {
      setModalMessage('Tất cả các trường đều bắt buộc.');
      setModalVisible(true);
      return;
    }
    
    if (!isValidEmail(email)) {
      setModalMessage('Vui lòng nhập địa chỉ email hợp lệ.');
      setModalVisible(true);
      return;
    }

    setSubmitLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        clearInputFields();
      })
      .catch((error) => {
        let errorMessage;
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = 'Không tìm thấy người dùng với email này.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Mật khẩu không chính xác. Vui lòng thử lại.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Định dạng email không hợp lệ.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ với bộ phận hỗ trợ.';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'Đăng nhập bằng email và mật khẩu chưa được kích hoạt.';
            break;
          default:
            errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại.';
        }
        setModalMessage(errorMessage);
        setModalVisible(true);
        setSubmitLoading(false);
      });
  };

  const clearInputFields = () => {
    setModalMessage('Đăng nhập thành công');
    setModalVisible(true);
    navigation.replace('Home');
    setEmail('');
    setPassword('');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // Người dùng đã đăng nhập
        console.log('User logged in:', authUser.email);
      }
      setLoading(false); // Cập nhật trạng thái loading
    });
    return unsubscribe;
  }, []);
  
  useLayoutEffect(() => {
    navigation.setOptions({
      title: loading ? 'Loading...' : 'Đăng Nhập',
    });
  }, [navigation, loading]);

  return (
    <>
      {!loading ? (
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
          <StatusBar style='light' />
          <Image
            source={{ uri: 'https://static-s.aa-cdn.net/img/gp/20600011886807/to-aGJ31KLwqc9AWaBUyL6NLbpFwN9VEliX7nQ_AU48aO4jH6M1MltWKmThWJPndJg=s300?v=1' }}
            style={{ width: 100, height: 100, marginBottom: 50 }}
          />
          <View style={styles.inputContainer}>
            <Input
              type='email'
              placeholder='Email'
              value={email}
              onChangeText={(text) => setEmail(text)}
              autoCapitalize='none'
              autoCorrect={false}
              leftIcon={<Icon name="envelope" type="font-awesome" size={24} color="gray" />}
              leftIconContainerStyle={{ marginRight: 10 }}
            />
            <Input
              type='password'
              secureTextEntry
              placeholder='Mật khẩu'
              value={password}
              onChangeText={(text) => setPassword(text)}
              onSubmitEditing={signIn}
              autoCapitalize='none'
              autoCorrect={false}
              leftIcon={<Icon name="lock" type="font-awesome" size={24} color="gray" />}
              leftIconContainerStyle={{ marginRight: 10 }}
            />
          </View>
          <Button
            loading={submitLoading}
            containerStyle={styles.button}
            title='Đăng Nhập'
            onPress={signIn}
          />
          <Button
            onPress={() => navigation.navigate('Register')}
            containerStyle={styles.button}
            title='Đăng Ký'
            type='outline'
          />
          <View style={{ height: 50 }}></View>

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
                <Button title="Đóng" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      ) : (
        <View style={styles.container}>
          <StatusBar style='light' />
          <Image
            source={{ uri: 'https://static-s.aa-cdn.net/img/gp/20600011886807/to-aGJ31KLwqc9AWaBUyL6NLbpFwN9VEliX7nQ_AU48aO4jH6M1MltWKmThWJPndJg=s300?v=1' }}
            style={{ width: 100, height: 100, marginBottom: 50 }}
          />
          <Text h4>Đang Tải...</Text>
        </View>
      )}
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'white',
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
