import { useState, Component, useEffect } from 'react';
import { StyleSheet, TextInput, View, Button, Text } from 'react-native';
import { DataTable } from 'react-native-paper';
import  AsyncStorage  from '@react-native-async-storage/async-storage';


const MyStoreCreditsScreen = () => {
  const [single, setSingle]= useState(false);
  const [found, setFound]= useState(false);
  const [showSearch, setShowSearch]= useState(false);
  const [searchByName, setSearchByName] = useState('');
  const [JsonData, setJsonData] = useState([]);
  const [original, setOriginal] = useState([]);
  const [num, setNum] = useState(0);
  const [userId, setUserId] = useState(null);
 useEffect(()=> {
   console.log("lllll");
   setUserId(getId());
   console.log(userId);
   getCredits();
  },[]);
 
  // get id of user
  const getId = async () => {
    try {
      const value = await AsyncStorage.getItem('userId')
      if(value !== null) {
        console.log("getdata: ",value);
        return value;
      }
    } catch(e) {
      // error reading value
    }
  }

  // default store credits view -  by date.
  // num - represents the number of times the user asked for more credits
  async function getCredits() {
    let userId = getId();
    userId = 1;
    fetch(`http://172.20.10.2:3000/get_credits_by_date?id=${userId}&&num=${num}`, {
        method: 'GET',
        headers: {
            'content-type': 'aplication/json',
        },
    }).then(res => res.json()).then(data => {
      if (Object.keys(data).length == 0){
        console.log("NONE");
        setSingle(false);
        setShowSearch(false);
        setFound(false);
      }
      else if(Object.keys(data).length == 1){
        setJsonData(data); 
        setFound(true);
        setSingle(true);
        setShowSearch(false);
      }
      else {
        setJsonData(data); 
        setOriginal(data); 
        setFound(true);
        setSingle(false);
        setShowSearch(false);
        console.log("in else");
        console.log(data);
      }
    });
    console.log("----");
      // data.forEach(obj => {
      //   Object.entries(obj).forEach(([key, value]) => {
      //     console.log(`${key} ${value}`);
      //   });
      //   console.log('-------------------');
      // });
      // console.log("data1: ", data[0]);
      // console.log("data2: ", data[1]);
      // let response = data[Object.keys(data)[0]];
      // let respons = Object.keys(data)[0];
      // console.log("res: ",response);
      // console.log("resp: ",respons);
      // console.log("data: ", data);
  
      // console.log("Object.keys(data): ",Object.keys(data));
      // console.log("--------", Object.keys(data)[0]);
      // console.log("--------", Object.values(data)[0]);
      // if (Object.keys(data).length == 0){
      //     console.log("NONE");
      // }
  }
    
    const searchName = ()=> {
 
      fetch(`http://172.20.10.2:3000/get_credit_by_name?id=${userId}&name=${searchByName}`, {
          method: 'GET',
          headers: {
              'content-type': 'aplication/json',
          },
      }).then(res => res.json()).then(data => {
        let len = (Object.keys(data)).length;
        if (len==0){
          setFound(false);
          setSingle(false);
          setShowSearch(false);
        }
        else if(len==1){
          setJsonData(data);
          setFound(true);
          setSingle(true);
        }
        else {
          setJsonData(data);
          setFound(true);
          setSingle(false);
          setShowSearch(true);
        }
    });
  }
  const getStores = ()=> {
    let userId=1;
    fetch(`http://192.168.43.254:3000/get_credit_stores?id=${userId}`, {
        method: 'GET',
        headers: {
            'content-type': 'aplication/json',
        },
    }).then(res => res.json()).then(data => {
      
  });
}

const getCreditsByStore = ()=> {
  fetch(`http://192.168.43.254:3000/get_credits_by_store?id=${userId}&name=${storeName}`, {
      method: 'GET',
      headers: {
          'content-type': 'aplication/json',
      },
  }).then(res => res.json()).then(data => {
    let len = (Object.keys(data)).length;
    if (len==0){
      setFound(false);
      setSingle(false);
      setShowSearch(false);
    }
    else if(len==1){
      setJsonData(data);
      setFound(true);
      setSingle(true);
      setShowSearch(false);
    }
    else {
      setJsonData(data);
      setShowSearch(true);
      setSingle(false);
      setFound(true);
    }
});
}

const getCreditsByDate = ()=> {
  fetch(`http://192.168.43.254:3000/get_credits_by_date?id=${userId}&from=${fromDate}&&to=${toDate}`, {
      method: 'GET',
      headers: {
          'content-type': 'aplication/json',
      },
  }).then(res => res.json()).then(data => {
    let len = (Object.keys(data)).length;
    if (len==0){
      setFound(false);
      setSingle(false);
      setShowSearch(false);
    }
    else if(len==1){
      setJsonData(data);
      setFound(true);
      setSingle(true);
      setShowSearch(false);
    }
    else {
      setJsonData(data);
      setShowSearch(true);
      setSingle(false);
      setFound(true);
    }
});
}

  return (
      <View style={styles.container}> 
        <TextInput value={searchByName}
            onChangeText={(searchByName) => setSearchByName(searchByName)}
            placeholder={'Search Store Credits'}/>   
          <Button title='Search' onPress={()=>{searchName();}}></Button> 
          {!found && <Text>No Store Credits Found</Text>}
          {!found && <Button title='Go Back' onPress={()=>{setJsonData(original); setShowSearch(true);}}/>}
          {showSearch && !single && found && <DataTable >
        <DataTable.Header>
          <DataTable.Title></DataTable.Title>
          <DataTable.Title>Total Amount</DataTable.Title>
          <DataTable.Title>Expire Date</DataTable.Title>
          <DataTable.Title>Store</DataTable.Title>
          <DataTable.Title>Date</DataTable.Title>
          <DataTable.Title>Credit Name</DataTable.Title>
        </DataTable.Header>

        {single && !showSearch && found && <DataTable.Row style={{alignContent:'center', alignItems:'center'}}>
            <DataTable.Cell style={{backgroundColor: 'aqua'}} onPress={()=>{getCredits();}}>Show</DataTable.Cell>
            <DataTable.Cell>{JsonData.Total_amount}</DataTable.Cell>
            <DataTable.Cell>{JsonData.Expire_date}</DataTable.Cell>
            <DataTable.Cell>{JsonData.Date}</DataTable.Cell>
            <DataTable.Cell>{JsonData.Store_name}</DataTable.Cell>
            <DataTable.Cell>{JsonData.Credit_name}</DataTable.Cell>
        </DataTable.Row>}
        {!showSearch && !single && found && JsonData.map((account, key)=>(
        <DataTable.Row style={{alignContent:'center', alignItems:'center'}} key={key}>
            <DataTable.Cell style={{backgroundColor: 'aqua'}} onPress={()=>{getCredits();}}>Show</DataTable.Cell>
            <DataTable.Cell>{account.Total_amount}</DataTable.Cell>
            <DataTable.Cell>{account.Expire_date}</DataTable.Cell>
            <DataTable.Cell>{account.Date}</DataTable.Cell>
            <DataTable.Cell>{account.Store_name}</DataTable.Cell>
            <DataTable.Cell>{account.Credit_name}</DataTable.Cell>
        </DataTable.Row>
        )
    )}
      </DataTable>}
      {!showSearch && found && !single && <Button title='Show More' style={{backgroundColor:'blue'}}></Button>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
  },
});

export default MyStoreCreditsScreen