import React, {useState, useContext} from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Image , Text, TextInput, StyleSheet, TouchableOpacity} from "react-native";

import { COLORS, SIZES, SHADOWS, assets } from "../constants";
import { SubInfo, EthPrice, NFTTitle } from "./SubInfo";
import { RectButton, CircleButton } from "./Button";

//{ data,handlePress, date, price, receipt}
export const PopUp = ({data, handleClose, handleConfirm, setAmount, setDate, setExpireDate, setMarket, setName, isReceipt}) =>{
  
  const [specUrl, setSpecUrl] = useState('')
  const [isUpLoading, setisUpLoading] = useState(false);
  return (
    <>
    {/* <View style={{alignItems: 'center', backgroundColor: COLORS.white}}>
          </View> */}
    <View style={{alignItems: 'center', backgroundColor: COLORS.white, borderRadius:SIZES.large}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>handleClose(false)}>
           <Image source={require('../Images/x.png')}
                    style={{height: 30, width: 30}}/>
        </TouchableOpacity>
      </View>
      {/* <Image
        source={require('../Images/success.png')}
        style={{height: 150, width: 150, marginVertical: 10}}
      /> */}
      {isUpLoading ? <Text>Uplaoding...</Text>:<>
      <TextInput
          value=""
          onChangeText={(name) => setName(name)}
          placeholder={'Name'}
          style={styles.input}
          />
      <Text>Store: </Text>
      <Text>Date: </Text>
      {isReceipt && <>
      <Text>Total Amount is: 90$</Text>
      </>}
      {!isReceipt && <>
        <Text>Please Enter:</Text>
        <TextInput
          value="{expireDate}"
          onChangeText={(lname) => setExpireDate(lname)}
          placeholder={'Expiration Date'}
          style={styles.input}
        />
        <TextInput
          value={data.total_price}
          onChangeText={(name) => setAmount(name)}
          placeholder={'Total Amount'}
          style={styles.input}
          />
      </>}
      <RectButton minWidth={120} fontSize={SIZES.medium} {...SHADOWS.dark} buttonText={"Confirm"}/>
      {/* <Button title="Confirm" onPress={()=>{sendUpdates();}}></Button>
      <Button title="Edit" onPress={()=>{}}></Button> */}
    </>}
    </View>
</>

  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    aspectRatio: 1,
    // shoval added
    // These below are most important, they center your border view in container
    // ref: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
    alignItems: 'center',
    justifyContent: 'center',
    //
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  button: {
    flex: 1,
  },
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  header: {
    width: '100%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

