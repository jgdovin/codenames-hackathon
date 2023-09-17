import { ReactNode } from 'react';
import { createMachine } from 'xstate';
import { playerIsOnTeam } from '../user';

export interface GameCard {
  word: string;
  team: 'red' | 'blue' | 'neutral' | 'black';
  revealed: boolean;
  color: string;
  votes: Array<string>;
}

interface Card {
  revealed: boolean;
  word: string;
  color: string;
  team: string;
}

export interface GameContext {
  cards: GameCard[];
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
  gameLog: ReactNode[];
  winner: string;
}

export interface JoinEvent {
  type: 'join.team';
  payload: string;
}
export const gameMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAYgCsB7AgOgBcx1UBtABgF1FQAHC2XW3BXycQAD0QBaAEwBWACzUAnIrkB2AMwsWi+VqkAaEAE9E8gGzU5UxarMAOOXJZntUgL5vDaLHkKlKNLBcRhiw9ABOrBxIIDx8AkIi4gjSMorUsqp2OnZm6upScgCMqoYmCPYy1Ll2MqpFMupm9XLqHl4YOATE1AA2FABGA0YkYejhtNRQjGBRInH8gsIxyQ0WmnL2DVY1LAbGiEXa6Q6KR-l16hruniDeXX59g8OjtOOT06izRdHcvIuJFaHGQsDJqGQlGyOM6lA4IIqFIrUeyKMxqLTFRTtO6dXw9cKQeiMEhzGILBLLUDJHTqJRafJFZoNGFlRCOBQyQq1Jp7KzqOTY+54ojUAkQImoEk-eb-ClJRBQpTWMyNGS1Er7cpHZrVORnFh2IqKdTKKR2QW47oisUS6hBELoMJgcIkKC4ABuYGomF6AFdZuwZfElvKKgilIopCUGoyVVJNYdnOkWCainYDXUZJyLT4raLCQxUFN-bA+PgoCQCZ70L1veMIKS-sHAVTEKo6sjOeojvU0QVYeVlHZqN2pGYinI0kVu3Ybh1c48bYXi3AyxX3RR6HXwg3A2TZSGgQhbFJkf3si47KonOpWQhFCwkbUVHkNLlNljbkK80vGCvSwQFa+vgABqm5epg9aNrEB4tmIbbyNQRTRte45ZjIZgJgg6ZVE4eQInYz7tqoOYPPiBZ-lAJZriQYD4BA-5rtB5KHq297XkqqKquqqhYch066vqFwaBoMikcK+bisuVGroBrozNQFCepEe5NgClLwfeiGGlI6i5GcBTWHenLpIUM4OHpJQpuJeYDH6YASiSqkwc2GmrE4GSKLOqiolkWYNHeWS0rkBrISo8iOG0X6Wo8dn+o5TDSvurmhtOemWK0Vw+fGZqTneyFqkoqihRChRvmJ0ULj0cUOcu9qhBEroehB9nMbBbmHOoiEsI09SlZyrRFHeV6nt2E6OPYaLqjZsX2baMkAeWlZgNWtaQTubUpUeE5edQ9R6XsZppmqt5wumSJqnIV4OFIewQkUM3VXN0nUXJG5butu6-C56mpSCtJmCoR0lMUKp2IFPVId2vHts0aqPSKNXza9S3AWBH1Qc5LFwe5OhIVkZiE2m2iGgOiCXsifm2C0D7ZAj1BIy9slLXRDELUxWPtaGqIKJGXFdTxWEYekaxji4BQC2Y9OM5RKMVp8XpKc6m2-dtmxKBZBr6l5fV3oTCjOI+-JGvyermpVZEigrSsumMEyKcpKtyttw4qiajSMnss65GTCDgsishjiU9S2F5UW3PgFAQHAIjfn4Qaq2x0jpPyLibHYJoh2ld5dao1C8rkdRmlkhH0-0QzlGpztsbpShGq06EzimMh3jopnjk4EIGoR-L07+qAJ9XmmtAohRDoaj6E7ILdws0oIPphOi6VIPnWRbEn93awQNc6g+scPs5guPRyxtP+WuNQEJ1JC6ZXpsfcUUW7OAXvONtoT1TXjk07FBm5-KHtFUtgIommyFFeclsGbPUYK-Dq8IShVDGiddsxtFB3jUAoEotQ0jOA1E0aW0Ciz1UdBEWBqV4y0iQRnFBmJhp4xLimPSJlrgEPikzRaUAyHbRBHnY0aJiJRmQs0VuKZ84HWsCvCR8Z6bW2UlwmuqJ868ghJGFMeo5DGQwsiK6agrwnT1B4DwQA */
    predictableActionArguments: true,
    initial: 'lobby',
    schema: {
      context: {} as GameContext,
    },
    context: {
      cards: [],
      clue: '',
      clueCount: '0',
      redteamCardsRemaining: 0,
      blueteamCardsRemaining: 0,
      players: {},
      redTeam: [],
      blueTeam: [],
      endTurn: false,
      cluesLeft: 0,
      redSpymaster: '',
      blueSpymaster: '',
      gameLog: [],
      winner: '',
    },
    on: {
      'join.team': {
        actions: 'joinTeam',
      },
      'join.spymaster': {
        actions: 'joinSpymaster',
      },
    },
    states: {
      lobby: {
        on: {
          'start.game': [
            {
              target: 'redteam',
              cond: 'startingTeamRed',
            },
            'blueteam',
          ],
        },
      },
      redteam: {
        always: [
          {
            cond: 'gameOver',
            target: 'gameover',
          },
          {
            cond: 'shouldEndTurn',
            target: 'blueteam',
          },
        ],
        entry: ['resetTurn'],
        states: {
          spymaster: {
            on: {
              'give.clue': {
                actions: 'submitClue',
                target: 'guessing',
              },
            },
          },
          guessing: {
            on: {
              'reveal.card': {
                actions: 'revealCard',
                target: 'guessing',
              },
              'vote.card': {
                actions: 'voteCard',
                target: 'guessing',
              },
              'unVote.card': {
                actions: 'unVoteCard',
                target: 'guessing',
              },
              'end.guessing': {
                actions: 'endGuessing',
                target: '#(machine).blueteam'
              },
              'game.over': '#(machine).gameover',
            },
          },
        },
        initial: 'spymaster',
      },
      blueteam: {
        always: [
          {
            cond: 'gameOver',
            target: 'gameover',
          },
          {
            cond: 'shouldEndTurn',
            target: 'redteam',
          },
        ],
        entry: ['resetTurn'],
        states: {
          spymaster: {
            on: {
              'give.clue': {
                actions: 'submitClue',
                target: 'guessing',
              },
            },
          },

          guessing: {
            on: {
              'reveal.card': {
                actions: 'revealCard',
                target: 'guessing',
              },
              'vote.card': {
                actions: 'voteCard',
                target: 'guessing',
              },
              'unVote.card': {
                actions: 'unVoteCard',
                target: 'guessing',
              },
              'end.guessing': {
                actions: 'endGuessing',
                target: '#(machine).redteam'
              },
              'game.over': '#(machine).gameover',
            },
          },
        },
        initial: 'spymaster',
      },
      gameover: {
        entry: ['resetTurn', 'setWinner'],
        on: {
          'start.over': 'lobby',
        },
      },
    },
  },
  {
    actions: {
      submitClue: (context, event) => {
        const { clueCount, clue } = JSON.parse(event.payload);
        const { userId } = JSON.parse(event.user);

        const message = `${context.players[userId]} gave the clue ${clue} for ${clueCount}`;
        // weird bug where this is being triggered on end guessing.
        // TODO: look into this.. this is merely a bandaid..

        if (context.gameLog[0] !== message)
          context.gameLog = [message, ...context.gameLog];

        context.cluesLeft = parseInt(clueCount) ? parseInt(clueCount) + 1 : 9;
        context.clueCount = clueCount;
        context.clue = clue;
      },
      resetTurn: (context, event) => {
        context.clueCount = '0';
        context.clue = '';
        context.cards = context.cards.map((card) => {
          card.votes = [];
          return card;
        });
      },
      voteCard: (context, event) => {
        const { cardId, userId } = JSON.parse(event.payload);

        const index = context.cards[cardId].votes.indexOf(userId);

        if (index === -1) {
          context.cards[cardId].votes.push(userId);
        }
      },
      unVoteCard: (context, event) => {
        const { cardId, userId } = JSON.parse(event.payload);

        const index = context.cards[cardId].votes.indexOf(userId);

        if (index !== -1) {
          context.cards[cardId].votes.splice(index, 1);
        }
      },
      revealCard: (context, event) => {
        const { activeColor, id } = JSON.parse(event.payload);
        const { userId } = JSON.parse(event.user);

        const cardColor = context.cards[id].team;
        if (context.cards[id].revealed) return;

        context.cluesLeft -= 1;

        context.gameLog = [`${context.players[userId]} revealed ${context.cards[id].word}`, ...context.gameLog];
        if (cardColor === 'black') {
          context.winner = playerIsOnTeam({context}, 'red', userId) ? 'blue' : 'red';
        }
        const teamDesignation = `${cardColor}teamCardsRemaining` as
          | 'redteamCardsRemaining'
          | 'blueteamCardsRemaining';
        if (context[teamDesignation] && context[teamDesignation] > 0) {
          context[teamDesignation] -= 1;
        }

        if (context.cluesLeft <= 0 || cardColor !== activeColor)
          context.endTurn = true;
        context.cards[id].revealed = true;
      },
      joinTeam: (context, event) => {
        const user = JSON.parse(event.user);

        if (!context.players[user.userId]) {
          context.players[user.userId] = user.nickname;
        }
        switch (event.payload) {
          case 'red':
            if (context.redTeam.includes(user.userId)) break;

            context.blueTeam = context.blueTeam.filter(
              (player) => player !== user.userId
            );
            context.redTeam.push(user.userId);
            break;
          case 'blue':
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
          case 'red':
            context.redSpymaster = user.userId;
            break;
          case 'blue':
            context.blueSpymaster = user.userId;
            break;
        }
      },
      setWinner: (context, event) => {
        if (context.winner) return;
        context.winner = context.redteamCardsRemaining ? 'blue' : 'red';
      },
      endGuessing: (context, event) => {
        const { userId } = JSON.parse(event.user);
        const message = `${context.players[userId]} ended their turn`;
        context.gameLog = [message, ...context.gameLog];
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
        }, false);
        return (
          blackRevealed ||
          context.redteamCardsRemaining === 0 ||
          context.blueteamCardsRemaining === 0
        );
      },
      shouldEndTurn: (context) => {
        const willEnd =
          context.endTurn || (context.clue !== '' && context.cluesLeft === 0);
        if (willEnd) {
          context.endTurn = false;
          context.clue = '';
        }
        return willEnd;
      },
    },
  }
);
