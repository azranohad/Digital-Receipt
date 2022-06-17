import { useState, Component, useEffect } from 'react';
import { StyleSheet, TextInput, View, Button, Text } from 'react-native';
import { DataTable } from 'react-native-paper';
import  AsyncStorage  from '@react-native-async-storage/async-storage';


const MyStoreCreditsScreen = ({navigation, route}) => {
  const [found, setFound]= useState(false);
  const [searchByName, setSearchByName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [userKey, setuserKey] = useState('');
  const [fromDate, setfromDate] = useState('1/1/1950');
  const [toDate, settoDate] = useState('1/1/2023');
  const [JsonData, setJsonData] = useState([]);
  const [original, setOriginal] = useState([]);
  const [isLoading, setisLoading] = useState(true);


 useEffect(()=> {
    getIdandCredits();
  },[]);
 
  const getIdandCredits = async () => {
    // try {
    //   const value = await AsyncStorage.getItem('userKey')
    //   if(value !== null) {
    //     console.log("getdata: ",value);
    //     setuserKey(value);
    //     getAllCredits(value);
    //   }
    // } catch(e) {
    //   // error reading value
    // }
    setuserKey("ec2eac3508b24882bc45b09dfeee2ee3");
    getAllCredits("ec2eac3508b24882bc45b09dfeee2ee3");
  }

   // set all variables:
   const setAll = (data)=>{
    let len = (Object.keys(data)).length;
    if (len==0){
      setFound(false);
    }
    else {
      setJsonData(data);
      setFound(true);
    }
    setisLoading(false)
  }

  // default store credits view -  by date.
  async function getCreditsByDate() {
    fetch(`http://${route.params.url}/scan_credit_controller/get_all_credits_user`, {
        method: 'GET',
        headers: {
            'content-type': 'aplication/json',
            'user_key' : userKey,
            'from_date': fromDate,
            'to_date': toDate,
        },
    }).then(res => res.json()).then(data => {
      setAll(data);
    });
  }
    
    const searchName = ()=> {
 
      fetch(`http://${route.params.url}/scan_credit_controller/get_credit_by_name`, {
          method: 'GET',
          headers: {
              'content-type': 'aplication/json',
              'user_key' : userKey,
              'name_search' : searchByName,
          },
      }).then(res => res.json()).then(data => {
       setAll(data);
    });
  }
  const getStores = ()=> {
    setisLoading(true);
    fetch(`http://${route.params.url}/scan_credit_controller/get_markets`, {
        method: 'GET',
        headers: {
            'content-type': 'aplication/json',
            'user_key' : userKey,
        },
    }).then(res => res.json()).then(data => {
      console.log(data);
  });
}

const getCreditsByStore = ()=> {
  setisLoading(true);
  fetch(`http://${route.params.url}/scan_credit_controller/get_credit_by_market`, {
      method: 'GET',
      headers: {
          'content-type': 'aplication/json',
          'user_key' : userKey,
          'market' : storeName,
      },
  }).then(res => res.json()).then(data => {
   setAll(data);
});
}

const getAllCredits = (val)=> {
  setisLoading(true);
  fetch(`http://${route.params.url}/scan_credit_controller/get_all_credits_user`, {
      method: 'GET',
      headers: {
          'content-type': 'aplication/json',
          'user_key' : val,
      },
  }).then(res => res.json()).then(data => {
   setAll(data);
   setOriginal(data);
});
}



if (!isLoading){
  return (
    <View style={styles.container}> 
      <TextInput value={searchByName}
          onChangeText={(searchByName) => setSearchByName(searchByName)}
          placeholder={'Search By Name'}/>   
        <Button title='Search' onPress={()=>{searchName();}}></Button> 
        <TextInput value={storeName}
          onChangeText={(storeName) => setStoreName(storeName)}
          placeholder={'Search By Store'}/>   
        <Button title='Search' onPress={()=>{getCreditsByStore(); getStores();}}></Button> 
        {!found && <Text>Not Found</Text>}
        {!found && <Button title='Go Back' onPress={()=>{setJsonData(original);}}/>}
        {found && <DataTable >
      <DataTable.Header>
        <DataTable.Title></DataTable.Title>
        <DataTable.Title>Total Amount</DataTable.Title>
        <DataTable.Cell>Expiration Date</DataTable.Cell>
        <DataTable.Title>Store</DataTable.Title>
        <DataTable.Title>Date</DataTable.Title>
        <DataTable.Title>Credit Name</DataTable.Title>
      </DataTable.Header>
      {found && Object.values(JsonData).map((account)=>(
        <DataTable.Row style={{alignContent:'center', alignItems:'center'}} key={account._id}>
          <DataTable.Cell style={{backgroundColor: 'aqua'}} onPress={()=>{getCreditsByDate();}}>Show</DataTable.Cell>
          <DataTable.Cell>{account.total_price}$</DataTable.Cell>
          <DataTable.Cell>{account.expiration_date}</DataTable.Cell>
          <DataTable.Cell>{account.market}</DataTable.Cell>
          <DataTable.Cell>{account.date_of_credit}</DataTable.Cell>
          <DataTable.Cell>{account.name_for_client}</DataTable.Cell>
      </DataTable.Row>
      )
      )}
    </DataTable>}
    {found && <Button title='Show More' style={{backgroundColor:'blue'}}></Button>}
  </View>
)
}
else {
return (
  <View style={styles.container}> 
  <TextInput value={searchByName}
      onChangeText={(searchByName) => searchName(searchByName)}
      placeholder={'Search Credit'}/>   
    <Button title='Search' onPress={()=>{getCreditsByStore();}}></Button> 
    <Text>Loading...</Text>
    </View>

)
}
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
  },
});

export default MyStoreCreditsScreen