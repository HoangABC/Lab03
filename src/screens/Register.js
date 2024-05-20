import React, { useState } from 'react';
import { Alert, View, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import COLORS from '../../constants';

const Register = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const hasErrorName = () => name === '';
  const hasErrorEmail = () => !email.includes('@');
  const hasErrorPassword = () => password.length < 6;
  const hasErrorPasswordConfirm = () => passwordConfirm !== password;

  const USERS = firestore().collection('USERS');

  const handleCreateAccount = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        USERS.doc(email).set({
          name,
          email,
          password,
          address,
          phone,
          role: 'customer',
        });
        navigation.navigate('Login');
      })
      .catch((e) => Alert.alert('Tài khoản tồn tại'));
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create New Account</Text>
        <TextInput
          label="Full Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />
        <HelperText type="error" visible={hasErrorName()}>
          Full name không được phép để trống
        </HelperText>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
        />
        <HelperText type="error" visible={hasErrorEmail()}>
          Địa chỉ email không hợp lệ
        </HelperText>
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          right={<TextInput.Icon icon="eye" onPress={() => setShowPassword(!showPassword)} />}
          mode="outlined"
          style={styles.input}
        />
        <HelperText type="error" visible={hasErrorPassword()}>
          Password ít nhất 6 kí tự
        </HelperText>
        <TextInput
          label="Confirm Password"
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
          secureTextEntry={!showPasswordConfirm}
          right={<TextInput.Icon icon="eye" onPress={() => setShowPasswordConfirm(!showPasswordConfirm)} />}
          mode="outlined"
          style={styles.input}
        />
        <HelperText type="error" visible={hasErrorPasswordConfirm()}>
          PasswordConfirm phải so khớp với password
        </HelperText>
        <TextInput
          label="Address"
          value={address}
          onChangeText={setAddress}
          style={[styles.input, { marginBottom: 10 }]}
          mode="outlined"
        />
        <TextInput
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          style={[styles.input, { marginBottom: 10 }]}
          mode="outlined"
        />
        <Button mode="contained" onPress={handleCreateAccount} style={styles.button}>
          Create New Account
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: COLORS.pink,
    marginTop: 20,
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
});

export default Register;
