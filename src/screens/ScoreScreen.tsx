import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, Alert, Modal, FlatList, TouchableOpacity } from 'react-native';
import { ParamList } from '../utils/ParamList';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserScore } from '../types';
import { useDispatch } from 'react-redux';
import { Actions } from '../redux/actions';
import { Dispatch } from 'redux';

interface Props {
  navigation: StackNavigationProp<ParamList, 'ScoreScreen'>,
  route: RouteProp<ParamList, 'ScoreScreen'>,
}

const ScoreScreen: React.FC<Props> = ({ navigation, route }) => {
  const [scoreTable, setScoreTable] = React.useState<UserScore[]>([])
  const scoreDispatcher = useDispatch<Dispatch<Actions>>()



  useEffect(() => {

    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('scoreTable')
        console.log("marcel" + value)
        if (value !== null) {
          let valueParsed = JSON.parse(value);

          scoreDispatcher({ type: 'HIGHEST_SCORE', payload: valueParsed[0].score })
          setScoreTable(valueParsed)

        }
      } catch (e) {
        Alert.alert("can't load the scoreTable" + e)
      }


    }

    getData()

  }, [])

  return (
    <Modal style={styles.container}
      visible={true}
      transparent={true}
      onRequestClose={() => navigation.pop()}>
      <View style={styles.ModalStyle}>
        <View style={{ backgroundColor: '#f5d069', borderRadius: 20 }}>

          <View style={{ flexDirection: 'row', borderBottomWidth: 2, marginVertical: 20, }}>
            <Text style={{ textAlign: 'center', width: '20%' }}> rank </Text>
            <Text style={{ textAlign: 'center', width: '50%' }}>  name </Text>
            <Text style={{ textAlign: 'center', width: '30%' }}>  score</Text>
          </View>

          <FlatList
            numColumns={1}
            data={scoreTable}

            style={{ padding: 0 }}

            renderItem={({ item, index }) => (
              <View style={{ flexDirection: 'row', backgroundColor: index === 0 ? '#534f9c' : index % 2 == 0 ? '#f5d069' : '#f5bb18' }}>
                <Text style={{ textAlign: 'center', width: '20%' }}> {index + 1} </Text>
                <Text style={{ textAlign: 'center', width: '50%' }}>  {item.name} </Text>
                <Text style={{ textAlign: 'center', width: '30%' }}>  {item.score}</Text>
              </View>
            )} />

          <TouchableOpacity
            style={styles.BackButtonStyle}
            onPress={() => navigation.pop()}>
            <Text style={{ textAlign: 'center', fontSize: 30, color: '#f5d069' }}>Back to home page</Text>
          </TouchableOpacity>
        </View>
      </View>

    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    // paddingTop : 20,
  },
  ModalStyle: {
    // backgroundColor:'green',
    backgroundColor: 'rgba(52, 52, 52, 0.5)',

    paddingVertical: 150,
    paddingHorizontal: 30,
    height: "100%",
    width: "100%",
    alignSelf: 'center',
  },
  BackButtonStyle: {

    backgroundColor: '#534f9c',
    borderRadius: 15,
    width: '80%',
    // alignItems:'center',
    alignSelf: 'center',
    marginVertical: 20,
    paddingBottom: 10,

  }


});

export default ScoreScreen;
