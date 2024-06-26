<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as cornerstone from "@cornerstonejs/core";
import { useEventListener } from "./hooks/event";
import {
  initDemo,
  updateViewportTransform,
  resetCamera,
} from "./utils/helpers";
import { imageId } from "./utils/constant";
import { getViewportCurrentImageIdIndex } from "./utils/helpers";
import MaskLayer from "./components/MaskLayer.vue";

const defaultZoom = 1 / 1.1;

const el = ref<HTMLDivElement>();
const transform = ref({ pan: [0, 0], zoom: defaultZoom });
const threshold = ref(500);
const opacity = ref(0.5);

useEventListener(el, cornerstone.EVENTS.CAMERA_MODIFIED, () => {
  updateViewportTransform(transform);
});

useEventListener(el, cornerstone.EVENTS.STACK_NEW_IMAGE, () => {
  console.log("currentImageIdIndex:", getViewportCurrentImageIdIndex());
});

onMounted(() => {
  if (el.value) {
    initDemo(el.value, [imageId]);
  }
});
</script>

<template>
  <main>
    <h1>Vue Cornerstone3D mask threshold</h1>
    <div class="container">
      <MaskLayer
        :pan="transform.pan"
        :zoom="transform.zoom"
        :threshold="threshold"
        :opacity="opacity"
      />
      <div class="viewer" ref="el" @contextmenu="$event.preventDefault()"></div>
    </div>
    <p>
      <button @click="resetCamera">Reset Camera</button> |
      <input
        type="range"
        v-model.number="opacity"
        min="0"
        max="1"
        step="0.01"
      />
      Opacity: {{ opacity.toFixed(2) }} |
      <input
        type="range"
        v-model.number="threshold"
        min="0"
        max="1000"
        step="1"
      />
      Threshold: {{ threshold }}
    </p>
    <p>
      Left Mouse Button: Pan | Right Mouse Button: Zoom | Mask Zoom:
      {{ transform.zoom.toFixed(2) }} | Mask Pan: [x:
      {{ transform.pan[0].toFixed(2) }}, y: {{ transform.pan[1].toFixed(2) }}]
    </p>
    <p>
      <a href="https://github.com/ChienChihYeh/vue-cornerstone-threshold"
        >GitHub Repository</a
      >
    </p>
  </main>
</template>

<style scoped>
.container {
  position: relative;
  width: max-content;
  overflow: hidden;
}

input {
  vertical-align: text-top;
}
</style>
