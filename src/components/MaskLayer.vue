<script setup lang="ts">
import { ref, watchEffect, onMounted } from "vue"
import { mockMaskArray } from "../utils/mock"

const props = defineProps<{
  pan: number[]
  zoom: number
  threshold: number
  opacity: number
}>()

const layer = ref<HTMLCanvasElement>()
const description = ref<Uint16Array>()

// implementation: watch series/slice changes and fetch new threshold description and store in ref
description.value = new Uint16Array(mockMaskArray)

// depending on the implementation, sourceArray can be all or part of the description
function renderMask(sourceArray: Uint16Array | undefined, threshold: number) {
  if (!layer.value) return
  const canvas = layer.value
  const ctx = canvas.getContext("2d")
  ctx?.clearRect(0, 0, canvas.width, canvas.height)
  if (!sourceArray) return
  const imageData = ctx?.createImageData(canvas.width, canvas.height)
  if (!imageData) return
  for (let i = 0; i < sourceArray.length; i++) {
    // Applying threshold to each pixel
    const alpha = sourceArray[i] >= threshold ? 255 : 0
    // Setting pixel data
    imageData.data[i * 4] = 0 // Red channel
    imageData.data[i * 4 + 1] = 0 // Green channel
    imageData.data[i * 4 + 2] = 255 // Blue channel
    imageData.data[i * 4 + 3] = alpha // Alpha channel
  }
  ctx?.putImageData(imageData, 0, 0)
}

watchEffect(() => {
  renderMask(description.value, props.threshold)
})

onMounted(() => {
  renderMask(description.value, props.threshold)
})
</script>
<template>
  <canvas
    willRead
    ref="layer"
    width="500"
    height="500"
    :style="{
      transform: `translate(${pan[0]}px, ${pan[1]}px) scale(${zoom})`,
      opacity: opacity,
    }"
  >
  </canvas>
</template>
<style scoped>
canvas {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none;
}
</style>
