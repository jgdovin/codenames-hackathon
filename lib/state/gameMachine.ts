import { createMachine } from 'xstate';

export interface GameCard {
    word: string;
    team: 'red' | 'blue' | 'neutral' | 'black';
    revealed: boolean;
    color: string;
}

export interface GameContext {
    cards: never[];
    clue: string;
    redteamCardsRemaining: number;
    blueteamCardsRemaining: number;
}
export const gameMachine = createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgBsB7AIyoE8BiWAF3QCcmSp1UwBtABgC6iUAAcKsXE1wV8IkAA9EAJgCs-EgDYAHABZtAdn6bNARgOnT-VQBoQtFQGZlJU9u2OAnOtW7HBgwBfQLs0LDxCUkoaBmY2Di4eXlNhJBBxSWlZeSUENQ0dfSMTc0trOwcENxdHTWVPU1UDbW9jWuDQjBwCYhJWSCYwbhJYUVoMZjBWeihcADcwEkwyAFc+IXkMqRk5NNzlfxIDR1VNfV9lfg9NW3tET20XVUc9bUs-A08rjpAw7si+gMhqhOGtYJJ8FBGCsqKgpKC4LABKkxBJttk9oh-NoSG9-KZHCdvAZThV7qYXLorvxlMoPAZNFdVD8-hFev0IINhlAwRCoQRMBRWP1MAlecjNmisrtQLlGTjTJ5mpZTLp1JdHGSEJ4ziQ2s5Pud+AZlCyumzSByuSCeYiCFDYDC4RxHVAYMwdhK0ltpTksYySKo6apVcozO5lFrtHVA80dUZLtpTtozeEepagdzefb6GB8BASEwVqx8F7UZkdn6EPLXEq3u91fxNXcqvwCbj3PGTkzPLpU-92ZmbdnITNuIsKAtWGX0lLK5jq1da8qGzSm1qKQ9cQTLAdjPpPP2LSQqKswNaRmMJoNprMFkszzOffPZfc1a5rGqXnplIaN-wqRIfQznqbRjAAw8Ql+c10xPM8L1tcEc36BZ0DIJY2AgJ85wxV8qnqTRcVOLxqk0L4kw3VUFTAh4WhpRVdCCKDWVg081gQkcoRQoZ0MwTDkhRWcK1wxREEsLdDAJTxlFMRklWUXQNy8DQQ10RiQ1pRxTCPVj4OBBEkNHR1YXhV13WlbDhJlUTW00AxcQefR3GsXtbkqHVVBIJUzEYs4dQ8U1mJggE2PPfTEL5XN80LYtSw2b0cOs3IAk8Eham88jdBuX8tTMQi2xIolHiDZkgrTEK9KzO1R0SCcp0s9EkrErTPNOAI2yuN5dG8f8LFxWoPFUXsPiYzpyt6WrJymRgWHYEgpuneLy0aqsTS1brPMZSxCXMeUKVKqD8AoCA4HkFjIklKyqwAWk0LVe1xOoGmaG4jCy0boPGqJqDoS6VoXXRIxbNxCNqNwwM-XRzFKsaBwzTlgT+30FyGrUTRxY0vgOAlaTOPsyrhwEEeGUZxnQSZWCRl8bKsAx-2sICtOsN4aRkzQdIBK1ws4qmRNyLxCIsTxewZNShv8ZtKisCktE+LSGV8M4SQ53pQutXmmoQBlQbIhlMuyumWw8UwgIZTdo2cQGYc+wm1f00nrymDWqy6tLdbIq4sqDQ2pbaNLPn4YxRcYvwVdIO2qsMqBnYXMpdD1FpDFot5PF6gpfzDTQtI9pow84ccFpjvDVV8LRHFZ-gGiyulTF6+P1CKMiI1UQxgmCIA */
    predictableActionArguments: true,
    initial: 'lobby',
    context: {
        cards: [],
        clue:'',
        redteamCardsRemaining: 0,
        blueteamCardsRemaining: 0,

    },
    states: {
        lobby: {
            on: {
                'start.game': [{
                    target: "redteam",
                    cond: "startingTeamRed"
                }, "blueteam"],
            },
        },
        redteam: {
            entry: ['resetTurn'],
            states: {
                "spymaster": {
                    on: {
                        'give.clue': {
                            actions: 'submitClue',
                            target: 'guessing'
                        }
                    }
                },
                "guessing": {
                    on: {
                        'reveal.card': {
                            // @ts-ignore
                            actions: (context, event) => { context.cards[event.value].revealed = true;} ,
                            target: 'guessing',
                        },
                        'incorrect.guess': '#(machine).blueteam',
                        'submit.suggestion': 'guessing',
                        'end.turn': '#(machine).blueteam',
                        'game.over': '#(machine).gameover'
                    }
                }
            },
            initial: 'spymaster'
        },
        blueteam: {
            entry: ['resetTurn'],
            states: {
                spymaster: {
                    on: {
                        'give.clue': {
                            actions: 'submitClue',
                            target: 'guessing'
                        }
                    }
                },

                guessing: {
                    on: {
                        'reveal.card': {
                            // @ts-ignore
                            actions: (context, event) => { context.cards[event.value].revealed = true;} ,
                            target: 'guessing',
                        },
                        'submit.suggestion': 'guessing',
                        'end.turn': "#(machine).redteam",
                        'game.over': '#(machine).gameover'
                    }
                },
            },
            initial: 'spymaster'
        },
        gameover: {
            on: {
                'start.over': 'lobby',
            }
        },
    },
},
{
    actions: {
        submitClue: (context, event) => {
            context.clue = event.value;
        },
        resetGame: (context, event) => {
            // TODO: generate cards
            context.cards = [];
            context.redteamCardsRemaining = 0;
            context.blueteamCardsRemaining = 0;
        },
        resetTurn: (context, event) => {
            context.clue = '';
        },
        revealCard: (context, event) => {
            context.clue = 'test'
        }
    },
    guards: {
        startingTeamRed: (context) => {
            console.log(context.redteamCardsRemaining, context.blueteamCardsRemaining)
            return context.redteamCardsRemaining > context.blueteamCardsRemaining;
        },
        continueTurn: (context) => {
            return true;
        }
    }
});