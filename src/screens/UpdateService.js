import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';

const UpdateService = ({ route, navigation }) => {
  const { title, price, imagePaths, currentDate } = route.params;
  const [newTitle, setNewTitle] = useState(title);
  const [newPrice, setNewPrice] = useState(price ? price.toString() : '');
  const [errorMessage, setErrorMessage] = useState('');
  const [docId, setDocId] = useState('');
  const [updatedImagePaths, setUpdatedImagePaths] = useState(imagePaths.map(path => ({ uri: path })));
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchDocId = async () => {
      try {
        const snapshot = await firestore().collection('services').where('title', '==', title).get();
        if (!snapshot.empty) {
          snapshot.forEach(doc => {
            setDocId(doc.id);
          });
        }
      } catch (error) {
        console.error('Error fetching document ID:', error);
      }
    };

    fetchDocId();
  }, [title]);

  const selectImages = async () => {
    try {
      const images = await ImagePicker.openPicker({
        multiple: true,
        mediaType: 'photo',
      });
      const selectedImagePaths = images.map(image => ({ uri: image.path }));
      setUpdatedImagePaths([...updatedImagePaths, ...selectedImagePaths]);
    } catch (error) {
      console.error('Error selecting images:', error);
    }
  };

  const removeImage = (index) => {
    const filteredPaths = updatedImagePaths.filter((_, i) => i !== index);
    setUpdatedImagePaths(filteredPaths);
  };

  const handleUpdate = async () => {
    try {
      setUploading(true);

      const uploadTasks = updatedImagePaths.map(async (image, index) => {
        if (!image.uri) {
          throw new Error('Invalid image object');
        }
        if (image.uri.startsWith('http')) {
          return image.uri;
        }
        const response = await fetch(image.uri);
        const blob = await response.blob();
        const storageRef = storage().ref(`images/${docId}/${index}`);
        await storageRef.put(blob);
        const downloadURL = await storageRef.getDownloadURL();
        return downloadURL;
      });

      const imageURLs = await Promise.all(uploadTasks);

      await firestore().collection('services').doc(docId).update({
        title: newTitle,
        price: parseFloat(newPrice),
        imagePaths: imageURLs,
        date: firestore.FieldValue.serverTimestamp(),
        currentDate: firestore.FieldValue.serverTimestamp(),
      });

      console.log('Update successful!');

      navigation.goBack();
    } catch (error) {
      console.error('Error updating service:', error);
      setErrorMessage('Error updating service. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={newTitle}
        onChangeText={setNewTitle}
        placeholder="Title"
      />
      <TextInput
        style={styles.input}
        value={newPrice}
        onChangeText={setNewPrice}
        placeholder="Price"
        keyboardType="numeric"
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Button title="Select Images" onPress={selectImages} />
      <View style={styles.imagesContainer}>
        {updatedImagePaths.map((imagePath, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri: imagePath.uri || imagePath }} style={styles.image} />
            <Button title="Remove" onPress={() => removeImage(index)} />
          </View>
        ))}
      </View>
      {uploading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Update" onPress={handleUpdate} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  imageContainer: {
    margin: 5,
  },
  image: {
    width: 100,
    height: 100,
  },
});

export default UpdateService;
