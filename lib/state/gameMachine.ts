import { createMachine } from 'xstate';

export const gameMachine = createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgBsB7AIyoE8BiWAF3QCcmSp1UwBtABgC6iUAAcKsXE1wV8IkAA9EAJgCs-EgDYAHABZtAdn6bNARgOnT-VQBoQtFQGZlJU9u2OAnOtW7HBgwBfQLs0LDxCUkoaBmY2Di4eXlNhJBBxSWlZeSUENQ0dfSMTc0trOwcENxdHTWVPU1UDbW9jWuDQjBwCYhJWSCYwbhJYUVoMZjBWeihcADcwEkwyAFc+IXkMqRk5NNzlfxIDR1VNfV9lfg9NW3tET20XVUc9bUs-A08rjpAw7si+gMhqhOGtYJJ8FBGCsqKgpKC4LABKkxBJttk9oh-J5XL5tJp+PxPLpVMTiRV7qYXLp+LoCWcDpdDD8-hFev0IINhlAwRCoQRMBRWP1MAlecjNmisrtQLkCdpXJ5mpZTCT+JdHBSEJ4ziQ2s5Pud+AZlCyumzSByuSCeYiCFDYDC4RxHVAYMwdhK0ltpTksQSSKplNpVKrlGZ3Motfins0dUYmadtGbwj1LUDubz7fQwPgICQmCtWPgvajMjs-Qh5Yrle91BqtVZTI4SO4WppjuoQ8SU-92RmbVnITNuIsKAtWKX0lKK5iq1ca286+r+Jq7lV6gq3o5LAdjPpPL2LSQqKswNaRmMJoNprMFksz1OfbPZfcSa5rCSXnplIbG7SNH0BkHmMWlDxCX5zTTE8zwvW1wWzQVhTAUUEXBJ8ZwxV8qiuVRXGOTwmXcXDTH-RpW34Uw6k0BoSWeIIINZaDTzWOCh35fAkJFMVEQw8ssMURBq1MJUl1VetV0bcwFRpWkgwMXRf2JTQj2Y2DgTQvloVheFXXdaU+PRGVBJwjtWwefRiNJEktR1PClTMXQDDOHUPFNRioIBFjzw0+CtNzfNC2LQzfTnAIcVqByvj0G5fy1MxND1ZsGhOB41DUVSvPUzM7WHRIxwnEKXxM5tyNOAJKKuN5dG8f8LFbWoPGsj4GM6VMAXy8cpkYFh2BILrJw2b1MOM3ITS1Gq8IJSxHB3ZyripVRggg-AKAgOB5CYyJJX40bEAAWk0Wy8NXTwzvOi6Q0y3pojoHajMrRTG3xEhajcbRCV8XRzCWjz2v7TlgXu0LsNJLUTRk8MaJpS5FPaP6+3TQHhlGcZ0EmVhgeK3IrAMf9rBIPwrFUN51WUKjrqRtjcqgLGBNyLxEosM6nLOElPH8NdKibFwOw58wbjpJzfraxGYNYoHht2ytnMSyLnOiul5OjHdWwOCwDGeZxHFpSnxZ8lGr3Rm86b2hBqtemiFauJW4vXKxNBbbFCQ7NmFMcPXvOphDIVNysyl0PUWkMB53BEuqCl-KGdxo6xWsg-7SE6ic-bncTA8dsmiVVOo3jqwP1CKGjIxJhjgiAA */
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
            entry: ['resetGame'],
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
                            actions: (context, event) => { context.clue = event.value; },
                            target: 'guessing'
                        }
                    }
                },
                "guessing": {
                    on: {
                        'submit.guess': {
                            actions: (context, event) => { console.log(context, event) },
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
                            actions: (context, event) => { context.clue = event.value; },
                            target: 'guessing'
                        }
                    }
                },

                guessing: {
                    on: {
                        'correct.guess': 'guessing',
                        'incorrect.guess': '#(machine).redteam',
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
        resetGame: (context, event) => {
            // TODO: generate cards
            context.cards = [];
            context.redteamCardsRemaining = Math.random() > 0.5 ? 9 : 8;
            context.blueteamCardsRemaining = 17 - context.redteamCardsRemaining;
        },
        resetTurn: (context, event) => {
            context.clue = '';
        }
    },
    guards: {
        startingTeamRed: (context) => {
            console.log(context.redteamCardsRemaining, context.blueteamCardsRemaining)
            return context.redteamCardsRemaining > context.blueteamCardsRemaining;
        },
    }
});
