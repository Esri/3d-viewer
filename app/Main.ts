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

const CSS = {
  loading: "configurable-application--loading"
};
import ApplicationBase from 'ApplicationBase/ApplicationBase';
import Alert from ".//components/Alert";
import {
  createMapFromItem,
  createView,
  getConfigViewProperties,
  getItemTitle,
  findQuery,
  goToMarker
} from "ApplicationBase/support/itemUtils";

import {
  setPageLocale,
  setPageDirection,
  setPageTitle
} from "ApplicationBase/support/domHelper";
import Handles from "esri/core/Handles";

import ConfigurationSettings from "./ConfigurationSettings";
import { init, watch, whenDefinedOnce, whenFalseOnce } from "esri/core/watchUtils";
import { eachAlways, debounce } from "esri/core/promiseUtils";
import Telemetry, { TelemetryInstance } from "./telemetry/telemetry";

import { esriWidgetProps, TimeSliderComponent } from './interfaces/interfaces';
import { addSplash, addInfo, addScreenshot, addHome, addOverlay, addSearch, addZoom, addFullscreen, addBasemap, addBookmarks, addLegend, addLayerList, addShare, updateTimeProps, getPosition, addLineOfSight, addDaylight, addMeasurement, addSlice } from './utils/esriWidgetUtils';


class MapExample {
  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  //----------------------------------
  //  ApplicationBase
  //----------------------------------
  base: ApplicationBase = null;
  _telemetry: TelemetryInstance = null;
  _appConfig: ConfigurationSettings = null;
  _handles: Handles = null;
  _hoverHandler: __esri.EventHandler = null;
  _header: any = null;
  _timeSlider: TimeSliderComponent;
  _initialExtent: __esri.Extent = null;

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------
  ovMap: any = null;

