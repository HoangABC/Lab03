import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';

const Service = ({ id, title, complete, price }) => {
  const truncateTitle = (title) => {
    const maxLength = 90; 
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('Vi-VN',{style:'currency',currency:'VND'}).format(price);
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <List.Item
          title={truncateTitle(title)}
          titleStyle={styles.title}
        />
      </View>
      {price !== undefined && price !== null && ( 
         <View style={styles.right}>
          <Text style={styles.price}>{formatPrice(price)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderWidth: 1, 
    borderColor: 'black', 
    borderRadius: 8, 
    marginHorizontal: 16, 
    marginBottom: 8, 
  },
  left: {
    flex: 1,
  },
  right: {
    marginLeft: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff', 
  },
});

export default Service;
