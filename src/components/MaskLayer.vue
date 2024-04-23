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

const imageArray = new Uint8Array(mockMaskArray)

function renderMask(sourceArray: Uint8Array, threshold: number) {
  if (!layer.value) return
  const canvas = layer.value
  const ctx = canvas.getContext("2d")
  ctx?.clearRect(0, 0, canvas.width, canvas.height)
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
  renderMask(imageArray, props.threshold)
})

onMounted(() => {
  renderMask(imageArray, props.threshold)
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
