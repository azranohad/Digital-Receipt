import React, {useState, useContext} from "react";
import { View, Text, TextInput, StyleSheet} from "react-native";

import { COLORS, SIZES, SHADOWS,FONTS } from "../constants";
import { RectButton } from "./Button";

//{ data,handlePress, date, price, receipt}
export const PopUp = ({handleConfirm, setAmount, setDate, setExpireDate, setMarket, setName, scanned_date, scanned_store, isReceipt}) =>{
  const [name, setname] = useState('')
  const [date, setdate] = useState(scanned_date)
  const [store, setstore] = useState(scanned_store)
  const [amount, setamount] = useState('')
  const [expdate, setexpdate] = useState('')
  return (
    <>
    <View style={{alignItems: 'center', backgroundColor: COLORS.white, borderRadius:SIZES.large, paddingBottom:10, paddingTop:10}}>
       <Text style={styles.textcontainer}>
          <Text>Name:</Text>
      </Text>
      <TextInput
          value={name}
          onChangeText={(name) => {setname(name); setName(name);}}
          placeholder={'Name'}
          style={styles.input}
          />
        <Text style={styles.textcontainer}>
          <Text>Store:</Text>
      </Text>
      <TextInput
          value={store}
          onChangeText={(store) => {setMarket(store); setstore(store)}}
          placeholder={'Store'}
          style={styles.input}
          />
          <Text style={styles.textcontainer}>
          <Text>Date:</Text>
      </Text>
          <TextInput
          value={date}
          onChangeText={(date) => {setDate(date); setdate(date)}}
          placeholder={'Date'}
          style={styles.input}
          
          />
        <Text style={styles.textcontainer}>
          <Text>Total:</Text>
      </Text>
        <TextInput
          value={amount}
          onChangeText={(amount) => {setAmount(amount); setamount(amount)}}
          placeholder={'Total Amount'}
          style={styles.input}
          />
      {!isReceipt && <>
        <Text style={styles.textcontainer}>
          <Text>Expiration Date:</Text>
      </Text>
        <TextInput
          value={expdate}
          onChangeText={(expdate) => {setExpireDate(expdate); setexpdate(expdate);}}
          placeholder={'Expiration Date'}
          style={styles.input}
        />
      </>}
      <RectButton  minWidth={120} fontSize={SIZES.medium} {...SHADOWS.dark} buttonText={"Confirm"} handlePress={()=>handleConfirm()}/>
    </View>
</>

  );
};
const styles = StyleSheet.create({
  input: {
    width: 350,
    height: 44,
    padding: 10,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#e8e8e8'
  },
  textcontainer: {
    width: 350,
    fontFamily: FONTS.semiBold,
    textAlign: 'right',
    alignItems:'center',
    padding: 0,
    borderRadius: 1,
    borderColor:'#dcdcdc',
    marginTop: 10,
    marginBottom: 0,
    color: COLORS.primary,
    fontSize: 16,
  },
});

