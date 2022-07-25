// get id of user and all his receipts
 async function getIdandReceipts() {
    try {
      const value = await AsyncStorage.getItem('userId')
      if(value !== null) {
        setuserKey(value);
        getAllReceipts(value);
        getStores(value);
      }
    } catch(e) {
      console.log(e);
      // error reading value
    }
  }
    
   async function searchName(s) {
      fetch(`http://${route.params.url}/scan_receipt_controller/get_receipt_by_name`, {
          method: 'GET',
          headers: {
              'content-type': 'aplication/json',
              'user-key': userKey,
              'name_search' : s,
          },
      }).then(res => res.json()).then(data => {
        setJsonData(data);
        setisLoading(false);
        setFilter(true);
    });
  }

  async function getStores (val){
    fetch(`http://${route.params.url}/scan_receipt_controller/get_markets`, {
        method: 'GET',
        headers: {
            'content-type': 'aplication/json',
            'user-key': val,
        },
    }).then(res => res.json()).then(data => {
      setStores(data);
  });
}

async function getReceiptsByStore (val){
  fetch(`http://${route.params.url}/scan_receipt_controller/get_receipt_by_market`, {
      method: 'GET',
      headers: {
          'content-type': 'aplication/json',
          'user-key': userKey,
          'market' : val
      },
  }).then(res => res.json()).then(data => {
    setJsonData(data);
    setisLoading(false);
    setFilter(true);
});
}

async function getAllReceipts  (val){
  fetch(`http://${route.params.url}/scan_receipt_controller/get_all_receipts_user`, {
      method: 'GET',
      headers: {
          'content-type': 'aplication/json',
          'user_key' : val,
      },}).then(res=>res.json()).then(data => 
      {
    setOriginal(data);
    setJsonData(data);
    setisLoading(false);    
});
}

async function getImg  (uri) {
  navigation.navigate("ScanedImage", {uri})

}

async function trashReceipt  (val) {
      delete JsonData[val]
      setUpdateScreen(!updateScreen)   
      fetch(`http://${route.params.url}/scan_receipt_controller/delete_receipt`, {
        method: 'DELETE',
        body: JSON.stringify({
          'user_key': userKey,
          '_id' : val,
      }),
      headers: {
        'content-type': 'aplication/json',
      },
    }).then(res => res.text()).then(data => {
      if (data=='True'){
        setJsonData(JsonData);
    }
});
}

export default {trashReceipt,getImg,getAllReceipts,getReceiptsByStore,getStores,searchName,getIdandReceipts}