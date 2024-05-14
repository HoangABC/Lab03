import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { IconButton, Appbar } from 'react-native-paper'; // Import Appbar
import Service from '../context/Service';
import firestore from '@react-native-firebase/firestore';
import COLORS from '../../constants';

const AddService = () => {
  const [service, setService] = useState('');
  const [serviceError, setServiceError] = useState('');
  const [price, setPrice] = useState('');
  const [priceError, setPriceError] = useState('');
  const [loading, setLoading] = useState(true);
  const ref = firestore().collection('services');
  const [services, setServices] = useState([]);

  async function addService() {
    if (service.trim() === '') {
      setServiceError('Hãy nhập dịch vụ.');
      return;
    } else {
      setServiceError('');
    }

    if (isNaN(parseFloat(price))) {
      setPriceError('Hãy nhập giá tiền.');
      return;
    } else {
      setPriceError('');
    }

    await ref.add({
      title: service,
      price: parseFloat(price),
    });
    setService('');
    setPrice('');
  }

  useEffect(() => {
    const unsubscribe = ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const { title, price} = doc.data();
        list.push({
          id: doc.id,
          title,
          price,
        });
      });
      setServices(list);

      if (loading) {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content title="Thêm Dịch Vụ" />
        <IconButton
          icon="plus-circle"
          onPress={addService}
          color={COLORS.blue}
          size={50}
          style={styles.addButton}
        />
      </Appbar.Header>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Add service"
            value={service}
            onChangeText={(text) => setService(text)}
            style={styles.textInput}
          />
          <Text style={styles.errorText}>{serviceError}</Text>
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Add price"
            value={price.toString()}
            onChangeText={(text) => {
              if (/^\d*\.?\d*$/.test(text) || text === '') {
                setPrice(text);
                setPriceError('');
              } else {
                setPriceError('Chỉ được phép nhập số!!.');
              }
            }}
            keyboardType="numeric"
            style={styles.textInput}
          />
          <Text style={styles.errorText}>{priceError}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appbar: {
    backgroundColor: COLORS.pink,
  },
  addButton: {
    position: 'absolute',
    right: 0,
    margin: 10,
  },
  inputContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
    marginTop:20
  },
  inputWrapper: {
    flexDirection: 'column',
    marginBottom: 10,
    alignItems: 'center',
  },
  textInput: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    height: 50,
    paddingHorizontal: 10,
    width: 390,
  },
  errorText: {
    color: 'red',
    marginLeft: 10,
  },
 
});

export default AddService;
