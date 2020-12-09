
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

import {
    property,
    subclass
} from "esri/core/accessorSupport/decorators";
import Accessor from "esri/core/Accessor";
import { ApplicationConfig } from "ApplicationBase/interfaces";
interface IExtentSelectorOutput { constraints: __esri.MapViewConstraints; mapRotation: number; }
type UIPosition =
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top-leading"
    | "top-trailing"
    | "bottom-leading"
    | "bottom-trailing";
type daylightType = "date" | "season";
@subclass("app.ConfigurationSettings")
class ConfigurationSettings extends (Accessor) {
    @property()
    webscene: string;
    @property()
    websceneTransparentBackground: boolean;

    @property()
    websceneBackgroundColor: string;

    @property()
    extentSelectorConfig: IExtentSelectorOutput;
    @property()
    extentSelector: boolean;


    @property()
    mapZoom: boolean;
    @property()
    mapZoomPosition: UIPosition;


    @property()
    home: boolean;
    @property()
    homePosition: UIPosition;

    @property()
    fullScreen: boolean;
    @property()
    fullScreenPosition: UIPosition;

    @property()
    disableScroll: boolean;

    @property()
    search: boolean;

    @property()
    searchPosition: UIPosition;

    @property()
    searchConfiguration: any;
    @property()
    searchOpenAtStart: boolean;

    @property()
    share: boolean;
    @property()
    sharePosition: UIPosition;

    @property()
    screenshot: boolean;
    @property()
    screenshotPosition: UIPosition;


    @property()
    popupHover: boolean;

    @property()
    popupHoverFixed: boolean;

    @property()
    popupHoverPosition: UIPosition;

    @property()
    theme: string;

    @property()
    customCSS: string;

    @property()
    title: string;

    @property()
    slides: boolean;

    @property()
    slidesPosition: UIPosition;

    @property()
    basemapToggle: boolean;

    @property()
    basemapTogglePosition: UIPosition;

    @property()
    nextBasemap: string;
    @property()
    basemapSelector: string;
    @property()
    layerList: boolean;
    @property()
    layerListPosition: UIPosition;
    @property()
    layerListOpenAtStart: boolean;
    @property()
    layerListIncludeTable: boolean;

    @property()
    legend: boolean;
    @property()
    legendPosition: UIPosition;
    @property()
    legendOpenAtStart: boolean;
    @property()
    legendConfig: object | string;

    @property()
    measure: boolean;
    @property()
    measurePosition: UIPosition;
    @property()
    measureOpenAtStart: boolean;


    @property()
    insetOverviewMap: boolean;
    @property()
    insetOverviewMapPosition: UIPosition;
    @property()
    insetOverviewMapBasemap: string;
    @property()
    insetOverviewCompareMap: string;

    @property()
    insetOverviewMapMarkerStyle: string;
    @property()
    insetOverviewMapOpenAtStart: boolean;
    @property()
    insetOverviewSplitDirection: string;
    @property()
    insetOverviewExpandButton: boolean;
    @property()
    locationColor: string;


    @property()
    lineOfSight: boolean;
    @property()
    lineOfSightPosition: UIPosition;
    @property()
    lineOfSightOpenAtStart: boolean;

    @property()
    daylight: boolean;
    @property()
    daylightPosition: UIPosition;
    @property()
    daylightOpenAtStart: boolean;
    @property()
    daylightDateOrSeason: daylightType;
    @property()
    daylightDate: Date;

    @property()
    slice: boolean;
    @property()
    slicePosition: UIPosition;
    @property()
    sliceOpenAtStart: boolean;

    @property()
    appProxies: any;

    @property()
    splash: boolean;
    @property()
    splashContent: string;
    @property()
    splashTitle: string;
    @property()
    splashButtonText: string;
    @property()
    splashButtonPosition: UIPosition;
    @property()
    splashFullScreen: boolean;

    @property()
    info: boolean;

    @property()
    customHeaderHTML: string;
    @property()
    customHeader: boolean;
    @property()
    customHeaderPositionedAtBottom: boolean;
    @property()
    applySharedTheme: false;


    @property()
    googleAnalytics: boolean;
    @property()
    googleAnalyticsKey: string;
    @property()
    googleAnalyticsConsent: boolean;
    @property()
    googleAnalyticsConsentMsg: string;
    @property()
    telemetry: any;

    @property()
    withinConfigurationExperience: boolean = this._isWithinConfigurationExperience();
    _storageKey = "config-values";
    _draft: ApplicationConfig = null;
    _draftMode: boolean = false;
    constructor(params?: ApplicationConfig) {

        super(params);
        this._draft = params?.draft;
        this._draftMode = params?.mode === "draft";
    }
    initialize() {
        if (this.withinConfigurationExperience || this._draftMode) {
            // Apply any draft properties
            if (this._draft) {
                Object.assign(this, this._draft);
            }

            window.addEventListener(
                "message",
                function (e) {
                    this._handleConfigurationUpdates(e);
                }.bind(this),
                false
            );
        }
    }

    _handleConfigurationUpdates(e) {
        if (e?.data?.type === "cats-app") {
            Object.assign(this, e.data);
        }
    }
    private _isWithinConfigurationExperience(): boolean {
        const { frameElement, location, parent } = window;
        return frameElement
            ? frameElement.getAttribute("data-embed-type") === "instant-config"
                ? true
                : false
            : location !== parent.location;
    }

}
export = ConfigurationSettings;
