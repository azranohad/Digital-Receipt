import React, {useState, useContext} from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Image , Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground} from "react-native";

import { COLORS, SIZES, SHADOWS, assets } from "../constants";
import { SubInfo, EthPrice, NFTTitle } from "./SubInfo";
import { RectButton, CircleButton } from "./Button";

//{ data,handlePress, date, price, receipt}
export const PopUp = ({data, handleClose, handleConfirm, setAmount, setDate, setExpireDate, setMarket, setName, isReceipt}) =>{
  const [name, setname] = useState('')
  const [date, setdate] = useState(data.date)
  const [store, setstore] = useState(data.market)
  const [amount, setamount] = useState('')
  const [expdate, setexpdate] = useState('')
  return (
    <>
    {/* <View style={{alignItems: 'center', backgroundColor: COLORS.white}}>
          </View> */}


    <View style={{alignItems: 'center', backgroundColor: "transparent", borderRadius:SIZES.large}}>
    <ImageBackground
       source={assets.nft01}
       resizeMode="cover"
       style={{
        width: "100%",
        borderTopLeftRadius: SIZES.font,
        borderTopRightRadius: SIZES.font,
        alignItems:"center",
        justifyContent: "center",
        paddingBottom:SIZES.small
       }}
       imageStyle={{ borderRadius: SIZES.large}}
        >

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
       <Text style={styles.textcontainer}>
          <Text>Name:</Text>
      </Text>
      <TextInput
          value={name}
          // onEndEditing={(val)=>setName(val)}
          onChangeText={(name) => {setname(name); setName(name);}}
          placeholder={'Name'}
          style={styles.input}
          
          // placeholderTextColor={COLORS.primary}
          />
        <Text style={styles.textcontainer}>
          <Text>Store:</Text>
      </Text>
      <TextInput
          value={store}
          onChangeText={(name) => {setMarket(name); setstore(name)}}
          placeholder={'Store'}
          style={styles.input}
          />
          <Text style={styles.textcontainer}>
          <Text>Date:</Text>
      </Text>
          <TextInput
          value={date}
          onChangeText={(name) => {setDate(name); setdate(name)}}
          placeholder={'Date'}
          style={styles.input}
          
          />
        <Text style={styles.textcontainer}>
          <Text>Total:</Text>
      </Text>
        <TextInput
          value={amount}
          onChangeText={(name) => {setAmount(name); setamount(name)}}
          placeholder={'Total Amount'}
          style={styles.input}
          />
      {!isReceipt && <>
        <Text style={styles.textcontainer}>
          <Text>Expiration Date:</Text>
      </Text>
        <TextInput
          value={expdate}
          onChangeText={(lname) => {setExpireDate(lname); setexpdate(lname);}}
          placeholder={'Expiration Date'}
          style={styles.input}
        />
      </>}
      <RectButton  minWidth={120} fontSize={SIZES.medium} {...SHADOWS.dark} buttonText={"Confirm"} handlePress={()=>handleConfirm()}/>
      {/* <Button title="Confirm" onPress={()=>{sendUpdates();}}></Button>
      <Button title="Edit" onPress={()=>{}}></Button> */}
</ImageBackground>
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
  input: {
    width: 250,
    height: 44,
    padding: 10,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#e8e8e8'
  },
  textcontainer: {
    fontWeight: 'bold',
    width: 350,
    fontStyle: 'normal',
    textAlign: 'right',
    alignItems:'center',
    padding: 0,
    borderRadius: 1,
    //borderWidth:1,
    borderColor:'#dcdcdc',
    marginTop: 10,
    marginBottom: 0,
    backgroundColor: COLORS.white,
    color: 'black',
    fontSize: 16,


  },
});

