import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import COLORS from '../../constants';

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('USERS')
      .where('role', '==', 'customer')
      .onSnapshot((querySnapshot) => {
        const users = [];
        querySnapshot.forEach((documentSnapshot) => {
          users.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });
        setCustomers(users);
      });

    return () => unsubscribe();
  }, []);

  const openModal = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>Name: {item.name}</Text>
        <Text style={styles.itemText}>Email: {item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>List of Customers:</Text>
      <FlatList
        data={customers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Name: {selectedUser && selectedUser.name}</Text>
            <Text style={styles.modalText}>Email: {selectedUser && selectedUser.email}</Text>
            <Text style={styles.modalText}>Phone: {selectedUser && selectedUser.phone}</Text>
            <Text style={styles.modalText}>Address: {selectedUser && selectedUser.address}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 30,
    color: COLORS.black,
    marginBottom: 20,
  },
  itemContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  itemText: {
    fontSize: 16,
    color: COLORS.black,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    color: COLORS.black,
  },
  closeButton: {
    backgroundColor: COLORS.blue,
    color: COLORS.white,
    padding: 8,
    borderRadius: 5,
    textAlign: 'center',
    width: '100%', 
    marginTop: 20, 
  },
});

export default Customer;
