'use client'
import { ReactNode, ReactPropTypes, createContext } from 'react';
import { useInterpret } from '@xstate/react';
import { gameMachine } from '@/lib/state/gameMachine';
import { InterpreterFrom } from 'xstate';

type GlobalState = {
  gameService: InterpreterFrom<typeof gameMachine>;
};

export const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

export const GlobalStateProvider = (props: { children: ReactNode }) => {
  const gameService = useInterpret(gameMachine);

  return (
    <GlobalStateContext.Provider value={{ gameService }}>
      {props.children}
    </GlobalStateContext.Provider>
  );
};