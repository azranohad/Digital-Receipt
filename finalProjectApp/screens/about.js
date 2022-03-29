import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function about({navigation}) {
  const pressHandler = () => {
    navigation.goBack();
  }
  return (
    <View style={styles.container}>
      <Text>About page</Text>
      <Button title='back to home screen' onPress={pressHandler}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#008080',
    alignItems: 'center',
    justifyContent: 'center',
  },
});