const maskArray = []
const size = 500
const maxThreshold = 1000

for (let i = 0; i < size; i++) {
  for (let j = 0; j < size; j++) {
    const pixelThreshold = Math.floor(Math.random() * maxThreshold)
    maskArray.push(pixelThreshold)
  }
}

export const mockMaskArray = maskArray
