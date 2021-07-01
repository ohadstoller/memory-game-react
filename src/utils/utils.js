export default async function wait (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const colorList = ["green", "red", "yellow", "blue", "purple", "pink"];

export const initGameData = {
  isFlashing: false,
  isUserPlaying: false,
  colors: [],
  round: 0,
  userColors: [],
};