  public init(base: ApplicationBase): void {
    if (!base) {
      console.error("ApplicationBase is not defined");
      return;
    }
    this._handles = new Handles();
    setPageLocale(base.locale);
    setPageDirection(base.direction);

    this.base = base;
    this.createApp();
    document.body.classList.remove(CSS.loading);

  }
  async createApp() {
    const { config, results } = this.base;
    this._appConfig = new ConfigurationSettings(config);
    this._handleTelemetry();

    this._handles.add([
      init(this._appConfig, "customCSS", () => this._handleCustomCSS())
    ]);
    this._handleCustomCSS();
    const { webSceneItems } = results;
    const validWebSceneItems = webSceneItems.map(response => {
      return response.value;
    });

    const item = validWebSceneItems[0];

    if (!item) {
      console.error("Could not load an item to display");
      return;
    }

    config.title = !config.title ? getItemTitle(item) : "";
    setPageTitle(config.title);

    this._handles.add(init(this._appConfig, "theme", () => {
      const theme = this._appConfig.theme;


      const style = document.getElementById("esri-stylesheet") as any;

      style.href = style.href.indexOf("light") !== -1 ? style.href.replace(/light/g, theme) : style.href.replace(/dark/g, theme);
      if (theme === "light") {
        document.body.classList.remove("dark")
        document.body.classList.add("light");
      } else {
        document.body.classList.remove("light");
        document.body.classList.add("dark");
      }

    }), "configuration")
    const portalItem: __esri.PortalItem = this.base.results.applicationItem
      .value;
    const appProxies =
      portalItem && portalItem.applicationProxies
        ? portalItem.applicationProxies
        : null;

    const viewContainerNode = document.getElementById("viewContainer");
    const defaultViewProperties = getConfigViewProperties(config);

    const viewNode = document.createElement("div");
    viewContainerNode.appendChild(viewNode);

    const container = {
      container: viewNode
    };

    const viewProperties = {
      ...defaultViewProperties,
      ...container
    };
    const { websceneTransparentBackground, websceneBackgroundColor } = this._appConfig;
    if (websceneTransparentBackground && websceneBackgroundColor) {
      viewProperties.alphaCompositingEnabled = true;
      viewProperties.environment = {
        background: {
          type: "color",
          color: websceneBackgroundColor
        },
        starsEnabled: false,
        atmosphereEnabled: false
      };
    }
    const map = await createMapFromItem({ item, appProxies });
    map.set({ ground: "world-elevation" });
    const view = await createView({ ...viewProperties, map }) as __esri.SceneView;

    this._setupUrlParams(view);

    await view.when();

    // Add widgets 
    const widgetProps: esriWidgetProps = { view, config: this._appConfig, portal: this.base.portal, telemetry: this._telemetry }
    this._initialExtent = view?.extent?.clone();
    this._handles.add([
      init(this._appConfig, "customHeader, customHeaderPositionedAtBottom, customHeaderHTML", (newValue, oldValue, propertyName) => {
        this._addHeader({ ...widgetProps, ...{ propertyName } });
      }),
      init(this._appConfig, "basemapToggle, basemapTogglePosition, nextBasemap, basemapSelector", (newValue, oldValue, propertyName) => {
        addBasemap({ ...widgetProps, ...{ propertyName } });
      }),
      init(this._appConfig, "disableScroll", (newValue, oldValue, propertyName) => {
        addOverlay({ ...widgetProps, ...{ propertyName } });
      }),
      init(this._appConfig, "screenshot, screenshotPosition", (newValue, oldValue, propertyName) => {
        addScreenshot({ ...widgetProps, ...{ propertyName } });
      }),
      init(this._appConfig, "search, searchOpenAtStart,extentSelector,extentSelectorConfig, searchPosition,searchConfiguration", (newValue, oldValue, propertyName) => {
        addSearch({ ...widgetProps, ...{ propertyName } });
      }),
      init(this._appConfig, "home, homePosition", (newValue, oldValue, propertyName) => {
        addHome({ ...widgetProps, ...{ propertyName } });
      }),
      init(this._appConfig, "slice, slicePosition,sliceOpenAtStart", (newValue, oldValue, propertyName) => {
        addSlice({ ...widgetProps, ...{ propertyName } });
      }),
      init(this._appConfig, "mapZoom, mapZoomPosition", (newValue, oldValue, propertyName) => {
        // Check to see if zoom is already in components list if so remove it 
        if (propertyName === "mapZoom" && newValue === true && view.ui.components.indexOf("zoom") !== -1) { view.ui.remove("zoom") };
        addZoom({ ...widgetProps, ...{ propertyName } });
      }),
      init(this._appConfig, "share, sharePosition, theme", (newValue, oldValue, propertyName) => {
        addShare({ ...widgetProps, ...{ propertyName } });
      }),
      init(this._appConfig, ["legend", "legendOpenAtStart", "legendPosition", "legendConfig"], (newValue, oldValue, propertyName) => {
        addLegend({ ...widgetProps, ...{ propertyName } });
      }),
      init(this._appConfig, ["layerList", "layerListOpenAtStart", "layerListPosition", "layerListIncludeTable"], (newValue, oldValue, propertyName) => {
        addLayerList({ ...widgetProps, ...{ propertyName } });
      }),
      init(this._appConfig, ["measure", "measureOpenAtStart", "measurePosition"], (newValue, oldValue, propertyName) => {
        addMeasurement({ ...widgetProps, ...{ propertyName } });
      }),
      init(this._appConfig, ["lineOfSight", "lineOfSightPosition", "lineOfSightOpenAtStart"], (newValue, oldValue, propertyName) => {
        addLineOfSight({ ...widgetProps, ...{ propertyName } });
      }),
      init(this._appConfig, ["daylight", "daylightPosition", "daylightDateOrSeason", "daylightDate", "daylightOpenAtStart"], (newValue, oldValue, propertyName) => {
        addDaylight({ ...widgetProps, ...{ propertyName } });
      }),
      init(this._appConfig, ["splash", "splashFullScreen", "splashButtonPosition", "splashButtonText", "info", "detailsOpenAtStart"], (newValue, oldValue, propertyName) => {
        const props = { ...widgetProps, ...{ propertyName } };
        const { info, splash } = this._appConfig;
        if (!info && !splash) {
          return;
        }
        if (info && splash) {
          this._appConfig.splash = false;
        } else {
          this._appConfig.splash = !info;
          this._appConfig.info = !splash;
        }

        this._appConfig.info ? addInfo(props) : addSplash(props);
      }),
      init(this._appConfig, "fullScreen,fullScreenPosition", (newValue, oldValue, propertyName) => {
        addFullscreen({ ...widgetProps, ...{ propertyName } });
      }),
      init(this._appConfig, "slides, slidesPosition", (newValue, oldValue, propertyName) => {
        addBookmarks({ ...widgetProps, ...{ propertyName } });
      }),
      init(this._appConfig, ["insetOverviewMap", "insetOverviewMapPosition", "insetOverviewMapMarkerStyle", "insetOverviewMapOpenAtStart", "insetOverviewMapBasemap", "insetOverviewSplitDirection"], (newValue, oldValue, propertyName) => {
        this._addOverviewMap({ ...widgetProps, ...{ propertyName } });
      }),
      init(this._appConfig, ["popupHover", "popupHoverType", "popupHoverPosition", "popupHoverFixed"], (newValue, oldValue, propertyName) => {
        this._addPopupHover({ ...widgetProps, ...{ propertyName } });
      })
    ], "configuration");

    // Clean up configuration handles if we are 
    // hosted 
    if (this.base.settings.environment.isEsri) {
      this._cleanUpHandles();
    }
  }

