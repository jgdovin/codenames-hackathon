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

export const playerOnCurrentTeamAndNoSpymaster = (state: any, color: string, userId: string) => {
  return state?.context[`${color}Team`]?.includes(userId) && !state.context[`${color}Spymaster`];
}