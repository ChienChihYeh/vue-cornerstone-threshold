import * as cornerstone from "@cornerstonejs/core";
import * as cornerstoneTools from "@cornerstonejs/tools";
import cornerstoneDICOMImageLoader from "@cornerstonejs/dicom-image-loader";
import dicomParser from "dicom-parser";
import { renderingEngineId, toolGroupId, viewportId } from "./constant";
import type { IStackViewport } from "@cornerstonejs/core/dist/types/types";
import type { Ref } from "vue";

const { ViewportType, OrientationAxis } = cornerstone.Enums;

async function initCornerstone() {
  await cornerstone.init();
  cornerstoneTools.init();

  cornerstoneDICOMImageLoader.external.cornerstone = cornerstone;
  cornerstoneDICOMImageLoader.external.dicomParser = dicomParser;

  new cornerstone.RenderingEngine(renderingEngineId);
}

async function initDemoTools() {
  cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
  cornerstoneTools.addTool(cornerstoneTools.PanTool);

  const toolGroup =
    cornerstoneTools.ToolGroupManager.createToolGroup(toolGroupId);

  toolGroup?.addTool(cornerstoneTools.ZoomTool.toolName);
  toolGroup?.addTool(cornerstoneTools.PanTool.toolName);
  toolGroup?.setToolActive(cornerstoneTools.PanTool.toolName, {
    bindings: [
      {
        mouseButton: 1,
      },
    ],
  });
  toolGroup?.setToolActive(cornerstoneTools.ZoomTool.toolName, {
    bindings: [
      {
        mouseButton: 2,
      },
    ],
  });
}

function enableElement(element: HTMLDivElement) {
  const renderingEngine = cornerstone.getRenderingEngine(renderingEngineId);
  renderingEngine?.enableElement({
    viewportId,
    element,
    type: ViewportType.STACK,
    defaultOptions: {
      orientation: OrientationAxis.AXIAL,
      displayArea: { imageArea: [1, 1] },
      // background: <cornerstone.Types.Point3>[0.2, 0, 0.2],
    },
  });
}

function enableToolsForViewport() {
  const renderingEngine = cornerstone.getRenderingEngine(renderingEngineId);
  const viewport = renderingEngine?.getViewport(viewportId) as IStackViewport;
  const toolGroup = cornerstoneTools.ToolGroupManager.getToolGroup(toolGroupId);
  if (!viewport) return console.warn("No viewport found");
  if (!toolGroup) return console.warn("No tool group found");

  toolGroup.addViewport(viewport.id);
}

async function initRender(imageIds: string[]) {
  const renderingEngine = cornerstone.getRenderingEngine(renderingEngineId);
  const viewport = renderingEngine?.getViewport(viewportId) as IStackViewport;
  if (!viewport) return console.warn("No viewport found");
  await viewport.setStack(imageIds, 0);
  viewport.render();
}

export async function initDemo(element: HTMLDivElement, imageIds: string[]) {
  await initCornerstone();
  initDemoTools();
  enableElement(element);
  enableToolsForViewport();
  await initRender(imageIds);
}

function getViewportTransform() {
  const renderingEngine = cornerstone.getRenderingEngine(renderingEngineId);
  const viewport = renderingEngine?.getViewport(
    viewportId
  ) as IStackViewport & { insetImageMultiplier?: number };
  if (!viewport) return;
  const inset = viewport.insetImageMultiplier || 1.1;
  const pan = viewport.getPan();
  const zoom = viewport.getZoom() / inset;

  return { pan, zoom };
}

export function updateViewportTransform(
  transformRef: Ref<{ pan: number[]; zoom: number }>
) {
  const transform = getViewportTransform();
  if (!transform) return;
  const { pan, zoom } = transform;
  transformRef.value = { pan, zoom };
}

export function resetCamera() {
  const renderingEngine = cornerstone.getRenderingEngine(renderingEngineId);
  const viewport = renderingEngine?.getViewport(viewportId) as IStackViewport;
  if (!viewport) return console.warn("No viewport found");
  viewport.resetCamera();
  viewport.render();
}

export function getViewportCurrentImageIdIndex() {
  const renderingEngine = cornerstone.getRenderingEngine(renderingEngineId);
  const viewport = renderingEngine?.getViewport(viewportId) as IStackViewport;
  if (!viewport) return;
  const currentIndex = viewport.getCurrentImageIdIndex();
  return currentIndex;
}
