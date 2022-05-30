// import React in our code
import {useEffect} from 'react';
import React from 'react';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { DataTable } from 'react-native-paper';

// import all the components we are going to use
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Button, Pressable
} from 'react-native';

// import Ionicons from '@expo/vector-icons/Ionicons';
import { AntDesign } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons';

//import React Native chart Kit for different kind of Chart
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import { useState } from 'react';
import style from 'react-native-datepicker/style';

const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('userId')
    if(value !== null) {
      console.log("getdata: ",value);
    }
  } catch(e) {
    // error reading value
  }
}

const MyBezierLineChart = () => {
  return (
    <>
      <Text style={styles.header}>Bezier Line Chart</Text>
      <LineChart
        data={{
          labels: ['January', 'February', 'March', 'April'],
          datasets: [
            {
              data: [
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
              ],
            },
          ],
        }}
        width={Dimensions.get('window').width - 16} // from react-native
        height={220}
        yAxisLabel={'Rs'}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </>
  );
};

const MyLineChart = () => {
  return (
    <>
      <Text style={styles.header}>Line Chart</Text>
      <LineChart
        data={{
          labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          datasets: [
            {
              data: [20, 45, 28, 80, 99, 43],
              strokeWidth: 2,
            },
          ],
        }}
        width={Dimensions.get('window').width - 16}
        height={220}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </>
  );
};

const MyProgressChart = () => {
  return (
    <>
      <Text style={styles.header}>Progress Chart</Text>
      <ProgressChart
        data={[0.4, 0.6, 0.8]}
        width={Dimensions.get('window').width - 16}
        height={220}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </>
  );
};

const MyBarChart = () => {
  return (
    <>
      <Text style={styles.header}>Bar Chart</Text>
      <BarChart
        data={{
          labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          datasets: [
            {
              data: [20, 45, 28, 80, 99, 43],
            },
          ],
        }}
        width={Dimensions.get('window').width - 16}
        height={220}
        yAxisLabel={'Rs'}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </>
  );
};
const MyStackedBarChart = () => {
  return (
    <>
      <StackedBarChart
        data={{
          labels: ['Test1', 'Test2'],
          legend: ['L1', 'L2', 'L3'],
          data: [
            [60, 60, 60],
            [30, 30, 60],
          ],
          barColors: ['#dfe4ea', '#ced6e0', '#a4b0be'],
        }}
        width={Dimensions.get('window').width - 16}
        height={220}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </>
  );
};

