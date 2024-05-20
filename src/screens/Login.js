import React, { useState } from "react";
import { SafeAreaView, View, Modal, StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useMyContextController, login } from "../context";
import COLORS from "../../constants";
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;
  const navigation = useNavigation();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onSubmit = async () => {
    let valid = true;
    if (!validateEmail(email)) {
      setEmailError("Email không chính xác");
      valid = false;
    } else {
      setEmailError("");
    }

    if (password === "") {
      setPasswordError("Vui lòng nhập mật khẩu.");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (valid) {
      try {
        const { user } = await auth().signInWithEmailAndPassword(email, password);
        if (user) {
          const userUID = user.uid;
          login(dispatch, email, password, navigation, userUID);
        }
      } catch (error) {
        setGeneralError("Email hoặc mật khẩu không chính xác!!.");
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 40, fontWeight: "bold", color: COLORS.pink, marginBottom: 30 }}>
        Login
      </Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setEmailError("");
        }}
        style={{ marginVertical: 10, width: 380 }}
        mode="outlined"
        error={!!emailError}
      />
      {emailError ? <Text style={{ color: 'red' }}>{emailError}</Text> : null}
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setPasswordError("");
        }}
        secureTextEntry={!showPassword}
        style={{ marginVertical: 10, width: 380 }}
        right={<TextInput.Icon icon="eye" onPress={() => setShowPassword(!showPassword)} />}
        mode="outlined"
        error={!!passwordError}
      />
      {passwordError ? <Text style={{ color: 'red' }}>{passwordError}</Text> : null}
      <Button
        mode="contained"
        onPress={onSubmit}
        style={{ marginVertical: 10, padding: 5, borderRadius: 10, width: 380, backgroundColor: COLORS.pink }}
        labelStyle={{ fontSize: 20 }}
      >
        Login
      </Button>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Text>Don't have an account?</Text>
        <Button onPress={() => navigation.navigate('Register')}>Create new account</Button>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Button onPress={() => navigation.navigate('ForgotPassword')}>Forgot Password</Button>
      </View>
      <Modal
        transparent={true}
        visible={!!generalError}
        onRequestClose={() => setGeneralError("")}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{generalError}</Text>
            <Button mode="contained" onPress={() => setGeneralError("")} style={styles.modalButton}>
              OK
            </Button>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    marginBottom: 20,
    fontSize: 16,
    textAlign: "center",
  },
  modalButton: {
    marginTop: 10,
    width: "100%",
    backgroundColor: COLORS.pink,
  },
});

export default Login;
