export interface IncrementScore {

    readonly type: 'INCREMENT'
}

export interface ResetScore {

    readonly type: 'RESET'
}

export interface HighestScore {

    readonly type: 'HIGHEST_SCORE'
    payload : number 
}

export type Actions = | IncrementScore | ResetScore | HighestScore 