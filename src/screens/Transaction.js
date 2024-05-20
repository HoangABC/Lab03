import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import COLORS from '../../constants';

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('orders')
      .onSnapshot(querySnapshot => {
        const transactions = [];
        querySnapshot.forEach(documentSnapshot => {
          transactions.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setTransactions(transactions);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const openModal = (transaction) => {
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>User Name: {item.userName}</Text>
        <Text style={styles.itemText}>Service Name: {item.title}</Text>
        <Text style={styles.itemText}>Price: {item.price}</Text>
        <Text style={styles.itemText}>Date: {item.date ? new Date(item.date.toDate()).toLocaleDateString() : 'N/A'}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>List of Transactions:</Text>
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        contentContainerStyle={styles.listContainer}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>User Name: {selectedTransaction?.userName}</Text>
            <Text style={styles.modalText}>Service Name: {selectedTransaction?.title}</Text>
            <Text style={styles.modalText}>Price: {selectedTransaction?.price}</Text>
            <Text style={styles.modalText}>Date: {selectedTransaction?.date ? new Date(selectedTransaction?.date.toDate()).toLocaleDateString() : 'N/A'}</Text>
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
  listContainer: {
    paddingBottom: 16,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.black,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
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
    alignSelf: 'center',
    width: '100%',
    marginTop: 20,
  },
});

export default Transaction;
