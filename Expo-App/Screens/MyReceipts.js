import { useState, Component, useEffect } from 'react';
import { StyleSheet, TextInput, View, Button, Text } from 'react-native';
import { DataTable } from 'react-native-paper';
import  AsyncStorage  from '@react-native-async-storage/async-storage';


const MyReceiptsScreen = ({navigation, route}) => {
  const [single, setSingle]= useState(false);
  const [found, setFound]= useState(false);
  const [showSearch, setShowSearch]= useState(false);
  const [searchByName, setSearchByName] = useState('');
  const [userId, setUserId] = useState('');
  const [JsonData, setJsonData] = useState([]);
  const [original, setOriginal] = useState([]);

  useEffect(()=>{
    getId();
    }, []);
 
  // get id of user
  const getId = async () => {
    // try {
    //   const value = await AsyncStorage.getItem('userId')
    //   if(value !== null) {
    //     console.log("getdata: ",value);
    //     getReceipts(1);
    //     setUserId(value);
    //   }
    // } catch(e) {
    //   // error reading value
    // }
    setUserId(1);
    getReceipts(1);
  }

  // default receipts view -  by date
  async function getReceipts(value) {
    let user = 19;
    fetch(`http://${route.params.url}/scan_receipt_controller/get_receipt_by_date`, {
        method: 'GET',
        headers: {
            'content-type': 'aplication/json',
            'user_key': user,
        },
    }).then(res => res.json()).then(data => {
      console.log();
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
        setShowSearch(true);
        console.log("in else");
        setJsonData(JsonData);
      }
    });
    // data.forEach(obj => {
      //   Object.entries(obj).forEach(([key, value]) => {
        //     console.log(`${key} ${value}`);
        //console.log(JsonData[0].Receipt_name);
        //JsonData[JsonData.keys(JsonData)[0]] = "78";
        // JsonData[0].Receipt_name = '5';
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
      setSearchByName('');
      //let userId=getData();
      let userId=1;
      fetch(`http://${route.params.url}/scan_receipt_controller/get_receipt_by_name`, {
          method: 'GET',
          headers: {
              'content-type': 'aplication/json',
              'user-key': userId,
              'name_search' : searchByName,
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

  const getStores = ()=> {
    let userId=1;
    fetch(`http://${route.params.url}/scan_receipt_controller/get_markets`, {
        method: 'GET',
        headers: {
            'content-type': 'aplication/json',
            'user-key': {userId},
        },
    }).then(res => res.json()).then(data => {
      
  });
}

const getReceiptsByStore = ()=> {
  fetch(`http://${route.params.url}/scan_receipt_controller/get_receipt_by_market`, {
      method: 'GET',
      headers: {
          'content-type': 'aplication/json',
          'user-key': {userId},
          'market' : storeName
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

const getReceiptsByDate = ()=> {
  fetch(`http://${route.params.url}/scan_receipt_controller/get_receipt_by_date`, {
      method: 'GET',
      headers: {
          'content-type': 'aplication/json',
          'user-key': {userId},
          'from_date': fromDate,
          'to_date' : toDate,
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
            placeholder={'Search Receipt'}/>   
          <Button title='Search' onPress={()=>{searchName();}}></Button> 
          {!found && <Text>Not Found</Text>}
          {!found && <Button title='Go Back' onPress={()=>{setJsonData(original); setShowSearch(true);}}/>}
          {found && <DataTable >
        <DataTable.Header>
          <DataTable.Title></DataTable.Title>
          <DataTable.Title>Total Amount</DataTable.Title>
          <DataTable.Title>Store</DataTable.Title>
          <DataTable.Title>Date</DataTable.Title>
          <DataTable.Title>Receipt Name</DataTable.Title>
        </DataTable.Header>

        {single && !showSearch && found && <DataTable.Row style={{alignContent:'center', alignItems:'center'}}>
            <DataTable.Cell style={{backgroundColor: 'aqua'}} onPress={()=>{getReceipts();}}>Show</DataTable.Cell>
            <DataTable.Cell>{JsonData[0].Total_amount}</DataTable.Cell>
            <DataTable.Cell>{JsonData[0].Store_name}</DataTable.Cell>
            <DataTable.Cell>{JsonData[0].Date}</DataTable.Cell>
            <DataTable.Cell>{JsonData[0].Receipt_name}</DataTable.Cell>
        </DataTable.Row>}
        {showSearch && !single && found && JsonData.map((account, key)=>(
        <DataTable.Row style={{alignContent:'center', alignItems:'center'}} key={key}>
            <DataTable.Cell style={{backgroundColor: 'aqua'}} onPress={()=>{getReceipts();}}>Show</DataTable.Cell>
            <DataTable.Cell>{account.Total_amount}</DataTable.Cell>
            <DataTable.Cell>{account.Store_name}</DataTable.Cell>
            <DataTable.Cell>{account.Date}</DataTable.Cell>
            <DataTable.Cell>{account.Receipt_name}</DataTable.Cell>
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