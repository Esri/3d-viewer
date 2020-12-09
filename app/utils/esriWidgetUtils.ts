// Copyright 2020 Esri
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.​

import { eachAlways, resolve } from "esri/core/promiseUtils";
import { esriWidgetProps } from "../interfaces/interfaces";
import i18n = require("dojo/i18n!../nls/resources");
import Expand from "esri/widgets/Expand";
import Collection from "esri/core/Collection";
import {
  getBasemaps,
  resetBasemapsInToggle
} from "ApplicationBase/support/widgetConfigUtils/basemapToggle";
import { fromJSON } from "esri/geometry/support/jsonUtils";
declare var moment: any;
export async function addBasemap(props: esriWidgetProps) {

  const { view, config, propertyName } = props;
  const { basemapTogglePosition, basemapToggle } = config;
  const node = view.ui.find("basemapWidget") as __esri.BasemapToggle;

  const { originalBasemap, nextBasemap } = await getBasemaps({ view: props.view as __esri.MapView, config });
  // If basemapToggle isn't enabled remove the widget if it exists and exit 
  if (!basemapToggle) {
    if (node) {
      view.ui.remove(node);
      node.destroy();
    }
    return;
  }
  const BasemapToggle = await import("esri/widgets/BasemapToggle");
  if (!BasemapToggle) return;
  // Move the basemap toggle widget if it exists 
  if (propertyName === "basemapTogglePosition" && node) {
    view.ui.move(node, basemapTogglePosition);
  }
  // Add the basemap toggle widget if its enabled or if a different basemap was 
  // specified
  if (propertyName === "basemapToggle" && !node) {

    const bmToggle = new BasemapToggle.default({
      view,
      nextBasemap,
      id: "basemapWidget"
    });
    resetBasemapsInToggle(bmToggle, originalBasemap, nextBasemap);
    view.ui.add(bmToggle, basemapTogglePosition);
  } else if (node && (propertyName === "nextBasemap" || propertyName === "basemapSelector")) {
    if (propertyName === "nextBasemap" || propertyName === "basemapSelector") {
      resetBasemapsInToggle(node, originalBasemap, nextBasemap);
    }
  }
}
function _findNode(className: string): HTMLElement {

  const mainNodes = document.getElementsByClassName(className);
  let node = null;
  for (let j = 0; j < mainNodes.length; j++) {
    node = mainNodes[j] as HTMLElement;
  }
  return node ? node : null;

}
async function _getBasemap(id: string): Promise<__esri.Basemap> {
  const Basemap = await import("esri/Basemap");
  if (!Basemap) {
    return;
  }

  let basemap = Basemap.default.fromId(id);
  if (!basemap) {
    basemap = await new Basemap.default({
      portalItem: {
        id
      }
    }).loadAll();
  }
  return basemap as __esri.Basemap;
}
export async function addOverlay(props: esriWidgetProps) {
  const { view, config, propertyName } = props;
  const { disableScroll, theme } = config;

  const ScrollOverlay = await import("../components/ScrollOverlay");

  const node = _findNode("scroll-overlay");
  if (!disableScroll) {
    // update view nav 
    if (node) view.ui.remove(node);
    view.navigation.mouseWheelZoomEnabled = true;
    view.navigation.browserTouchPanEnabled = true;
    return;
  } else if (propertyName === "disableScroll" && !node) {
    // add 
    const overlay = new ScrollOverlay.default({ ...props, container: document.createElement("div") });
    view.ui.add(overlay, "manual");
  }
}
export async function addHome(props: esriWidgetProps) {
  const { view, config, propertyName } = props;
  const { home, homePosition } = config;

  const node = _findNode("esri-home");

  if (!home) {
    if (node) view.ui.remove(node);
    return;
  }
  if (node && !home) view.ui.remove(node);

  const Home = await import("esri/widgets/Home");
  if (propertyName === "homePosition" && node) {
    view.ui.move(node, homePosition);
  } else if (propertyName === "home") {
    view.ui.add(new Home.default({ view }), homePosition);
  }
}
export async function addSplash(props: esriWidgetProps) {

  const { view, config, propertyName } = props;
  const { splash, splashButtonPosition, info } = config;

  const node = _findNode("esri-splash-button");
  const infoNode = view.ui.find("infoExpand") as __esri.Expand;
  if (infoNode) {
    view.ui.remove(infoNode);
  }
  if (!splash) {
    if (node) view.ui.remove(node);
    return;
  }
  const SplashPanel = await import("../components/Splash");
  // move the node if it exists 
  if (propertyName === "splashButtonPosition") {
    view.ui.move(node, splashButtonPosition);
  } else if (propertyName === "splash" && !info) {
    // create panel content 
    const panel = new SplashPanel.default(props);
    view.ui.add(panel, "manual");
    const splashButton = document.createElement("button");

    splashButton.classList.add("esri-splash-button", "esri-icon-description", "esri-widget--button", "esri-widget", "esri-interactive");
    splashButton.title = i18n.tools.splash.expand;

    view.ui.add(splashButton, splashButtonPosition);

    splashButton.addEventListener("click", () => {
      panel.open();
    });
  } else if (node && propertyName === "splashFullScreen") {
    node.setAttribute("fullscreen", "");
  }
}
export async function addInfo(props: esriWidgetProps) {

  const { view, config, propertyName } = props;
  const { splashButtonPosition, detailsOpenAtStart, info } = config;

  const node = view.ui.find("infoExpand") as __esri.Expand;
  const splashNode = _findNode("esri-splash-button");
  if (splashNode) {
    view.ui.remove(splashNode);
  }
  if (!info) {
    if (node) view.ui.remove(node);
    return;
  }
  const InfoPanel = await import("../components/InfoPanel");
  const group = getPosition(splashButtonPosition);
  // move the node if it exists 
  if (propertyName === "splashButtonPosition" && node) {
    view.ui.move(node, splashButtonPosition);
    node.group = group;
  } else if (propertyName === "info") {
    // create panel content 
    if (node) return;
    const panel = new InfoPanel.default(props);
    const infoExpand = new Expand({
      id: "infoExpand",
      content: panel,
      group,
      expandIconClass: "esri-icon-description",
      mode: "floating",
      view
    });
    if (detailsOpenAtStart) {
      infoExpand.expand();
    }
    view.ui.add(infoExpand, splashButtonPosition);
  } else if (propertyName === "detailsOpenAtStart" && node) {
    if (detailsOpenAtStart) {
      node.expand();
    }
  }
}
export async function addZoom(props: esriWidgetProps) {
  const { view, config, propertyName } = props;
  const { mapZoom, mapZoomPosition } = config;
  const node = _findNode("esri-zoom");
  if (!mapZoom) {
    if (node) view.ui.remove(node);
    // remove from components 
    const index = view.ui.components.indexOf("zoom");
    if (index > -1) {
      view.ui.components.splice(index, 1);
    }
    return;
  }
  const Zoom = await import("esri/widgets/Zoom");
  if (node && !mapZoom) view.ui.remove(node);

  if (propertyName === "mapZoomPosition" && node) {
    view.ui.move(node, mapZoomPosition);
  } else if (propertyName === "mapZoom" && !node) {
    view.ui.add(new Zoom.default({ view }), mapZoomPosition);
  }
}
export async function addFullscreen(props: esriWidgetProps) {
  const { view, config, propertyName } = props;
  const { fullScreen, fullScreenPosition } = config;

  const node = _findNode("esri-fullscreen");
  if (!fullScreen) {
    if (node) view.ui.remove(node);
    return;
  }
  const Fullscreen = await import("esri/widgets/Fullscreen");
  // move the node if it exists 
  if (propertyName === "fullScreenPosition" && node) {
    view.ui.move(node, fullScreenPosition);
  } else if (propertyName === "fullScreen") {
    view.ui.add(new Fullscreen.default({
      view
    }), fullScreenPosition);
  }
}
export async function addShare(props: esriWidgetProps) {

  const { view, config, propertyName } = props;
  const { share, sharePosition, theme } = config;

  const node = _findNode("esri-share");
  if (!share) {
    if (node) view.ui.remove(node);
    return;
  }
  const Share = await import("Components/Share/Share");

  if (propertyName === "sharePosition" && node) {
    view.ui.move(node, sharePosition);
  } else if (propertyName === "share" && !node) {
    const shareWidget = new Share.default({
      view,
      theme
    });
    view.ui.add(shareWidget, sharePosition);
  } else if (propertyName === "theme" && node) {
    // TODO: look at component and see if we can update theme
    // without destroy/create
    view.ui.remove(node);
    const shareWidget = new Share.default({
      view,
      theme
    });
    view.ui.add(shareWidget, sharePosition);
  }
}
export async function addScreenshot(props: esriWidgetProps) {

  const { view, config, propertyName } = props;
  const { screenshot, screenshotPosition, legend, popupHover } = config;

  const node = view.ui.find("screenshotExpand") as __esri.Expand;
  if (!screenshot) {
    if (node) view.ui.remove(node);
    return;
  }
  const Screenshot = await import("Components/Screenshot/Screenshot");

  // move the node if it exists 
  const group = getPosition(screenshotPosition);
  if (propertyName === "screenshotPosition" && node) {
    view.ui.move(node, screenshotPosition);
    node.group = group;
  } else if (propertyName === "screenshot") {
    const content = new Screenshot.default({
      view,
      enableLegendOption: legend ? true : false,
      enablePopupOption: popupHover ? false : true,
      includeLayoutOption: (legend || !popupHover) ? true : false,
      includePopupInScreenshot: false,
      includeLegendInScreenshot: false
    });
    const screenshotExpand = new Expand({
      id: "screenshotExpand",
      content,
      mode: "floating",
      group,
      expandTooltip: i18n.tools.screenshot.label,
      view
    });
    view.ui.add(screenshotExpand, screenshotPosition);
  }
}
export async function addPrinter(props: esriWidgetProps) {

  const { view, config, propertyName, portal } = props;
  const { print, printPosition } = config;

  const node = view.ui.find("printExpand") as __esri.Expand;
  if (!print) {
    if (node) view.ui.remove(node);
    return;
  }
  const Print = await import("esri/widgets/Print");
  // move the node if it exists 
  const group = getPosition(printPosition);
  if (propertyName === "printPosition" && node) {
    view.ui.move(node, printPosition);
    node.group = group;
  } else if (propertyName === "print") {
    const content = new Print.default({
      view,
      printServiceUrl: portal.helperServices.printTask.url
    });
    const printExpand = new Expand({
      id: "printExpand",
      content,
      group,
      expandTooltip: content.label,
      mode: "floating",
      view
    });

    view.ui.add(printExpand, printPosition);
  }
}
export async function addBookmarks(props: esriWidgetProps) {

  const { view, config, propertyName } = props;
  const { slides, slidesPosition } = config;

  const node = view.ui.find("bookmarksExpand") as __esri.Expand;
  // check to see if the web scene has slides 
  const map = view.map as __esri.WebScene;
  const mapContainsBookmarks = map?.presentation?.slides?.length > 0 ? true : false;
  if (!slides || !mapContainsBookmarks) {
    if (node) view.ui.remove(node);
    return;
  }

  const Bookmarks = await import("../components/Slides");
  // move the node if it exists 
  const group = getPosition(slidesPosition);
  if (propertyName === "slidesPosition" && node) {
    view.ui.move(node, slidesPosition);
    node.group = group;
  } else if (propertyName === "slides") {
    const content = new Bookmarks.default({
      view
    });
    const bookmarksExpand = new Expand({
      id: "bookmarksExpand",
      content,
      group,
      mode: "floating",
      view
    });

    view.ui.add(bookmarksExpand, slidesPosition);
  }
}
async function setTimeExtent(props): Promise<__esri.TimeExtent> {
  const { config } = props;
  const { liveData, durationTime, durationPeriod } = config;

  if (!liveData) return resolve();

  const TimeExtent = await import("esri/TimeExtent");
  let fullTimeExtent: __esri.TimeExtent = null;

  if (durationTime <= 0) {
    console.log(`Invalid duration specified ${durationTime}`)
  } else {
    // set startTime to the current date/time 
    fullTimeExtent = new TimeExtent.default({
      start: new Date(),
      end: moment().add(durationTime, durationPeriod).toDate()
    });
    config.timeMode = "cumulative-from-start";
  }
  return resolve(fullTimeExtent);

}
function setTimeEffects(props, timeSlider) {
  const { view, config } = props;
  const { timeEffect, includedEffect, excludedEffect } = config;

  // If a filter and effects are specified apply them 
  // to the layers 
  let exclude = null;
  let include = null;
  if (excludedEffect) {
    switch (excludedEffect) {
      case "gray":
        exclude = "grayscale(100%) opacity(30%)";
        break;
      case "sepia":
        exclude = "sepia(90%)";
        break;
      case "opacity":
        exclude = "opacity(80%)";
        break;
      case "null":
        exclude = null;
        break;
    }
  }
  if (includedEffect) {
    switch (includedEffect) {
      case "saturate":
        include = "saturate(1500%)";
        break;
      case "contrast":
        include = "contrast(1.75)";
        break;
      case "brightness":
        include = "brightness(1.75)";
        break;
      case "null":
        include = null;
    }
  }
  if (timeEffect && (include || exclude)) {
    let layerViews = [];
    view.map.layers.forEach(async layer => {
      if (layer.type !== "feature") {
        return;
      }
      const fl = layer as __esri.FeatureLayer;
      if (fl.timeInfo) {
        const timeLayer = await view.whenLayerView(fl);
        timeLayer.effect = {
          filter: {
            timeExtent: timeSlider.timeExtent,
            geometry: view.extent
          },
          includedEffect: include,
          excludedEffect: exclude
        } as any;
        layerViews.push(timeLayer);
      }
    });
    timeSlider.watch("timeExtent", (value) => {
      // set time extent to time aware layer views 
      layerViews && layerViews.forEach((lv) => {
        lv.effect = {
          filter: {
            timeExtent: timeSlider.timeExtent,
            geometry: view.extent
          },
          includedEffect: include,
          excludedEffect: exclude
        };
      })
    });
  }

}
export async function updateTimeProps(props, timeSlider) {
  if (!timeSlider && !timeSlider?.expand && !timeSlider?.slider) return;
  const { view, config, propertyName } = props;
  const { slider, expand } = timeSlider;
  const { hideSliderBar, time, timeLoop, timeVisible, timePosition, timeExpandAtStart, timeEffect, liveData, durationTime, durationPeriod, includedEffect, excludedEffect } = config;
  if (!time) return;
  if (propertyName === "hideSliderBar") {
    hideSliderBar ? expand.container.classList.add("no-slider") : expand.container.classList.remove("no-slider")
  }
  if (propertyName === "timePosition" && expand) {
    const group = getPosition(timePosition);
    view.ui.move(expand, timePosition);
    expand.group = group;
  }
  if (propertyName === "timeExpandAtStart" && expand) {
    timeExpandAtStart ? expand.expand() : expand.collapse();
  }

  if (propertyName === "timeLoop" && slider) slider.loop = timeLoop;

  if (propertyName === "timeVisible" && slider) slider.timeVisible = timeVisible;

  if (slider && (propertyName === "timeEffect" || propertyName === "includedEffect" || propertyName === "excludedEffect")) {
    setTimeEffects(props, slider);
  }

  if (slider && (propertyName === "liveData" || propertyName === "durationTime" || propertyName === "durationPeriod")) {
    setTimeExtent(props).then((response) => {
      if (response) {
        slider.extent = response;
        view.timeExtent = response;
      }
    });
  }

}
export async function addLayerList(props: esriWidgetProps) {

  const { view, config, propertyName } = props;
  const { layerList, layerListPosition, layerListOpenAtStart, layerListIncludeTable } = config;

  const node = view.ui.find("layerListExpand") as __esri.Expand;

  if (!layerList) {
    if (node) view.ui.remove(node);
    return;
  }

  const modules = await eachAlways([import("esri/widgets/LayerList")]);
  const [LayerList] = modules.map((module) => module.value);
  // move the node if it exists 
  const group = getPosition(layerListPosition);
  if ((propertyName === "layerListIncludeTable" || propertyName === "layerListOpenAtStart" || propertyName === "layerListPosition") && node) {
    if (propertyName === "layerListPosition") {
      view.ui.move(node, layerListPosition);
      node.group = group;
    }
    if (propertyName === "layerListOpenAtStart") layerListOpenAtStart ? node.expand() : node.collapse();
    if (propertyName === "layerListIncludeTable") {
      // remove table items from node 
      const list = node.content as __esri.LayerList;
      if (!layerListIncludeTable) {
        list.listItemCreatedFunction = (item) => {
          if (item?.item?.actionsSections) {
            item.item.actionsSections = [];
          }
        };
      } else {
        _createActions(list, view, config);
      }
    }
  } else if (propertyName === "layerList") {
    const content = new LayerList.default({
      view
    });
    if (layerListIncludeTable) {
      _createActions(content, view, config);
    }
    const layerListExpand = new Expand({
      id: "layerListExpand",
      content,
      group,
      mode: "floating",
      view
    });
    if (layerListOpenAtStart) layerListExpand.expand();
    view.ui.add(layerListExpand, layerListPosition);
  }
}
export async function addSlice(props: esriWidgetProps) {

  const { view, config, propertyName } = props;
  const sceneView = view as __esri.SceneView;
  const { slice, slicePosition, sliceOpenAtStart } = config;

  const node = view.ui.find("sliceExpand") as __esri.Expand;

  if (!slice) {
    if (node) view.ui.remove(node);
    return;
  }
  //const Slice = await import("esri/widgets/Slice");
  const SlicePanel = await import("../components/SlicePanel");
  // move the node if it exists 
  const group = getPosition(slicePosition);

  if ((propertyName === "slicePosition" || propertyName === "sliceOpenAtStart") && node) {
    if (propertyName === "sliceOpenAtStart") {
      sliceOpenAtStart ? node.expand() : node.collapse();
    }
    if (propertyName === "slicePosition") {
      view.ui.move(node, slicePosition);
      node.group = group;
    }

  } else if (propertyName === "slice") {
    const content = new SlicePanel.default({
      config,
      view: sceneView
    });
    const sliceExpand = new Expand({
      id: "sliceExpand",
      content,
      group,
      expandIconClass: "slice-icon",
      mode: "floating",
      expandTooltip: "Expand slice",
      view
    });
    if (sliceOpenAtStart) sliceExpand.expand();
    view.ui.add(sliceExpand, slicePosition);
  }
}
export async function addLegend(props: esriWidgetProps) {

  const { view, config, propertyName } = props;
  const { legend, legendPosition, legendOpenAtStart, legendConfig } = config;

  const node = view.ui.find("legendExpand") as __esri.Expand;

  if (!legend) {
    if (node) view.ui.remove(node);
    return;
  }
  const Legend = await import("esri/widgets/Legend");
  // move the node if it exists 
  const group = getPosition(legendPosition);

  if ((propertyName === "legendConfig" || propertyName === "legendPosition" || propertyName === "legendOpenAtStart") && node) {
    if (propertyName === "legendOpenAtStart") {
      legendOpenAtStart ? node.expand() : node.collapse();
    }
    if (propertyName === "legendConfig") {
      const l = node.content as __esri.Legend;
      if (legendConfig?.style) {
        l.style = legendConfig.style;
      }
    }
    if (propertyName === "legendPosition") {
      view.ui.move(node, legendPosition);
      node.group = group;
    }

  } else if (propertyName === "legend") {
    const content = new Legend.default({
      style: legendConfig.style,
      view
    });

    const legendExpand = new Expand({
      id: "legendExpand",
      content,
      group,
      mode: "floating",
      view
    });
    if (legendOpenAtStart) legendExpand.expand();
    view.ui.add(legendExpand, legendPosition);
  }
}
export async function addMeasurement(props: esriWidgetProps) {

  const { view, config, portal, propertyName } = props;
  const { measure, measurePosition, measureOpenAtStart } = config;

  const node = view.ui.find("measureExpand") as __esri.Expand;

  if (!measure) {
    if (node) view.ui.remove(node);
    return;
  }
  const modules = await eachAlways([import("../components/MeasurePanel")]);

  const [MeasurePanel] = modules.map((module) => module.value);

  // move the node if it exists 
  const group = getPosition(measurePosition);

  if ((propertyName === "measurePosition" || propertyName === "measureOpenAtStart") && node) {
    if (propertyName === "measureOpenAtStart") {
      measureOpenAtStart ? node.expand() : node.collapse();
    }

    if (propertyName === "measurePosition") {
      view.ui.move(node, measurePosition);
      node.group = group;
    }

  } else if (propertyName === "measure") {
    const sv = view as __esri.SceneView;

    const content = new MeasurePanel.default({
      config,
      view: sv
    });

    const measureExpand = new Expand({
      id: "measureExpand",
      content,
      group,
      expandIconClass: "esri-icon-measure",
      expandTooltip: "Expand measure tools",
      mode: "floating",
      view
    });
    if (measureOpenAtStart) measureExpand.expand();

    view.ui.add(measureExpand, measurePosition);
  }
}
export async function addLineOfSight(props: esriWidgetProps) {

  const { view, config, propertyName } = props;
  const { lineOfSight, lineOfSightPosition, lineOfSightOpenAtStart } = config;

  const node = view.ui.find("lineOfSightExpand") as __esri.Expand;

  if (!lineOfSight) {
    if (node) view.ui.remove(node);
    return;
  }
  const LineOfSight = await import("esri/widgets/LineOfSight");
  // move the node if it exists 
  const group = getPosition(lineOfSightPosition);

  if ((propertyName === "lineOfSightPosition" || propertyName === "lineOfSightOpenAtStart") && node) {
    if (propertyName === "lineOfSightOpenAtStart") {
      lineOfSightOpenAtStart ? node.expand() : node.collapse();
    }

    if (propertyName === "lineOfSightPosition") {
      view.ui.move(node, lineOfSightPosition);
      node.group = group;
    }

  } else if (propertyName === "lineOfSight") {
    const content = new LineOfSight.default({
      view
    });
    const lineOfSightExpand = new Expand({
      id: "lineOfSightExpand",
      content,
      group,
      expandIconClass: "los-icon",
      mode: "floating",
      expandTooltip: "Expand line of sight",
      view
    });
    if (lineOfSightOpenAtStart) lineOfSightExpand.expand();
    view.ui.add(lineOfSightExpand, lineOfSightPosition);
  }
}
export async function addDaylight(props: esriWidgetProps) {

  const { view, config, propertyName } = props;
  const { daylight, daylightPosition, daylightDate, daylightDateOrSeason, daylightOpenAtStart } = config;

  const node = view.ui.find("daylightExpand") as __esri.Expand;

  if (!daylight) {
    if (node) view.ui.remove(node);
    return;
  }

  const Daylight = await import("esri/widgets/Daylight");
  const sv = view as __esri.SceneView;
  // move the node if it exists 
  const group = getPosition(daylightPosition);

  if ((propertyName === "daylightDate" || propertyName === "daylightDateOrSeason" || propertyName === "daylightPosition" || propertyName === "daylightOpenAtStart") && node) {
    if (propertyName === "daylightOpenAtStart") {
      daylightOpenAtStart ? node.expand() : node.collapse();
    }
    if (propertyName === "daylightDate") {
      sv.environment.lighting.date = daylightDate || new Date();
    }
    if (propertyName === "daylightDateOrSeason") {
      const content = node.content as any;
      content.dateOrSeason = daylightDateOrSeason;
    }
    if (propertyName === "daylightPosition") {
      view.ui.move(node, daylightPosition);
      node.group = group;
    }

  } else if (propertyName === "daylight") {
    // set view's date 
    sv.environment.lighting.date = daylightDate || new Date();
    sv.environment.lighting.directShadowsEnabled = true;
    const content = new Daylight.default({
      view,
      dateOrSeason: daylightDateOrSeason
    });

    const daylightExpand = new Expand({
      id: "daylightExpand",
      content,
      group,
      expandIconClass: "esri-icon-environment-settings",
      mode: "floating",
      expandTooltip: "Expand daylight",
      view
    });
    if (daylightOpenAtStart) daylightExpand.expand();
    view.ui.add(daylightExpand, daylightPosition);
  }
}
export async function addSearch(props: esriWidgetProps) {
  const { view, portal, config, propertyName } = props;
  const { search, searchPosition, searchConfiguration, searchOpenAtStart, extentSelector, extentSelectorConfig } = config;

  const node = view.ui.find("searchExpand") as __esri.Expand;
  if (!search) {
    if (node) view.ui.remove(node);
    return;
  }
  const modules = await eachAlways([import("esri/widgets/Search"), import("esri/layers/FeatureLayer")]);
  const [Search, FeatureLayer] = modules.map((module) => module.value);

  if (!Search || !FeatureLayer || !Expand) return;
  const group = getPosition(searchPosition);
  if (propertyName === "searchPosition" && node) {
    // move the node if it exists we have to type as any here 
    // due to a doc issue with move once index is doc'd remove 
    view.ui.move(node, searchPosition);
    node.group = group;
  } else if (propertyName === "searchOpenAtStart" && node) {
    node.expanded = searchOpenAtStart;
  } else if (propertyName === "search" || (propertyName === "extentSelector" && node) || (node && propertyName === "extentSelector") || (propertyName === "searchConfiguration" && node)) {
    if (node) view.ui.remove(node);
    let sources = searchConfiguration?.sources;
    if (sources) {
      let extent = null;
      if (extentSelector) {
        const geometry = extentSelectorConfig?.constraints?.geometry || null;
        if (geometry) {
          extent = fromJSON(geometry);
        }
      }
      sources.forEach((source) => {
        let sourceLayer = null;
        if (source?.layer?.id) sourceLayer = view.map.findLayerById(source.layer.id);
        if (!sourceLayer && source?.layer?.url) sourceLayer = new FeatureLayer.default(source?.layer?.url);
        source.layer = sourceLayer;
        if (extent && (extent?.type === "extent" || extent?.type === "polygon")) {
          source.filter = {
            geometry: extent
          }
        } else {
          source.filter = null;
        }
      });
    }
    const content = new Search.default({
      view,
      portal,
      ...searchConfiguration
    });
    const searchExpand = new Expand({
      expanded: searchOpenAtStart,
      id: "searchExpand",
      content,
      group,
      mode: "floating",
      view
    });
    view.ui.add(searchExpand, searchPosition);
  }
}
async function _createActions(layerList, view, config) {
  const FeatureTableLayer = await import("../components/FeatureTableLayer");

  layerList.listItemCreatedFunction = (event) => {
    const item = event.item;
    if (item?.layer?.type !== "feature") {
      return;
    }
    item.actionsSections = [
      [
        {
          title: i18n.tools.table.label,
          className: "esri-icon-table",
          id: "show-table"
        }
      ]
    ];
  }
  layerList.on("trigger-action", function (actionEvent) {
    const id = actionEvent.action.id;
    if (id === "show-table") {
      // create panel with table and dock at bottom of app
      const layer = actionEvent.item.layer;
      if (!layer) return;
      const table = new FeatureTableLayer.default({ view, layer, config });
      table.watch("dismissed", () => {
        if (table.dismissed) {
          view.ui.remove(table);
        }
      });
      view.ui.add(table, "manual");
    }
  });
}
export function getPosition(position) {
  // object or string 
  let groupName = null;
  if (typeof position === "string") {
    groupName = position
  } else if (position?.position) {
    groupName = position.position;
  }
  return groupName;
}
function _getLayers(view, layers): __esri.Collection<__esri.Layer> {
  if (!layers || !layers.layers) {
    return;
  }
  const returnLayers = new Collection();
  layers.layers.forEach(layer => {
    const found = view.map.findLayerById(layer.id);
    if (found) {
      returnLayers.add(found);
    }
  });
  return returnLayers;
}

