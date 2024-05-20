import React, { useState, useRef } from 'react';
import { View, Text, SafeAreaView, TextInput, StyleSheet, Animated, Platform, Modal, TouchableWithoutFeedback, TouchableOpacity, Image } from 'react-native';
import { Appbar, Button, IconButton } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from '../../constants';  // Ensure COLORS is correctly imported
import DatePicker from 'react-native-date-picker';

const AddService = ({ navigation }) => {
  const [service, setService] = useState('');
  const [serviceError, setServiceError] = useState('');
  const [price, setPrice] = useState('');
  const [priceError, setPriceError] = useState('');
  const [pathImages, setPathImages] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [rotationValue] = useState(new Animated.Value(0));
  const [formattedDate, setFormattedDate] = useState('');
  const ref = firestore().collection('services');

  const menuWidth = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    const toValue = menuWidth._value === 0 ? 1 : 0;
    Animated.timing(menuWidth, {
      toValue: toValue,
      duration: 1000,
      useNativeDriver: false,
    }).start(() => {
      setIsMenuOpen(toValue === 1);
      Animated.timing(rotationValue, {
        toValue: toValue === 1 ? 1 : 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    });
  };

  const openModal = () => {
    setModalVisible(true);
  };
  
  const closeModal = () => {
    setModalVisible(false);
  };
  
  const rotatePlusIcon = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const selectImages = async (multiple = true) => {
    try {
      const images = await ImagePicker.openPicker({
        multiple,
        cropping: true,
        width: 300,
        height: 400,
        mediaType: "photo"
      });

      const selectedImages = multiple ? images : [images];
      const newPaths = selectedImages.map(image => image.path);

      setPathImages(prevPaths => [...prevPaths, ...newPaths]);

    } catch (e) {
      console.log(e.message);
    }
  };

  const selectSingleImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true
      });
  
      const imagePath = image.path;
      setPathImages([imagePath]); 
  
    } catch (e) {
      console.log(e.message);
    }
  };

  const removeImage = (index) => {
    setPathImages(prevPaths => prevPaths.filter((_, i) => i !== index));
  };

  const uploadImagesToStorage = async () => {
    const uploadPromises = pathImages.map(async (imagePath) => {
      const filename = imagePath.substring(imagePath.lastIndexOf('/') + 1);
      const uploadUri = Platform.OS === 'ios' ? imagePath.replace('file://', '') : imagePath;
      const storageRef = storage().ref(filename);
      await storageRef.putFile(uploadUri);
      return storageRef.getDownloadURL();
    });
  
    return await Promise.all(uploadPromises);
  };

  const addService = async () => {
    if (service.trim() === '') {
      setServiceError('Hãy nhập dịch vụ.');
      return;
    } else {
      setServiceError('');
    }
  
    if (isNaN(parseFloat(price)) || price.trim() === '') {
      setPriceError('Hãy nhập giá tiền.');
      return;
    } else {
      setPriceError('');
    }

    try {
      const imageUrls = await uploadImagesToStorage();

      await ref.add({
        title: service,
        price: parseFloat(price),
        imagePaths: imageUrls,
        date: selectedDate,
      });
    
      setService('');
      setPrice('');
      setPathImages([]);
      setFormattedDate('');
      setSelectedDate(new Date());
      setIsMenuOpen(false);
    } catch (e) {
      console.log(e.message);
    }
  };

  const updateFormattedDate = (date) => {
    const formatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    setFormattedDate(formatted);
  };

  const handleDateSelection = (date) => {
    setSelectedDate(date);
    updateFormattedDate(date);
    closeModal();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color="white"
          size={30}
        />
        <Appbar.Content
          title="Thêm Dịch Vụ"
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        />
        <MaterialCommunityIcons
          name='plus'
          onPress={addService}
          color={COLORS.white}
          size={40}
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
            value={price}
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
        <View style={styles.inputWrapper}>
          <Text>{formattedDate}</Text>
        </View>
        <View style={styles.inputWrapper}>
          <TouchableOpacity onPress={openModal}>
            <Text>Chọn ngày</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.menuContainer}>
          <IconButton
            icon="plus"
            color="#FFFFFF"
            size={30}
            style={[
              styles.addButton,
              { transform: [{ rotate: rotatePlusIcon }] },
            ]}
            onPress={toggleMenu}
          />

          <Animated.View
            style={[
              styles.menu,
              {
                width: menuWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '37%'],
                }),
              },
            ]}
          >
            {isMenuOpen && (
              <View style={styles.menuIcons}>
                <IconButton
                  icon="image-plus"
                  color={COLORS.blue}
                  size={30}
                  style={styles.menuIcon}
                  onPress={selectSingleImage}
                />
                <IconButton
                  icon="image-multiple"
                  color={COLORS.blue}
                  size={30}
                  style={styles.menuIcon}
                  onPress={() => selectImages(true)}
                />
              </View>
            )}
          </Animated.View>
        </View>

        <View style={styles.imagesContainer}>
          {pathImages.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} />
              <Button onPress={() => removeImage(index)}>Remove</Button>
            
            </View>
          ))}
        </View>
      </View>
  
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <DatePicker
            date={selectedDate}
            onDateChange={setSelectedDate}
            mode="date"
            textColor="black"
            style={styles.datePicker}
          />
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={closeModal} style={styles.button}>
              Hủy
            </Button>
            <Button mode="contained" onPress={() => handleDateSelection(selectedDate)} style={styles.button}>
              Chọn
            </Button>
          </View>
        </View>
      </Modal>
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
  inputContainer: {
    flexDirection: 'column',
    marginBottom: 10,
    marginTop: 20,
    paddingHorizontal: 20,
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
    width: '100%',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  imageContainer: {
    margin: 5,
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  menu: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    borderRadius: 25,
    overflow: 'hidden',
    marginLeft: 10,
  },
  menuIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  menuIcon: {
    marginHorizontal: 10,
  },
  addButton: {
    backgroundColor: COLORS.blue,
    borderRadius: 25,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    width: '40%',
  },
  add: {
    marginTop: 9,
    backgroundColor: COLORS.blue,
  },
});



export default AddService;
