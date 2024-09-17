import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DetailScreen = ({ route }) => {
  const { categoryId, categoryName } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh mục: {categoryName}</Text>
      <Text style={styles.details}>Hiển thị các món ăn trong danh mục {categoryId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default DetailScreen;
