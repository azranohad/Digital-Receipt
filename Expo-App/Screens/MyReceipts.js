import { useState, Component, useEffect } from 'react';
import { StyleSheet, TextInput, View, Button, Text } from 'react-native';
import { DataTable } from 'react-native-paper';
import  AsyncStorage  from '@react-native-async-storage/async-storage';


const MyReceiptsScreen = ({navigation, route}) => {
  const [found, setFound]= useState(false);
  const [searchByName, setSearchByName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [userKey, setuserKey] = useState('');
  const [fromDate, setfromDate] = useState('1/1/1950');
  const [toDate, settoDate] = useState('1/1/2023');
  const [JsonData, setJsonData] = useState([]);
  const [original, setOriginal] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const i = 'user_key';



  useEffect(()=>{
      getIdandReceipts();
 },[]);
 
  // get id of user and all his receipts
  const getIdandReceipts = async () => {
    // try {
    //   const value = await AsyncStorage.getItem('userKey')
    //   if(value !== null) {
    //     console.log("getdata: ",value);
    //     setuserKey(value);
    //   }
    // } catch(e) {
    //   // error reading value
    // }
    setuserKey("fd18ed355cd74ae38799f76dc7d20609");
    getImg("p");
    getAllReceipts("fd18ed355cd74ae38799f76dc7d20609");
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


  // default receipts view -  by date_of_receipt
  async function getReceiptsByDate() {
    setisLoading(true);
    fetch(`http://${route.params.url}/scan_receipt_controller/get_receipt_by_date`, {
        method: 'GET',
        headers: {
            'content-type': 'aplication/json',
            'user_key': userKey,
            'from_date': fromDate,
            'to_date': toDate,
        },
    }).then(res => res.json()).then(data => {
      setAll(data);
    });
  }
    
    const searchName = ()=> {
      setisLoading(true);
      fetch(`http://${route.params.url}/scan_receipt_controller/get_receipt_by_name`, {
          method: 'GET',
          headers: {
              'content-type': 'aplication/json',
              'user-key': userKey,
              'name_search' : searchByName,
          },
      }).then(res => res.json()).then(data => {
        setAll(data);
    });
  }

  const getStores = ()=> {
    setisLoading(true);
    fetch(`http://${route.params.url}/scan_receipt_controller/get_markets`, {
        method: 'GET',
        headers: {
            'content-type': 'aplication/json',
            'user-key': userKey,
        },
    }).then(res => res.json()).then(data => {
      console.log(data);
  });
}

const getReceiptsByStore = ()=> {
  setisLoading(true);
  fetch(`http://${route.params.url}/scan_receipt_controller/get_receipt_by_market`, {
      method: 'GET',
      headers: {
          'content-type': 'aplication/json',
          'user-key': userKey,
          'market' : storeName
      },
  }).then(res => res.json()).then(data => {
    setAll(data);
});
}

const getAllReceipts = (val)=> {
  setisLoading(true);
  fetch(`http://${route.params.url}/scan_receipt_controller/get_all_receipts_user`, {
      method: 'GET',
      headers: {
          'content-type': 'aplication/json',
          'user_key' : val,
      },
  }).then(res => res.json()).then(data => {
    setOriginal(data);
    setAll(data);
});
}

const getImg =  (id)=> {
  setisLoading(true);
  fetch(`http://${route.params.url}/scan_receipt_controller/get_all_receipts`, {
      method: 'GET',
      headers: {
          'content-type': 'aplication/json',
          'user_key' : 'b661e90ea0fe4cb5bb6c53b68ad5d555',
          'image_name' : 'ef2561389f2b4322b40d9c0c6e18240e',
      },
  }).then(res => res.json()).then(res => {
    console.log("res:",res);
    const imageBlob = res.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    //setImg(imageObjectURL);
    console.log(imageBlob);
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
          <Button title='Search' onPress={()=>{getReceiptsByStore(); getStores();}}></Button> 
          {!found && <Text>Not Found</Text>}
          {!found && <Button title='Go Back' onPress={()=>{setJsonData(original);}}/>}
          {found && <DataTable >
        <DataTable.Header>
          <DataTable.Title></DataTable.Title>
          <DataTable.Title>Total Amount</DataTable.Title>
          <DataTable.Title>Store</DataTable.Title>
          <DataTable.Title>Date</DataTable.Title>
          <DataTable.Title>Receipt Name</DataTable.Title>
        </DataTable.Header>
        {found && Object.values(JsonData).map((account)=>(
          <DataTable.Row style={{alignContent:'center', alignItems:'center'}} key={account._id}>
            <DataTable.Cell style={{backgroundColor: 'aqua'}} onPress={()=>{getImg(account._id);}}>Show</DataTable.Cell>
            <DataTable.Cell>{account.total_price}$</DataTable.Cell>
            <DataTable.Cell>{account.market}</DataTable.Cell>
            <DataTable.Cell>{account.date_of_receipt}</DataTable.Cell>
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
        placeholder={'Search Receipt'}/>   
      <Button title='Search' onPress={()=>{getReceiptsByStore();}}></Button> 
      <Text>Loading...</Text>
      </View>

  )
}
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
  },
  input: {
    width: 250,
    height: 44,
    padding: 10,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#e8e8e8'
  },
});

export default MyReceiptsScreen
