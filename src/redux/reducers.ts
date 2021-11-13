import { Actions } from './actions'

type State = {
   currentScore : number 
   highestScore : number
}


const initialState:State = {
    currentScore : 0,
    highestScore : 0
}

const AppReducer = (state: State = initialState, action:Actions) => {

    switch(action.type) {

        case 'INCREMENT':

            return {
                currentScore : state.currentScore + 1,
                highestScore : state.highestScore
            }
        case 'RESET' : 
             return {
                currentScore : 0,
                highestScore : state.highestScore
            }
        
        case 'HIGHEST_SCORE' : 
             
            return {
                currentScore : state.currentScore,
                highestScore : action.payload     
            }       

        default:
            return state
    }
}

export default AppReducer