const MyPieChart = () => {
  return (
    <>
      <Text style={styles.header}>Pie Chart</Text>
      <PieChart
        data={[
          {
            name: 'Seoul',
            population: 21500000,
            color: 'rgba(131, 167, 234, 1)',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
          {
            name: 'Toronto',
            population: 2800000,
            color: '#F00',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
          {
            name: 'New York',
            population: 8538000,
            color: '#ffffff',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
          {
            name: 'Moscow',
            population: 11920000,
            color: 'rgb(0, 0, 255)',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
        ]}
        width={Dimensions.get('window').width - 16}
        height={220}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute //for the absolute number remove if you want percentage
      />
    </>
  );
};

const MyContributionGraph = () => {
  return (
    <>
      <Text style={styles.header}>Contribution Graph</Text>
      <ContributionGraph
        values={[
          {date: '2019-01-02', count: 1},
          {date: '2019-01-03', count: 2},
          {date: '2019-01-04', count: 3},
          {date: '2019-01-05', count: 4},
          {date: '2019-01-06', count: 5},
          {date: '2019-01-30', count: 2},
          {date: '2019-01-31', count: 3},
          {date: '2019-03-01', count: 2},
          {date: '2019-04-02', count: 4},
          {date: '2019-03-05', count: 2},
          {date: '2019-02-30', count: 4},
        ]}
        endDate={new Date('2019-04-01')}
        numDays={105}
        width={Dimensions.get('window').width - 16}
        height={220}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
      />
    </>
  );
};
const ExpenseAnalysisScreen = () => {
const [change, setChange] = useState(true);
const [single, setSingle] = useState(false);
const [found, setFound] = useState(false);
const [catagory, setCatagory] = useState('');
const [openTable, setOpenTable] = useState(false);
const [receiptsData, setReceiptsData] = useState(true);
const [currentMonth, setCurrentMonth] = useState('May'); 
const Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const changeMonthRight = () => {
    let curr = Months.indexOf(currentMonth);
    setCurrentMonth(Months[(curr+1)%12]);
};
const changeMonthLeft = () => {
    let curr = Months.indexOf(currentMonth);
    setCurrentMonth(Months[(curr+11)%12]);
};

useEffect(getMonthReceipts, []);

async function getMonthReceipts() {
  let userId=1;
  fetch(`http://192.168.43.254:3000/get_month_shopping_items?id=${userId}&&month=${currentMonth}`, {
      method: 'GET',
      headers: {
          'content-type': 'aplication/json',
      },
  }).then(res => res.json()).then(data => {
    if (Object.keys(data).length == 0){
      console.log("NONE");
      setSingle(false);
      setReceiptsData(false);
      setFound(false);
    }
    else if(Object.keys(data).length == 1){
      setReceiptsData(data); 
      setFound(true);
      setSingle(true);
    }
    else {
      setReceiptsData(data); 
      setFound(true);
      setSingle(false);
      console.log("in else");
      //console.log(JsonData[0].Receipt_name);
      //JsonData[JsonData.keys(JsonData)[0]] = "78";
      // JsonData[0].Receipt_name = '5';
    }
  });
  }

    return (
        <View style={{flexDirection:'column'}}>
            <View style={{display: 'flex', justifyContent: 'space-between', backgroundColor: 'aqua', flexDirection: 'row'}}>
                <AntDesign name="rightcircleo" size={24} color="black" onPress={()=> changeMonthRight()} style={styles.monthBarRight} />
                <Text style={{fontSize: 20, marginTop: 'auto', marginBottom: 'auto'}}>{currentMonth}</Text>
                <AntDesign name="leftcircleo" size={24} color="black" onPress={()=> changeMonthLeft()} style={styles.monthBarLeft} />
            </View>
            {change && <MyStackedBarChart/>}
            {!change && <MyPieChart/>}
            <View style={{display: 'flex', justifyContent: 'flex-end', backgroundColor: 'aqua', flexDirection: 'row'}}>
            {(!openTable || (openTable && catagory!='Clothing')) && <Entypo name="arrow-with-circle-down" size={24} color="black" onPress={()=>{ setOpenTable(true);setCatagory('Clothing'); }} style={{padding:10, position: 'relative'}} />}
            {(catagory=='Clothing' && openTable) &&<Entypo name="arrow-with-circle-up" size={24} color="black" onPress={()=>{setOpenTable(false);}} style={{padding:10, position: 'relative'}}/>}
                <Text style={{fontSize: 20, marginTop: 'auto', marginBottom: 'auto'}}>Clothing</Text>
            </View>
            <View style={{display: 'flex', justifyContent: 'flex-end', backgroundColor: 'aqua', flexDirection: 'row'}}>
            {(!openTable || (openTable && catagory!='Electronics')) && <Entypo name="arrow-with-circle-down" size={24} color="black" onPress={()=>{ setOpenTable(true); setCatagory('Electronics')}} style={{padding:10, position: 'relative'}} />}
            {catagory=='Electronics' && openTable && <Entypo name="arrow-with-circle-up" size={24} color="black" onPress={()=>{setOpenTable(false);}} style={{padding:10, position: 'relative'}}/>}
                <Text style={{fontSize: 20, marginTop: 'auto', marginBottom: 'auto'}}>Electronics</Text>
            </View>
            {found && openTable && <DataTable >
              <DataTable.Header>
                <DataTable.Title></DataTable.Title>
                <DataTable.Title>Total Amount</DataTable.Title>
                <DataTable.Title>Store</DataTable.Title>
                <DataTable.Title>Date</DataTable.Title>
                <DataTable.Title>Receipt Name</DataTable.Title>
              </DataTable.Header>

        {single &&  <DataTable.Row style={{alignContent:'center', alignItems:'center'}}>
            <DataTable.Cell style={{backgroundColor: 'aqua'}} onPress={()=>{getReceipts();}}>Show</DataTable.Cell>
            <DataTable.Cell>{receiptsData[0].Total_amount}</DataTable.Cell>
            <DataTable.Cell>{receiptsData[0].Store_name}</DataTable.Cell>
            <DataTable.Cell>{receiptsData[0].Date}</DataTable.Cell>
            <DataTable.Cell>{receiptsData[0].Receipt_name}</DataTable.Cell>
        </DataTable.Row>}
        {!single &&  receiptsData.map((account, key)=>( account.Catagory==catagory &&
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
            <Pressable style={{borderRadius:50, backgroundColor:'red', justifyContent: 'center', width: 100, height: 100
                    ,elevation:5}} onPress={()=>setChange(!change)}>
                <Text style={{textAlign: 'center'}}>Change</Text>
            </Pressable>
        </View>
    )
}

export default ExpenseAnalysisScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: 10,
    },
    containerHeader: {
        flex: 1,
        backgroundColor: 'red',
        textAlign: 'center',
        padding: 10,
      },
    header: {
      textAlign: 'center',
      fontSize: 18,
      padding: 16,
      marginTop: 16,
    },
    monthBarRight: {
        position: 'relative',
        padding: 10,
    },
    monthBarLeft: {
        position: 'relative',
        padding: 10,
    }
  });
