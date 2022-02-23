import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native';

export default function home({ navigation }) {
  const image = { uri: "https://r1.ilikewallpaper.net/iphone-4s-wallpapers/download/24756/Colorful-App-Tiles-Background-iphone-4s-wallpaper-ilikewallpaper_com.jpg" };

  const pressHandler = () => {
    navigation.navigate('Gps');
  }

  return (
    <View style={styles.container}>
      {/* <ImageBackground source={image} resizeMode="cover" style={styles.image}> */}
      <Text>Home</Text>
      <Button title="go to gps page" onPress={pressHandler}/>
      {/* </ImageBackground> */}
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