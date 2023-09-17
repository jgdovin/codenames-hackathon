export const playerIsAnySpymaster = (state: any, userId: string) => {
  return playerIsSpymaster(state, 'red', userId) || playerIsSpymaster(state, 'blue', userId);
}
export const playerIsSpymaster = (state: any, color: string, userId: string) => {
  return state.context[`${color}Spymaster`] === userId;
}

export const playerIsActiveSpymaster = (state: any, userId: string) => {
  return playerIsSpymaster(state, activeTeamColor(state), userId);
}

export const playerIsOnAnyTeam = (state: any, userId: string) => {
  const onRedTeam = state?.context[`redTeam`]?.includes(userId);
  const onBlueTeam = state?.context[`blueTeam`]?.includes(userId);
  const redSpymaster = state?.context[`redSpymaster`] === userId;
  const blueSpymaster = state?.context[`blueSpymaster`] === userId;
  return onRedTeam || onBlueTeam || redSpymaster || blueSpymaster;
}

export const playerIsOnTeam = (state: any, color: string, userId: string) => {
  console.log(state);
  return state?.context[`${color}Team`]?.includes(userId);
}

export const playerIsOnTeamAndNoSpymaster = (state: any, color: string, userId: string) => {
  return state?.context[`${color}Team`]?.includes(userId) && !state.context[`${color}Spymaster`];
}

export const activeTeamColor = (state: any) => {
  if (!state.value) return '';
  if (typeof state.value === 'string') {
    return state.value;
  }
  return Object.keys(state.value)[0][0] === 'r' ? 'red' : 'blue';
}

export const playerIsOnActiveTeam = (state: any, userId: string) => {
  return playerIsOnTeam(state, activeTeamColor(state), userId);
}

export const teamIsGuessing = (state: any) => {
  return Object.values(state.value).includes('guessing');
}