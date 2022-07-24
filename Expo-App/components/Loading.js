import {StyleSheet, Text, View, ImageBackground, ActivityIndicator} from 'react-native';
import { COLORS, SIZES, FONTS, assets } from '../constants';

export default function Loading() {
return(

  <View 
  style={{
    width: "100%",
    height: "100%",
  }}
>
  <ImageBackground
     source={assets.nft01}
     resizeMode="cover"
     style={styles.background}
     >
     <ActivityIndicator size="large" color={COLORS.primary} />
  <Text style={styles.text_header_date}>Loading...</Text>

   </ImageBackground>
   </View>
)
}

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: SIZES.font,
    borderTopRightRadius: SIZES.font,
    alignItems:"center",
    flex: 1,
    justifyContent: "center",
  },
  text_header_date: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.large,
    color: COLORS.primary,
    padding: 10,
    alignContent: "center"
  },
});