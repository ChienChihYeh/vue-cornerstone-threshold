const maskArray = []

for (let i = 0; i < 500; i++) {
  for (let j = 0; j < 500; j++) {
    const pixelThreshold = Math.floor(Math.random() * 100)
    maskArray.push(pixelThreshold)
  }
}

export const mockMaskArray = maskArray
