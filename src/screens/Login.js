  import React, { useState, useEffect } from "react";
  import { SafeAreaView, View } from "react-native";
  import { Button, Text, TextInput } from "react-native-paper";
  import { useMyContextController, login } from "../context";
  import COLORS  from "../../constants";

  const Login = ({ navigation }) => {
    const [email, setEmail] = useState("dohuyhoang1907@gmail.com");
    const [password, setPassword] = useState("123456");
    const [showPassword, setShowPassword] = useState(false);
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;

    useEffect(() => {
      if (userLogin && userLogin.role) {
        navigation.navigate(userLogin.role === "admin" ? "Admin" : "Customer");
      }
    }, [userLogin]);
    

    const onSubmit = () => {
      login(dispatch, email, password);
    };

    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
     
          <Text style={{ fontSize: 40, fontWeight: "bold", color: COLORS.pink, marginBottom: 30 }}>
          Login
          </Text>

   
      
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={{ marginVertical: 10 ,width:380}}
          mode="outlined"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={{ marginVertical: 10 ,width:380}}
          right={ <TextInput.Icon  icon="eye" onPress={() => setShowPassword(!showPassword)} />}
          mode="outlined"
        />

        <Button
          mode="contained"
          onPress={onSubmit}
          style={{ marginVertical: 10, padding: 5 ,borderRadius:10 ,width:380,backgroundColor:COLORS.pink}}
          labelStyle={{ fontSize: 20 }}
        >
          Login
        </Button>
      </SafeAreaView>
    );
  };

  export default Login;
