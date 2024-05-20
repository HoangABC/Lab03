import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Alert, Button } from 'react-native';
import { Appbar, Menu } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import firestore from '@react-native-firebase/firestore';
import { useMyContextController } from '../context'; 
import COLORS from '../../constants';

const DetailsService = ({ route }) => {
  const navigation = useNavigation();
  const { documentId, title, price, imagePaths, date, currentDate } = route.params;
  const [visible, setVisible] = useState(false);
  const [serviceData, setServiceData] = useState({ title, price, imagePaths, date, currentDate });
  const [controller] = useMyContextController();
  const { userLogin } = controller;

  useFocusEffect(
    React.useCallback(() => {
      const fetchService = async () => {
        try {
          const doc = await firestore().collection('services').doc(documentId).get();
          if (doc.exists) {
            const data = doc.data();
            setServiceData({
              title: data.title,
              price: data.price,
              imagePaths: data.imagePaths,
              date: data.date,
              currentDate: data.currentDate,
            });
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching service details:', error);
        }
      };

      fetchService();
    }, [documentId])
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (date) => {
    if (!date) {
      return 'Chưa có cập nhật';
    }
    try {
      const dateObj = date.toDate ? date.toDate() : new Date(date.seconds * 1000);
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const updateService = () => {
    navigation.navigate('UpdateService', {
      documentId,
      title: serviceData.title,
      price: serviceData.price,
      imagePaths: serviceData.imagePaths,
      date: serviceData.date,
      currentDate: serviceData.currentDate,
    });
  };

  const deleteCurrentService = async () => {
    try {
      await firestore().collection('services').doc(documentId).delete();
      Alert.alert('Xóa thành công', 'Dịch vụ đã được xóa.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error deleting service:', error);
      Alert.alert('Xóa thất bại', 'Có lỗi xảy ra khi xóa dịch vụ.', [{ text: 'OK' }]);
    }
  };

  const showDeleteConfirmation = () => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa dịch vụ này?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: deleteCurrentService },
      ],
      { cancelable: false }
    );
  };

  const confirmOrder = async () => {
    try {
      if (!userLogin || !userLogin.email) {
        console.error('Email không tồn tại!.');
        return;
      }
      const userQuery = await firestore().collection('USERS').where('email', '==', userLogin.email).get();
      if (userQuery.empty) {
        console.error('User not found.');
        return;
      }
      const userDoc = userQuery.docs[0];
      const userId = userDoc.id;
      const userData = userDoc.data();
      
      await firestore().collection('orders').add({
        userId: userId,
        serviceId: documentId,
        title: serviceData.title,
        price: serviceData.price,
        date: firestore.FieldValue.serverTimestamp(),
        userName: userData.name,
        userPhone: userData.phone,
      });
  
      Alert.alert('Đặt hàng thành công', 'Dịch vụ đã được đặt hàng thành công.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Đặt hàng thất bại', 'Có lỗi xảy ra khi đặt hàng.', [{ text: 'OK' }]);
    }
  };
  

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="white" size={30} />
        <Appbar.Content title="Thông tin chi tiết" style={{ justifyContent: 'center' }} />
        {userLogin.role === 'admin' && (
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={<Appbar.Action icon="pen" onPress={openMenu} color="white" />}
          >
            <Menu.Item onPress={() => {updateService(); closeMenu(); }} title="Update" />
            <Menu.Item onPress={() => { showDeleteConfirmation(); closeMenu(); }} title="Delete" />
          </Menu>
        )}
      </Appbar.Header>

      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Swiper
            style={styles.swiper}
            showsButtons={false}
            activeDotStyle={styles.activeDot}
            dotStyle={styles.dot}
          >
            {serviceData.imagePaths && serviceData.imagePaths.length > 0 && serviceData.imagePaths.map((imagePath, index) => (
              <View key={index} style={styles.slide}>
                <Image source={{ uri: imagePath }} style={styles.image} />
              </View>
            ))}
          </Swiper>

          <View style={styles.text}>
            <Text style={styles.title}>Title: {serviceData.title}</Text>
            <Text style={styles.price}>Price: {formatPrice(serviceData.price)}</Text>
            <Text style={styles.date}>Ngày tạo: {formatDate(serviceData.date)}</Text>
            <Text style={styles.date}>Ngày cập nhật: {formatDate(serviceData.currentDate)}</Text>
            {userLogin.role === 'customer' && (
              <Button
                title="Đặt hàng"
                onPress={confirmOrder} 
                color={COLORS.pink}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: 4,
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  appbar: {
    backgroundColor: COLORS.pink,
  },
  dot: {
    backgroundColor: '#ccc',
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: COLORS.pink,
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: COLORS.pink,
  },
  swiper: {
    marginBottom: 20,
  },
  text: {
    marginBottom: 156,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    color: COLORS.blue,
    fontStyle: 'normal',
  },
  date: {
    fontSize: 16,
    color: COLORS.black,
  },
});

export default DetailsService;