  _setupUrlParams(view: __esri.SceneView) {
    const { find, marker } = this.base.config;
    findQuery(find, view);
    goToMarker(marker, view);
  }

  _cleanUpHandles() {
    // if we aren't in the config experience remove all handlers after load
    if (!this._appConfig.withinConfigurationExperience) {
      this._handles.remove("configuration");
    }
  }

  async _addHeader(props: esriWidgetProps) {
    const { propertyName } = props;
    const {
      customHeader,
      customHeaderPositionedAtBottom,
    } = this._appConfig;
    const node = document.getElementById("header");
    if (!customHeader) {
      if (node) node.classList.add("hide");
      return;
    } else {
      node.classList.remove('hide');
    }

    const Header = await import("./components/Header");
    if (propertyName === "customHeader" && node && !this._header) {
      this._header = new Header.default({
        config: this._appConfig,
        portal: this.base.portal,
        container: node
      });
    }

    if (propertyName === "customHeaderPositionedAtBottom" && node) {
      const viewContainer = document.getElementById("splitContainer");
      customHeaderPositionedAtBottom ?
        document.body.insertBefore(node, viewContainer?.nextSibling) :
        document.body.insertBefore(node, viewContainer)
    }
  }
  _openPopup(props, e) {
    const { view } = props;
    view.popup.open({
      updateLocationEnabled: false,
      location: view.toMap(e),
      fetchFeatures: true
    });
  }
  async _addPopupHover(props) {
    const { view, config } = props;
    const { popupHover } = config;
    // Clean up 
    this._handles.remove("popupHover");
    view.popup.close();
    view.popup?.container?.classList?.remove("popup-fixed")

    if (!popupHover || this._isMobile()) {
      if (view.popup) {
        view.popup.autoOpenEnabled = true;
      }
      // disable popup hover and return
      return;
    }
    const { popupHoverFixed, popupHoverPosition } = this._appConfig;
    (popupHoverFixed) ? view.popup?.container?.classList?.add("popup-fixed") : view.popup?.container?.classList?.remove("popup-fixed");
    view.popup.visibleElements = {
      featureNavigation: true
    }
    view.popup.spinnerEnabled = false;
    view.popup.autoOpenEnabled = false;
    view.popup.defaultPopupTemplateEnabled = true;

    view.popup.dockEnabled = popupHoverFixed ? true : false;
    view.popup.dockOptions = {
      buttonEnabled: popupHoverFixed ? false : true,
      position: popupHoverFixed ? popupHoverPosition : "auto"
    }

    let click = false;
    let mostRecentScreenPointStr: string;
    this._handles.add(view.on("click", () => {
      view.popup.autoOpenEnabled = true;
      click = true;
      whenFalseOnce(view.popup, "visible", () => {
        view.popup.autoOpenEnabled = false;
        click = false;
      });
    }), "popupHover");
    this._handles.add(view.on("pointer-move", (e) => {
      const currScreenPointStr = `${e.x}_${e.y}`;
      mostRecentScreenPointStr = currScreenPointStr;
      if (e?.error) {
        return;
      }
      if (!click) {
        setTimeout(() => {
          if (currScreenPointStr === mostRecentScreenPointStr) {
            this._openPopup(props, e);
          }
        }, 100);
      }
    }), "popupHover");
  }
  async createTelemetry() {
    // add alert to container
    const { portal } = this.base;
    const appName = this.base.config?.telemetry?.name;
    this._telemetry = await Telemetry.init({ portal, config: this._appConfig, appName });
    this._telemetry?.logPageView();
  }
  private _handleTelemetry() {
    // Wait until both are defined 
    eachAlways([whenDefinedOnce(this._appConfig, "googleAnalytics"),
    whenDefinedOnce(this._appConfig, "googleAnalyticsKey"),
    whenDefinedOnce(this._appConfig, "googleAnalyticsConsentMsg"),
    whenDefinedOnce(this._appConfig, "googleAnalyticsConsent")]

    ).then(() => {

      const alertContainer = document.createElement("container");
      document.body.appendChild(alertContainer);
      new Alert({ config: this._appConfig, container: alertContainer });

      this.createTelemetry();
      this._handles.add([
        watch(this._appConfig, ["googleAnalytics", "googleAnalyticsConsent", "googleAnalyticsConsentMsg", "googleAnalyticsKey"], (newValue, oldValue, propertyName) => {
          this.createTelemetry();
        })
      ]);

    })
  }
  private _handleCustomCSS() {

    const customStylesheet = document.getElementById("customCSS");
    if (customStylesheet) customStylesheet.remove();

    if (!this._appConfig.customCSS || this._appConfig.customCSS === "") return;

    const customStyle = document.createElement("style");
    customStyle.id = "customCSS";
    customStyle.type = "text/css";

    customStyle.appendChild(document.createTextNode(this._appConfig.customCSS))
    document.head.appendChild(customStyle);
  }

