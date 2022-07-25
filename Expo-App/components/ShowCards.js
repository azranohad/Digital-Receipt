import { View, SafeAreaView, FlatList } from 'react-native';
import { Card, SearchBar, FocusedStatusBar, Loading } from "../components";
import { COLORS } from "../constants";

export const ShowCards = ({items,trash,isReceipt,getImg,stores,searchByName,setSearchByName, 
                            getByStore, filter, setFilter,original, searchName, setJsonData,placeHolder, storesFilter})=> {

    return (
        <SafeAreaView style={{ flex: 1 }}>
        <FocusedStatusBar backgroundColor={COLORS.primary} />
        <View style={{ flex: 1 }}>
          <View style={{ zIndex: 0 }}>
            
            {items?<FlatList
              data={Object.values(items)}
              renderItem={({ item }) => <Card data={item} handlePress={()=>trash(item._id)} 
                                              date={item.date_of_receipt.slice(0,16)} price={item.total_price}
                                              receipt={isReceipt} handleGetImg={(v)=>getImg(v)}/>}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
              <SearchBar data={stores} searchByName={searchByName} setSearchByName={(val)=>setSearchByName(val)} 
                        onSearch={searchName} onSelect={(val)=>getByStore(val)} filter={filter} setFilter={setFilter}
                        original={original} setJsonData={setJsonData} placeholder={placeHolder} storesFilter={storesFilter}/>}/>
              :<></>}
          </View>
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              zIndex: -1,
            }}
          >
            <View
              style={{ height: 300, backgroundColor: COLORS.primary }} />
            <View style={{ flex: 1, backgroundColor: COLORS.white }} />
          </View>
        </View>
      </SafeAreaView>
    )
}