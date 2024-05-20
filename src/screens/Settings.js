import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMyContextController, logout } from '../context'; 
import COLORS from '../../constants';


const Settings = () => {
  const navigation = useNavigation(); 
  const [controller, dispatch] = useMyContextController(); 

  return (
    <View style={styles.container}>
     
      <TouchableOpacity
        onPress={() => {
          logout(dispatch); 
          navigation.navigate('Login'); 
        }}
        style={styles.logoutButton}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', 
    alignItems: 'center',
    flexDirection: 'column', 
  },
  logoutButton: {
    backgroundColor: COLORS.pink,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent:'center',
    alignItems:'center',
    marginTop:50
  },  
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
  appbar: {
    backgroundColor: COLORS.pink,
    marginTop: 0, 
  },
 
});

export default Settings;