  private _isMobile(): boolean {
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? true : false;
  }

  private async _addOverviewMap(props: esriWidgetProps) {

    const { view, config, propertyName } = props;
    const { insetOverviewMapPosition, insetOverviewMap, insetOverviewSplitDirection, insetOverviewMapBasemap, insetOverviewMapOpenAtStart, insetOverviewMapMarkerStyle } = config;
    // find and remove the node if disabled. 
    const node = view.ui.find("expand-overview");

    if (!insetOverviewMap) {
      // move the container back to the main and then remove expand 
      // node 
      if (this.ovMap?.splitter) {
        this.ovMap.splitter.destroy();
      }
      if (node) view.ui.remove(node);
      const nodes = Array.from(document.getElementsByClassName("overview-map"));
      nodes.forEach(element => {
        element.remove();
      });
      return;
    }
    const OverviewMap = await import("./components/InsetMap");
    const container = document.getElementById("splitContainer");
    if (insetOverviewSplitDirection === "vertical") {
      container.classList.remove("direction-horizontal");
      container?.classList.add("direction-vertical");
    } else {
      container.classList.add("direction-horizontal");
      container?.classList?.remove("direction-vertical");
    }
    if (propertyName === "insetOverviewMap" && !node) {
      this.ovMap = new OverviewMap.default(props);
      this.ovMap.id = "overview-map";
      view.ui.add(this.ovMap, insetOverviewMapPosition);
    }
    if (propertyName === "insetOverviewMapPosition" && node) {
      view.ui.move(node, insetOverviewMapPosition);
    }
    if (propertyName == "insetOverviewMapBasemap" && this.ovMap) {
      this.ovMap.changeBasemap(insetOverviewMapBasemap);
    }
    if (propertyName === "insetOverviewMapOpenAtStart") {
      if (this.ovMap && this.ovMap.insetExpand) {
        const insetExpand = this.ovMap.insetExpand;
        insetOverviewMapOpenAtStart ? insetExpand.expand() : insetExpand.collapse();
      }
    }
    if (propertyName === "insetOverviewSplitDirection" && this.ovMap) {
      if (this.ovMap) {
        insetOverviewSplitDirection === "vertical" ? container?.classList.add("direction-vertical") : container?.classList?.remove("direction-vertical");
        if (insetOverviewMap) {
          this.ovMap.updateDirection();
        }
      };
    }
  }
}

export = MapExample;
