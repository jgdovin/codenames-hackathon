export const isAnySpymaster = (state: any, userId: string) => {
  return isSpymaster(state, 'red', userId) || isSpymaster(state, 'blue', userId);
}
export const isSpymaster = (state: any, color: string, userId: string) => {
  return state.context[`${color}Spymaster`] === userId;
}

export const playerOnAnyTeam = (state: any, userId: string) => {
  const onRedTeam = state?.context[`redTeam`]?.includes(userId);
  const onBlueTeam = state?.context[`blueTeam`]?.includes(userId);
  const redSpymaster = state?.context[`redSpymaster`] === userId;
  const blueSpymaster = state?.context[`blueSpymaster`] === userId;
  return onRedTeam || onBlueTeam || redSpymaster || blueSpymaster;
}

export const playerOnTeam = (state: any, color: string, userId: string) => {
  return state?.context[`${color}Team`]?.includes(userId);
}

export const playerOnTeamAndNoSpymaster = (state: any, color: string, userId: string) => {
  return state?.context[`${color}Team`]?.includes(userId) && !state.context[`${color}Spymaster`];
}

export const activeTeamColor = (state: any) => {
  if (typeof state.value === 'string') {
    return state.value;
  }
  return Object.keys(state.value)[0][0] === 'r' ? 'red' : 'blue';
}

export const playerOnActiveTeam = (state: any, userId: string) => {
  return playerOnTeam(state, activeTeamColor(state), userId);
}