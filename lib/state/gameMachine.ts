import { Assigner, EventObject, assign, createMachine } from "xstate";

export interface GameCard {
  word: string;
  team: "red" | "blue" | "neutral" | "black";
  revealed: boolean;
  color: string;
}

interface Card {
  revealed: boolean;
  word: string;
  color: string;
  team: string;
}

export interface GameContext {
  cards: Card[];
  clue: string;
  clueCount: string;
  endTurn: boolean;
  cluesLeft: number;
  redteamCardsRemaining: number;
  blueteamCardsRemaining: number;
  players: { [userId: string]: string };
  redTeam: string[];
  blueTeam: string[];
  redSpymaster: string;
  blueSpymaster: string;
}

export interface JoinEvent {
  type: "join.team";
  payload: string;
}
export const gameMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAYgCsB7AgOgBcx1UBtABgF1FQAHC2XW3BXycQAD0QAOAKwA2agBYZEgOwBGFgE4pAJmXapEgDQgAnonXLqWgMyrVEljPUtlE+QF93xtFjyFSlDSwXCYYsPQATqwcSCA8fAJCIuIIEtaWiprWGtqq6RrK8sZmCKrant4YOATE1AA2FABGjSYk4egRtNRQjGDRIvH8gsKxKaqy1Lba8hrjMvLKUjpSxYgyUizU2tbysjMbEtoaEhUgPtX+9U0tbbQdXT2ofaox3LxDSaPmE1MzcwtLfSrUqODTUKTZezabQydbKFjlLxnKp+WoRSD0RjUYKhdDhMAREhQXAANzA1EwdQArn12AN3okRqAUk5rNQWOMpFotC4CtpgYU2SwXCo9DNctDTudUURqOiIJjUN0abA+PgoCR0WT0HUKR0IP1YoNGck1iwJNRVIVZBIZDkHBINMCylJLPoNAVYdNrNYpSiarL5YrlXA1RqtQxdZh9UwXvSEsNTQhZqoFA5ofJbMsZMpndZXdQ0qpM7odLNpn7fAG5RiGEqoCqw20qY1UPxsVSoDBwsNDW8E59mYhXGzFsplOtrDJdKotAKrVY3DpYVO-ickdLq0G6yHVQQNWB8BBd2G+3EGYmviC1NRlDtrNpHD7VLCjKZh9JJlz5LprCx5Ai5qVhcaK1liDahvuRK9NQFBklEdJGheg5iGsubvqUCzyOykIyH+LCuneHgbv6lyNNSYDBjiYSRESpLkpSNJnsal5DqU2RstO8gSIcRwaLYsLAjkbIGDILDZFouR2uulRVmRFHBhBe7qpqYDalGMaIf2HxMqhpSyNo7JSIo+hOPxaTAtIbLqBoCx2Hewq+iRcm1ORNKKY2UGwC2bZdN5XZwIyzHIbpYwQthhQenkaQ-j+KwYem1BibZ8izroHILMBMrUG5lE7kpTaHseBX7sFA6heY0KWCo3F2sctUPs6BFghCswGBytjjsoWXVrlHmQSpjzknBBJlTpSaus6OjYa1aX6FaThSD1lxDSNhLtJ0sHwWNJpXlawKPhaGiONsTjQhyNqeEi+AUBAcAiJu-jxuNV4ALS2M6uQKCdOz-lOXoaMttQNM0JTabtbELE1XKWvM4wuBySguEDgZgagz0Q3pmbYTCBnCi+JYyMCBhstxuyaIo0mOCjNYKju1F4pEGOsVjhxbOs074-MD5ExhE5yNs8gLIj+bI85IGo3T4GeeqzMoSkhybNojr4+dPJOnzd5pkLBi2o66iqDTfV1nLFWlLk2E1baHpuLajUYa+lpZCoxYG8ZRsKfTIQ0QSptJmU06FoU1v1Xb-IYbZcgSC6bj5hoOZaB77n5TLUB+3trqpsrdgzHa0yFEJxnstOBjCQBNk06t8Hp2xj5yJFBQ8eMqX8fFJTFnolqOrkhyOgJMhXe4QA */
    predictableActionArguments: true,
    initial: "lobby",
    schema: {
      context: {} as GameContext,
    },
    context: {
      cards: [],
      clue: "",
      clueCount: '0',
      redteamCardsRemaining: 0,
      blueteamCardsRemaining: 0,
      players: {},
      redTeam: [],
      blueTeam: [],
      endTurn: false,
      cluesLeft: 0,
      redSpymaster: "",
      blueSpymaster: "",
    },
    on: {
      "join.team": {
        actions: "joinTeam",
      },
      "join.spymaster": {
        actions: "joinSpymaster",
      },
    },
    states: {
      lobby: {
        on: {
          "start.game": [
            {
              target: "redteam",
              cond: "startingTeamRed",
            },
            "blueteam",
          ],
        },
      },
      redteam: {
        always: [
          {
            cond: 'gameOver',
            target: 'gameover'
          },
          {
            cond: 'shouldEndTurn',
            target: 'blueteam'
          }
        ],
        entry: ["resetTurn"],
        states: {
          spymaster: {
            on: {
              "give.clue": {
                actions: "submitClue",
                target: "guessing"
              },
            },
          },
          guessing: {
            on: {
              "reveal.card": {
                actions: 'revealCard',
                target: "guessing",
              },
              "submit.suggestion": "guessing",
              "end.guessing": "#(machine).blueteam",
              "game.over": "#(machine).gameover",
            },
          },
        },
        initial: "spymaster",
      },
      blueteam: {
        always: [
          {
            cond: 'gameOver',
            target: 'gameover'
          },
          {
            cond: 'shouldEndTurn',
            target: 'redteam'
          }
        ],
        entry: ["resetTurn"],
        states: {
          spymaster: {
            on: {
              "give.clue": {
                actions: "submitClue",
                target: "guessing",
              },
            },
          },

          guessing: {
            on: {
              "reveal.card": {
                actions: 'revealCard',
                target: "guessing",
              },
              "submit.suggestion": "guessing",
              "end.guessing": "#(machine).redteam",
              "game.over": "#(machine).gameover",
            },
          },
        },
        initial: "spymaster",
      },
      gameover: {
        on: {
          "start.over": "lobby",
        },
      },
    },
  },
  {
    actions: {
      submitClue: (context, event) => {
        const { clueCount, clue } = JSON.parse(event.payload);
        context.cluesLeft = parseInt(clueCount) ? parseInt(clueCount) + 1 : 9;
        context.clueCount = clueCount;
        context.clue = clue;
      },
      resetTurn: (context, event) => {
        context.clueCount = '0';
        context.clue = "";
      },
      revealCard: (context, event) => {
        const { activeColor, id } = JSON.parse(event.payload);

        const cardColor = context.cards[id].team;
        if (context.cards[id].revealed) return;

        context.cluesLeft -= 1;
        const teamDesignation = `${cardColor}teamCardsRemaining` as 'redteamCardsRemaining' | 'blueteamCardsRemaining';
        if (context[teamDesignation] && context[teamDesignation] > 0) {
          context[teamDesignation] -= 1;
        }
        console.log('after', context.cluesLeft)
        if (context.cluesLeft <= 0 || cardColor !== activeColor) context.endTurn = true;
        context.cards[id].revealed = true;
      },
      joinTeam: (context, event) => {
        const user = JSON.parse(event.user);

        if (!context.players[user.userId]) {
          context.players[user.userId] = user.nickname;
        }
        switch (event.payload) {
          case "red":
            if (context.redTeam.includes(user.userId)) break;

            context.blueTeam = context.blueTeam.filter(
              (player) => player !== user.userId
            );
            context.redTeam.push(user.userId);
            break;
          case "blue":
            if (context.blueTeam.includes(user.userId)) break;

            context.redTeam = context.redTeam.filter(
              (player) => player !== user.userId
            );
            context.blueTeam.push(user.userId);
            break;
        }
      },
      joinSpymaster: (context, event) => {
        const user = JSON.parse(event.user);

        if (!context.players[user.userId]) {
          context.players[user.userId] = user.nickname;
        }

        context.blueTeam = context.blueTeam.filter(
          (player) => player !== user.userId
        );
        context.redTeam = context.redTeam.filter(
          (player) => player !== user.userId
        );

        switch (event.payload) {
          case "red":
            context.redSpymaster = user.userId;
            break;
          case "blue":
            context.blueSpymaster = user.userId;
            break;
        }
      }
    },
    guards: {
      startingTeamRed: (context) => {
        return context.redteamCardsRemaining > context.blueteamCardsRemaining;
      },
      gameOver: (context) => {
        const blackRevealed = context.cards.reduce((val, card) => {
          if (card.team === 'black' && card.revealed) return true;
          return val;
        }, false)
        return blackRevealed || context.redteamCardsRemaining === 0 || context.blueteamCardsRemaining === 0;
      },
      shouldEndTurn: (context) => {
        const willEnd = context.endTurn || (context.clue !== '' && context.cluesLeft === 0);
        if (willEnd) {
          context.endTurn = false;
          context.clue = '';
        }

        return willEnd;
      }
    },
  }
);
