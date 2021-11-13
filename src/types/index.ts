export interface AppReducer {
    currentScore : number 
    highestScore : number 
}

export interface Store {
    App : AppReducer
}

export interface UserScore {
    score : number ,
    name : string ,
}