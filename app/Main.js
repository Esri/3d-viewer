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
define(["require", "exports", "tslib", ".//components/Alert", "ApplicationBase/support/itemUtils", "ApplicationBase/support/domHelper", "esri/core/Handles", "./ConfigurationSettings", "esri/core/watchUtils", "esri/core/promiseUtils", "./telemetry/telemetry", "./utils/esriWidgetUtils"], function (require, exports, tslib_1, Alert_1, itemUtils_1, domHelper_1, Handles_1, ConfigurationSettings_1, watchUtils_1, promiseUtils_1, telemetry_1, esriWidgetUtils_1) {
    "use strict";
    Alert_1 = tslib_1.__importDefault(Alert_1);
    Handles_1 = tslib_1.__importDefault(Handles_1);
    ConfigurationSettings_1 = tslib_1.__importDefault(ConfigurationSettings_1);
    telemetry_1 = tslib_1.__importDefault(telemetry_1);
    var CSS = {
        loading: "configurable-application--loading"
    };
    var MapExample = /** @class */ (function () {
        function MapExample() {
            //--------------------------------------------------------------------------
            //
            //  Properties
            //
            //--------------------------------------------------------------------------
            //----------------------------------
            //  ApplicationBase
            //----------------------------------
            this.base = null;
            this._telemetry = null;
            this._appConfig = null;
            this._handles = null;
            this._hoverHandler = null;
            this._header = null;
            this._initialExtent = null;
            //--------------------------------------------------------------------------
            //
            //  Public Methods
            //
            //--------------------------------------------------------------------------
            this.ovMap = null;
        }
        MapExample.prototype.init = function (base) {
            if (!base) {
                console.error("ApplicationBase is not defined");
                return;
            }
            this._handles = new Handles_1.default();
            domHelper_1.setPageLocale(base.locale);
            domHelper_1.setPageDirection(base.direction);
            this.base = base;
            this.createApp();
            document.body.classList.remove(CSS.loading);
        };
        MapExample.prototype.createApp = function () {
            var _a;
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var _b, config, results, webSceneItems, validWebSceneItems, item, portalItem, appProxies, viewContainerNode, defaultViewProperties, viewNode, container, viewProperties, _c, websceneTransparentBackground, websceneBackgroundColor, map, view, widgetProps;
                var _this = this;
                return tslib_1.__generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _b = this.base, config = _b.config, results = _b.results;
                            this._appConfig = new ConfigurationSettings_1.default(config);
                            this._handleTelemetry();
                            this._handles.add([
                                watchUtils_1.init(this._appConfig, "customCSS", function () { return _this._handleCustomCSS(); })
                            ]);
                            this._handleCustomCSS();
                            webSceneItems = results.webSceneItems;
                            validWebSceneItems = webSceneItems.map(function (response) {
                                return response.value;
                            });
                            item = validWebSceneItems[0];
                            if (!item) {
                                console.error("Could not load an item to display");
                                return [2 /*return*/];
                            }
                            config.title = !config.title ? itemUtils_1.getItemTitle(item) : "";
                            domHelper_1.setPageTitle(config.title);
                            this._handles.add(watchUtils_1.init(this._appConfig, "theme", function () {
                                var theme = _this._appConfig.theme;
                                var style = document.getElementById("esri-stylesheet");
                                style.href = style.href.indexOf("light") !== -1 ? style.href.replace(/light/g, theme) : style.href.replace(/dark/g, theme);
                                if (theme === "light") {
                                    document.body.classList.remove("dark");
                                    document.body.classList.add("light");
                                }
                                else {
                                    document.body.classList.remove("light");
                                    document.body.classList.add("dark");
                                }
                            }), "configuration");
                            portalItem = this.base.results.applicationItem
                                .value;
                            appProxies = portalItem && portalItem.applicationProxies
                                ? portalItem.applicationProxies
                                : null;
                            viewContainerNode = document.getElementById("viewContainer");
                            defaultViewProperties = itemUtils_1.getConfigViewProperties(config);
                            viewNode = document.createElement("div");
                            viewContainerNode.appendChild(viewNode);
                            container = {
                                container: viewNode
                            };
                            viewProperties = tslib_1.__assign(tslib_1.__assign({}, defaultViewProperties), container);
                            _c = this._appConfig, websceneTransparentBackground = _c.websceneTransparentBackground, websceneBackgroundColor = _c.websceneBackgroundColor;
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
                            return [4 /*yield*/, itemUtils_1.createMapFromItem({ item: item, appProxies: appProxies })];
                        case 1:
                            map = _d.sent();
                            map.set({ ground: "world-elevation" });
                            return [4 /*yield*/, itemUtils_1.createView(tslib_1.__assign(tslib_1.__assign({}, viewProperties), { map: map }))];
                        case 2:
                            view = _d.sent();
                            this._setupUrlParams(view);
                            return [4 /*yield*/, view.when()];
                        case 3:
                            _d.sent();
                            widgetProps = { view: view, config: this._appConfig, portal: this.base.portal, telemetry: this._telemetry };
                            this._initialExtent = (_a = view === null || view === void 0 ? void 0 : view.extent) === null || _a === void 0 ? void 0 : _a.clone();
                            this._handles.add([
                                watchUtils_1.init(this._appConfig, "customHeader, customHeaderPositionedAtBottom, customHeaderHTML", function (newValue, oldValue, propertyName) {
                                    _this._addHeader(tslib_1.__assign(tslib_1.__assign({}, widgetProps), { propertyName: propertyName }));
                                }),
                                watchUtils_1.init(this._appConfig, "basemapToggle, basemapTogglePosition, nextBasemap, basemapSelector", function (newValue, oldValue, propertyName) {
                                    esriWidgetUtils_1.addBasemap(tslib_1.__assign(tslib_1.__assign({}, widgetProps), { propertyName: propertyName }));
                                }),
                                watchUtils_1.init(this._appConfig, "disableScroll", function (newValue, oldValue, propertyName) {
                                    esriWidgetUtils_1.addOverlay(tslib_1.__assign(tslib_1.__assign({}, widgetProps), { propertyName: propertyName }));
                                }),
                                watchUtils_1.init(this._appConfig, "screenshot, screenshotPosition", function (newValue, oldValue, propertyName) {
                                    esriWidgetUtils_1.addScreenshot(tslib_1.__assign(tslib_1.__assign({}, widgetProps), { propertyName: propertyName }));
                                }),
                                watchUtils_1.init(this._appConfig, "search, searchOpenAtStart,extentSelector,extentSelectorConfig, searchPosition,searchConfiguration", function (newValue, oldValue, propertyName) {
                                    esriWidgetUtils_1.addSearch(tslib_1.__assign(tslib_1.__assign({}, widgetProps), { propertyName: propertyName }));
                                }),
                                watchUtils_1.init(this._appConfig, "home, homePosition", function (newValue, oldValue, propertyName) {
                                    esriWidgetUtils_1.addHome(tslib_1.__assign(tslib_1.__assign({}, widgetProps), { propertyName: propertyName }));
                                }),
                                watchUtils_1.init(this._appConfig, "slice, slicePosition,sliceOpenAtStart", function (newValue, oldValue, propertyName) {
                                    esriWidgetUtils_1.addSlice(tslib_1.__assign(tslib_1.__assign({}, widgetProps), { propertyName: propertyName }));
                                }),
                                watchUtils_1.init(this._appConfig, "mapZoom, mapZoomPosition", function (newValue, oldValue, propertyName) {
                                    // Check to see if zoom is already in components list if so remove it 
                                    if (propertyName === "mapZoom" && newValue === true && view.ui.components.indexOf("zoom") !== -1) {
                                        view.ui.remove("zoom");
                                    }
                                    ;
                                    esriWidgetUtils_1.addZoom(tslib_1.__assign(tslib_1.__assign({}, widgetProps), { propertyName: propertyName }));
                                }),
                                watchUtils_1.init(this._appConfig, "share, sharePosition, theme", function (newValue, oldValue, propertyName) {
                                    esriWidgetUtils_1.addShare(tslib_1.__assign(tslib_1.__assign({}, widgetProps), { propertyName: propertyName }));
                                }),
                                watchUtils_1.init(this._appConfig, ["legend", "legendOpenAtStart", "legendPosition", "legendConfig"], function (newValue, oldValue, propertyName) {
                                    esriWidgetUtils_1.addLegend(tslib_1.__assign(tslib_1.__assign({}, widgetProps), { propertyName: propertyName }));
                                }),
                                watchUtils_1.init(this._appConfig, ["layerList", "layerListOpenAtStart", "layerListPosition", "layerListIncludeTable"], function (newValue, oldValue, propertyName) {
                                    esriWidgetUtils_1.addLayerList(tslib_1.__assign(tslib_1.__assign({}, widgetProps), { propertyName: propertyName }));
                                }),
                                watchUtils_1.init(this._appConfig, ["measure", "measureOpenAtStart", "measurePosition"], function (newValue, oldValue, propertyName) {
                                    esriWidgetUtils_1.addMeasurement(tslib_1.__assign(tslib_1.__assign({}, widgetProps), { propertyName: propertyName }));
                                }),
                                watchUtils_1.init(this._appConfig, ["lineOfSight", "lineOfSightPosition", "lineOfSightOpenAtStart"], function (newValue, oldValue, propertyName) {
                                    esriWidgetUtils_1.addLineOfSight(tslib_1.__assign(tslib_1.__assign({}, widgetProps), { propertyName: propertyName }));
                                }),
                                watchUtils_1.init(this._appConfig, ["daylight", "daylightPosition", "daylightDateOrSeason", "daylightDate", "daylightOpenAtStart"], function (newValue, oldValue, propertyName) {
                                    esriWidgetUtils_1.addDaylight(tslib_1.__assign(tslib_1.__assign({}, widgetProps), { propertyName: propertyName }));
                                }),
                                watchUtils_1.init(this._appConfig, ["splash", "splashFullScreen", "splashButtonPosition", "splashButtonText", "info", "detailsOpenAtStart"], function (newValue, oldValue, propertyName) {
                                    var props = tslib_1.__assign(tslib_1.__assign({}, widgetProps), { propertyName: propertyName });
                                    var _a = _this._appConfig, info = _a.info, splash = _a.splash;
                                    if (!info && !splash) {
                                        return;
                                    }
                                    if (info && splash) {
                                        _this._appConfig.splash = false;
                                    }
                                    else {
                                        _this._appConfig.splash = !info;
                                        _this._appConfig.info = !splash;
                                    }
                                    _this._appConfig.info ? esriWidgetUtils_1.addInfo(props) : esriWidgetUtils_1.addSplash(props);
                                }),
                                watchUtils_1.init(this._appConfig, "fullScreen,fullScreenPosition", function (newValue, oldValue, propertyName) {
                                    esriWidgetUtils_1.addFullscreen(tslib_1.__assign(tslib_1.__assign({}, widgetProps), { propertyName: propertyName }));
                                }),
                                watchUtils_1.init(this._appConfig, "slides, slidesPosition", function (newValue, oldValue, propertyName) {
                                    esriWidgetUtils_1.addBookmarks(tslib_1.__assign(tslib_1.__assign({}, widgetProps), { propertyName: propertyName }));
                                }),
                                watchUtils_1.init(this._appConfig, ["insetOverviewMap", "insetOverviewMapPosition", "insetOverviewMapMarkerStyle", "insetOverviewMapOpenAtStart", "insetOverviewMapBasemap", "insetOverviewSplitDirection"], function (newValue, oldValue, propertyName) {
                                    _this._addOverviewMap(tslib_1.__assign(tslib_1.__assign({}, widgetProps), { propertyName: propertyName }));
                                }),
                                watchUtils_1.init(this._appConfig, ["popupHover", "popupHoverType", "popupHoverPosition", "popupHoverFixed"], function (newValue, oldValue, propertyName) {
                                    _this._addPopupHover(tslib_1.__assign(tslib_1.__assign({}, widgetProps), { propertyName: propertyName }));
                                })
                            ], "configuration");
                            // Clean up configuration handles if we are 
                            // hosted 
                            if (this.base.settings.environment.isEsri) {
                                this._cleanUpHandles();
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        MapExample.prototype._setupUrlParams = function (view) {
            var _a = this.base.config, find = _a.find, marker = _a.marker;
            itemUtils_1.findQuery(find, view);
            itemUtils_1.goToMarker(marker, view);
        };
        MapExample.prototype._cleanUpHandles = function () {
            // if we aren't in the config experience remove all handlers after load
            if (!this._appConfig.withinConfigurationExperience) {
                this._handles.remove("configuration");
            }
        };
        MapExample.prototype._addHeader = function (props) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var propertyName, _a, customHeader, customHeaderPositionedAtBottom, node, Header, viewContainer;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            propertyName = props.propertyName;
                            _a = this._appConfig, customHeader = _a.customHeader, customHeaderPositionedAtBottom = _a.customHeaderPositionedAtBottom;
                            node = document.getElementById("header");
                            if (!customHeader) {
                                if (node)
                                    node.classList.add("hide");
                                return [2 /*return*/];
                            }
                            else {
                                node.classList.remove('hide');
                            }
                            return [4 /*yield*/, new Promise(function (resolve_1, reject_1) { require(["./components/Header"], resolve_1, reject_1); }).then(tslib_1.__importStar)];
                        case 1:
                            Header = _b.sent();
                            if (propertyName === "customHeader" && node && !this._header) {
                                this._header = new Header.default({
                                    config: this._appConfig,
                                    portal: this.base.portal,
                                    container: node
                                });
                            }
                            if (propertyName === "customHeaderPositionedAtBottom" && node) {
                                viewContainer = document.getElementById("splitContainer");
                                customHeaderPositionedAtBottom ?
                                    document.body.insertBefore(node, viewContainer === null || viewContainer === void 0 ? void 0 : viewContainer.nextSibling) :
                                    document.body.insertBefore(node, viewContainer);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        MapExample.prototype._openPopup = function (props, e) {
            var view = props.view;
            view.popup.open({
                updateLocationEnabled: false,
                location: view.toMap(e),
                fetchFeatures: true
            });
        };
        MapExample.prototype._addPopupHover = function (props) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var view, config, popupHover, _k, popupHoverFixed, popupHoverPosition, click, mostRecentScreenPointStr;
                var _this = this;
                return tslib_1.__generator(this, function (_l) {
                    view = props.view, config = props.config;
                    popupHover = config.popupHover;
                    // Clean up 
                    this._handles.remove("popupHover");
                    view.popup.close();
                    (_c = (_b = (_a = view.popup) === null || _a === void 0 ? void 0 : _a.container) === null || _b === void 0 ? void 0 : _b.classList) === null || _c === void 0 ? void 0 : _c.remove("popup-fixed");
                    if (!popupHover || this._isMobile()) {
                        if (view.popup) {
                            view.popup.autoOpenEnabled = true;
                        }
                        // disable popup hover and return
                        return [2 /*return*/];
                    }
                    _k = this._appConfig, popupHoverFixed = _k.popupHoverFixed, popupHoverPosition = _k.popupHoverPosition;
                    (popupHoverFixed) ? (_f = (_e = (_d = view.popup) === null || _d === void 0 ? void 0 : _d.container) === null || _e === void 0 ? void 0 : _e.classList) === null || _f === void 0 ? void 0 : _f.add("popup-fixed") : (_j = (_h = (_g = view.popup) === null || _g === void 0 ? void 0 : _g.container) === null || _h === void 0 ? void 0 : _h.classList) === null || _j === void 0 ? void 0 : _j.remove("popup-fixed");
                    view.popup.visibleElements = {
                        featureNavigation: true
                    };
                    view.popup.spinnerEnabled = false;
                    view.popup.autoOpenEnabled = false;
                    view.popup.defaultPopupTemplateEnabled = true;
                    view.popup.dockEnabled = popupHoverFixed ? true : false;
                    view.popup.dockOptions = {
                        buttonEnabled: popupHoverFixed ? false : true,
                        position: popupHoverFixed ? popupHoverPosition : "auto"
                    };
                    click = false;
                    this._handles.add(view.on("click", function () {
                        view.popup.autoOpenEnabled = true;
                        click = true;
                        watchUtils_1.whenFalseOnce(view.popup, "visible", function () {
                            view.popup.autoOpenEnabled = false;
                            click = false;
                        });
                    }), "popupHover");
                    this._handles.add(view.on("pointer-move", function (e) {
                        var currScreenPointStr = e.x + "_" + e.y;
                        mostRecentScreenPointStr = currScreenPointStr;
                        if (e === null || e === void 0 ? void 0 : e.error) {
                            return;
                        }
                        if (!click) {
                            setTimeout(function () {
                                if (currScreenPointStr === mostRecentScreenPointStr) {
                                    _this._openPopup(props, e);
                                }
                            }, 100);
                        }
                    }), "popupHover");
                    return [2 /*return*/];
                });
            });
        };
        MapExample.prototype.createTelemetry = function () {
            var _a, _b, _c;
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var portal, appName, _d;
                return tslib_1.__generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            portal = this.base.portal;
                            appName = (_b = (_a = this.base.config) === null || _a === void 0 ? void 0 : _a.telemetry) === null || _b === void 0 ? void 0 : _b.name;
                            _d = this;
                            return [4 /*yield*/, telemetry_1.default.init({ portal: portal, config: this._appConfig, appName: appName })];
                        case 1:
                            _d._telemetry = _e.sent();
                            (_c = this._telemetry) === null || _c === void 0 ? void 0 : _c.logPageView();
                            return [2 /*return*/];
                    }
                });
            });
        };
        MapExample.prototype._handleTelemetry = function () {
            var _this = this;
            // Wait until both are defined 
            promiseUtils_1.eachAlways([watchUtils_1.whenDefinedOnce(this._appConfig, "googleAnalytics"),
                watchUtils_1.whenDefinedOnce(this._appConfig, "googleAnalyticsKey"),
                watchUtils_1.whenDefinedOnce(this._appConfig, "googleAnalyticsConsentMsg"),
                watchUtils_1.whenDefinedOnce(this._appConfig, "googleAnalyticsConsent")]).then(function () {
                var alertContainer = document.createElement("container");
                document.body.appendChild(alertContainer);
                new Alert_1.default({ config: _this._appConfig, container: alertContainer });
                _this.createTelemetry();
                _this._handles.add([
                    watchUtils_1.watch(_this._appConfig, ["googleAnalytics", "googleAnalyticsConsent", "googleAnalyticsConsentMsg", "googleAnalyticsKey"], function (newValue, oldValue, propertyName) {
                        _this.createTelemetry();
                    })
                ]);
            });
        };
        MapExample.prototype._handleCustomCSS = function () {
            var customStylesheet = document.getElementById("customCSS");
            if (customStylesheet)
                customStylesheet.remove();
            if (!this._appConfig.customCSS || this._appConfig.customCSS === "")
                return;
            var customStyle = document.createElement("style");
            customStyle.id = "customCSS";
            customStyle.type = "text/css";
            customStyle.appendChild(document.createTextNode(this._appConfig.customCSS));
            document.head.appendChild(customStyle);
        };
        MapExample.prototype._isMobile = function () {
            return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? true : false;
        };
        MapExample.prototype._addOverviewMap = function (props) {
            var _a, _b, _c;
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var view, config, propertyName, insetOverviewMapPosition, insetOverviewMap, insetOverviewSplitDirection, insetOverviewMapBasemap, insetOverviewMapOpenAtStart, insetOverviewMapMarkerStyle, node, nodes, OverviewMap, container, insetExpand;
                return tslib_1.__generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            view = props.view, config = props.config, propertyName = props.propertyName;
                            insetOverviewMapPosition = config.insetOverviewMapPosition, insetOverviewMap = config.insetOverviewMap, insetOverviewSplitDirection = config.insetOverviewSplitDirection, insetOverviewMapBasemap = config.insetOverviewMapBasemap, insetOverviewMapOpenAtStart = config.insetOverviewMapOpenAtStart, insetOverviewMapMarkerStyle = config.insetOverviewMapMarkerStyle;
                            node = view.ui.find("expand-overview");
                            if (!insetOverviewMap) {
                                // move the container back to the main and then remove expand 
                                // node 
                                if ((_a = this.ovMap) === null || _a === void 0 ? void 0 : _a.splitter) {
                                    this.ovMap.splitter.destroy();
                                }
                                if (node)
                                    view.ui.remove(node);
                                nodes = Array.from(document.getElementsByClassName("overview-map"));
                                nodes.forEach(function (element) {
                                    element.remove();
                                });
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, new Promise(function (resolve_2, reject_2) { require(["./components/InsetMap"], resolve_2, reject_2); }).then(tslib_1.__importStar)];
                        case 1:
                            OverviewMap = _d.sent();
                            container = document.getElementById("splitContainer");
                            if (insetOverviewSplitDirection === "vertical") {
                                container.classList.remove("direction-horizontal");
                                container === null || container === void 0 ? void 0 : container.classList.add("direction-vertical");
                            }
                            else {
                                container.classList.add("direction-horizontal");
                                (_b = container === null || container === void 0 ? void 0 : container.classList) === null || _b === void 0 ? void 0 : _b.remove("direction-vertical");
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
                                    insetExpand = this.ovMap.insetExpand;
                                    insetOverviewMapOpenAtStart ? insetExpand.expand() : insetExpand.collapse();
                                }
                            }
                            if (propertyName === "insetOverviewSplitDirection" && this.ovMap) {
                                if (this.ovMap) {
                                    insetOverviewSplitDirection === "vertical" ? container === null || container === void 0 ? void 0 : container.classList.add("direction-vertical") : (_c = container === null || container === void 0 ? void 0 : container.classList) === null || _c === void 0 ? void 0 : _c.remove("direction-vertical");
                                    if (insetOverviewMap) {
                                        this.ovMap.updateDirection();
                                    }
                                }
                                ;
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        return MapExample;
    }());
    return MapExample;
});
//# sourceMappingURL=Main.js.map