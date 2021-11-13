import React, { Dispatch, useEffect, useRef, useState, } from 'react';
import { StyleSheet, View, Text, Alert, FlatList } from 'react-native';
import { ParamList } from '../utils/ParamList';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SIMON_TURN, USER_TURN } from '../utils/Constant';
import { useDispatch, useSelector } from 'react-redux';
import Sound from 'react-native-sound';
import { AppReducer, Store } from '../types';
import { Actions } from '../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface Props {
  navigation: StackNavigationProp<ParamList, 'SimonSaysScreen'>,
  route: RouteProp<ParamList, 'SimonSaysScreen'>,
}

interface State {
  stepsArray: number[]
  playerTurn: boolean,
  currentStep: number,
  isStarted: boolean,
}

const initialState: State = {
  stepsArray: [],
  playerTurn: false,
  currentStep: 0,
  isStarted: false,
}

const SimonSaysScreen: React.FC<Props> = ({ navigation, route }) => {
  Sound.setCategory("Playback");
  const blueRef = useRef<TouchableOpacity>(null);
  const yellowRef = useRef<TouchableOpacity>(null);
  const redRef = useRef<TouchableOpacity>(null);
  const greenRef = useRef<TouchableOpacity>(null);

  const playerScore = useSelector<Store, AppReducer>(state => state.App)
  const scoreDispatcher = useDispatch<Dispatch<Actions>>()
  const [state, setState] = useState<State>(initialState)

  const colorsLUT =
    [
      { color: "green", colorRef: greenRef, colorSound: new Sound('green.wav') },
      { color: "blue", colorRef: blueRef, colorSound: new Sound('blue.wav') },
      { color: "yellow", colorRef: yellowRef, colorSound: new Sound('yellow.wav') },
      { color: "red", colorRef: redRef, colorSound: new Sound('red.wav') },
    ]


  useEffect(() => {
    showSimonChoose();
  }, [state.stepsArray])

  useEffect(() => {

    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('scoreTable')
        console.log("marcel" + value)
        if (value !== null) {
          let temp = JSON.parse(value)
          scoreDispatcher({ type: 'HIGHEST_SCORE', payload: temp[0].score })
        }
        else {
          scoreDispatcher({ type: 'HIGHEST_SCORE', payload: 0 })
        }

      } catch (e) {
        Alert.alert("can't load the scoreTable" + e)
      }
    }

    getData()

  }, [])

  useEffect(() => {

    const checkLastStep = async () => {
      if (state.isStarted && state.currentStep === state.stepsArray.length) {
        setState(prevState => ({ ...prevState, playerTurn: false }))
        scoreDispatcher({ type: "INCREMENT" })
        await new Promise(resolve => setTimeout(resolve, 1000));

        simonTurn();
      }

    }
    checkLastStep();
  }, [state.currentStep])

  const isCorrectPress = (sequence: number) => {
    colorsLUT[sequence].colorSound.play()

    if (state.stepsArray[state.currentStep] !== sequence && state.isStarted) {
      navigation.push("EnterNamePopup", {})
      setState(initialState)
    }

    else {
      setState(prevState => ({ ...prevState, currentStep: state.currentStep + 1 }))
    }
  }

  const simonTurn = async () => {
    setState(prevState => ({
      ...prevState,
      playerTurn: false,
      stepsArray: [...state.stepsArray, Math.floor(Math.random() * 4)],
    }))

  }

  const showSimonChoose = async () => {
    console.log(state.stepsArray)

    for (var i = 0; i < state.stepsArray.length; ++i) {
      colorsLUT[state.stepsArray[i]].colorRef.current?.setOpacityTo(0.1, 1000);
      await new Promise(resolve => setTimeout(resolve, 1000));
      colorsLUT[state.stepsArray[i]].colorRef.current?.setOpacityTo(1, 1000);
      colorsLUT[state.stepsArray[i]].colorSound.play()
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setState(prevState => ({ ...prevState, currentStep: 0, playerTurn: true }))

  }

  return (
    <View style={styles.container}>
      <View style={{ height: '100%', marginTop: 20 }}>

        <TouchableOpacity style={[styles.StartButtonStyle]}
          disabled={state.isStarted}
          onPress={() => {
            setState(prevState => ({ ...prevState, isStarted: true }))
            simonTurn()

          }}>
          <Text style={styles.TopText}>{!state.isStarted ? "Start" : state.playerTurn ? "Your turn" : "Simon say..."}</Text>
        </TouchableOpacity>

        <View style={{ height: 280 }}>
          <FlatList
            numColumns={2}
            data={colorsLUT}
            keyExtractor={item => item.color}
            style={styles.FlatListStyle}

            renderItem={({ item, index }) => (
              <TouchableOpacity
                ref={item.colorRef}
                disabled={!state.playerTurn}
                style={[styles.ButtonStyle, { backgroundColor: item.color }]}
                onPress={() => isCorrectPress(index)}>
              </TouchableOpacity>
            )} />
        </View>

        <Text style={styles.ScoreStyle}>your score is : {playerScore.currentScore + "\n\n"}
          {playerScore.currentScore <= playerScore.highestScore ? "Highest score : " + playerScore.highestScore : "RULE BREAKER!!!"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f5d069',
    height: '100%',
  },
  StartButtonStyle: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#534f9c',
    width: "80%",
    paddingVertical: 20,
    borderRadius: 20,
    alignSelf: 'center'
  },
  ButtonStyle: {
    height: 100,
    width: 100,
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 20,
  },
  ScoreStyle: {
    fontSize: 30,
    marginTop: 20,
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: '#534f9c',
    padding: 15,
    color: '#f5d069',
    textAlign: 'center'
  },
  TopText: {
    alignSelf: 'center',
    fontSize: 30,
    color: '#f5d069'
  },
  FlatListStyle: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 20
  },
});

export default SimonSaysScreen;
