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
define(["require", "exports", "tslib", "esri/core/promiseUtils", "dojo/i18n!../nls/resources", "esri/widgets/Expand", "esri/core/Collection", "ApplicationBase/support/widgetConfigUtils/basemapToggle", "esri/geometry/support/jsonUtils"], function (require, exports, tslib_1, promiseUtils_1, i18n, Expand_1, Collection_1, basemapToggle_1, jsonUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getPosition = exports.addSearch = exports.addDaylight = exports.addLineOfSight = exports.addMeasurement = exports.addLegend = exports.addSlice = exports.addLayerList = exports.updateTimeProps = exports.addBookmarks = exports.addPrinter = exports.addScreenshot = exports.addShare = exports.addFullscreen = exports.addZoom = exports.addInfo = exports.addSplash = exports.addHome = exports.addOverlay = exports.addBasemap = void 0;
    Expand_1 = tslib_1.__importDefault(Expand_1);
    Collection_1 = tslib_1.__importDefault(Collection_1);
    function addBasemap(props) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var view, config, propertyName, basemapTogglePosition, basemapToggle, node, _a, originalBasemap, nextBasemap, BasemapToggle, bmToggle;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        view = props.view, config = props.config, propertyName = props.propertyName;
                        basemapTogglePosition = config.basemapTogglePosition, basemapToggle = config.basemapToggle;
                        node = view.ui.find("basemapWidget");
                        return [4 /*yield*/, basemapToggle_1.getBasemaps({ view: props.view, config: config })];
                    case 1:
                        _a = _b.sent(), originalBasemap = _a.originalBasemap, nextBasemap = _a.nextBasemap;
                        // If basemapToggle isn't enabled remove the widget if it exists and exit 
                        if (!basemapToggle) {
                            if (node) {
                                view.ui.remove(node);
                                node.destroy();
                            }
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, new Promise(function (resolve_1, reject_1) { require(["esri/widgets/BasemapToggle"], resolve_1, reject_1); }).then(tslib_1.__importStar)];
                    case 2:
                        BasemapToggle = _b.sent();
                        if (!BasemapToggle)
                            return [2 /*return*/];
                        // Move the basemap toggle widget if it exists 
                        if (propertyName === "basemapTogglePosition" && node) {
                            view.ui.move(node, basemapTogglePosition);
                        }
                        // Add the basemap toggle widget if its enabled or if a different basemap was 
                        // specified
                        if (propertyName === "basemapToggle" && !node) {
                            bmToggle = new BasemapToggle.default({
                                view: view,
                                nextBasemap: nextBasemap,
                                id: "basemapWidget"
                            });
                            basemapToggle_1.resetBasemapsInToggle(bmToggle, originalBasemap, nextBasemap);
                            view.ui.add(bmToggle, basemapTogglePosition);
                        }
                        else if (node && (propertyName === "nextBasemap" || propertyName === "basemapSelector")) {
                            if (propertyName === "nextBasemap" || propertyName === "basemapSelector") {
                                basemapToggle_1.resetBasemapsInToggle(node, originalBasemap, nextBasemap);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.addBasemap = addBasemap;
    function _findNode(className) {
        var mainNodes = document.getElementsByClassName(className);
        var node = null;
        for (var j = 0; j < mainNodes.length; j++) {
            node = mainNodes[j];
        }
        return node ? node : null;
    }
    function _getBasemap(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var Basemap, basemap;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve_2, reject_2) { require(["esri/Basemap"], resolve_2, reject_2); }).then(tslib_1.__importStar)];
                    case 1:
                        Basemap = _a.sent();
                        if (!Basemap) {
                            return [2 /*return*/];
                        }
                        basemap = Basemap.default.fromId(id);
                        if (!!basemap) return [3 /*break*/, 3];
                        return [4 /*yield*/, new Basemap.default({
                                portalItem: {
                                    id: id
                                }
                            }).loadAll()];
                    case 2:
                        basemap = _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, basemap];
                }
            });
        });
    }
    function addOverlay(props) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var view, config, propertyName, disableScroll, theme, ScrollOverlay, node, overlay;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = props.view, config = props.config, propertyName = props.propertyName;
                        disableScroll = config.disableScroll, theme = config.theme;
                        return [4 /*yield*/, new Promise(function (resolve_3, reject_3) { require(["../components/ScrollOverlay"], resolve_3, reject_3); }).then(tslib_1.__importStar)];
                    case 1:
                        ScrollOverlay = _a.sent();
                        node = _findNode("scroll-overlay");
                        if (!disableScroll) {
                            // update view nav 
                            if (node)
                                view.ui.remove(node);
                            view.navigation.mouseWheelZoomEnabled = true;
                            view.navigation.browserTouchPanEnabled = true;
                            return [2 /*return*/];
                        }
                        else if (propertyName === "disableScroll" && !node) {
                            overlay = new ScrollOverlay.default(tslib_1.__assign(tslib_1.__assign({}, props), { container: document.createElement("div") }));
                            view.ui.add(overlay, "manual");
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.addOverlay = addOverlay;
    function addHome(props) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var view, config, propertyName, home, homePosition, node, Home;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = props.view, config = props.config, propertyName = props.propertyName;
                        home = config.home, homePosition = config.homePosition;
                        node = _findNode("esri-home");
                        if (!home) {
                            if (node)
                                view.ui.remove(node);
                            return [2 /*return*/];
                        }
                        if (node && !home)
                            view.ui.remove(node);
                        return [4 /*yield*/, new Promise(function (resolve_4, reject_4) { require(["esri/widgets/Home"], resolve_4, reject_4); }).then(tslib_1.__importStar)];
                    case 1:
                        Home = _a.sent();
                        if (propertyName === "homePosition" && node) {
                            view.ui.move(node, homePosition);
                        }
                        else if (propertyName === "home") {
                            view.ui.add(new Home.default({ view: view }), homePosition);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.addHome = addHome;
    function addSplash(props) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var view, config, propertyName, splash, splashButtonPosition, info, node, infoNode, SplashPanel, panel_1, splashButton;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = props.view, config = props.config, propertyName = props.propertyName;
                        splash = config.splash, splashButtonPosition = config.splashButtonPosition, info = config.info;
                        node = _findNode("esri-splash-button");
                        infoNode = view.ui.find("infoExpand");
                        if (infoNode) {
                            view.ui.remove(infoNode);
                        }
                        if (!splash) {
                            if (node)
                                view.ui.remove(node);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, new Promise(function (resolve_5, reject_5) { require(["../components/Splash"], resolve_5, reject_5); }).then(tslib_1.__importStar)];
                    case 1:
                        SplashPanel = _a.sent();
                        // move the node if it exists 
                        if (propertyName === "splashButtonPosition") {
                            view.ui.move(node, splashButtonPosition);
                        }
                        else if (propertyName === "splash" && !info) {
                            panel_1 = new SplashPanel.default(props);
                            view.ui.add(panel_1, "manual");
                            splashButton = document.createElement("button");
                            splashButton.classList.add("esri-splash-button", "esri-icon-description", "esri-widget--button", "esri-widget", "esri-interactive");
                            splashButton.title = i18n.tools.splash.expand;
                            view.ui.add(splashButton, splashButtonPosition);
                            splashButton.addEventListener("click", function () {
                                panel_1.open();
                            });
                        }
                        else if (node && propertyName === "splashFullScreen") {
                            node.setAttribute("fullscreen", "");
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.addSplash = addSplash;
    function addInfo(props) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var view, config, propertyName, splashButtonPosition, detailsOpenAtStart, info, node, splashNode, InfoPanel, group, panel, infoExpand;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = props.view, config = props.config, propertyName = props.propertyName;
                        splashButtonPosition = config.splashButtonPosition, detailsOpenAtStart = config.detailsOpenAtStart, info = config.info;
                        node = view.ui.find("infoExpand");
                        splashNode = _findNode("esri-splash-button");
                        if (splashNode) {
                            view.ui.remove(splashNode);
                        }
                        if (!info) {
                            if (node)
                                view.ui.remove(node);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, new Promise(function (resolve_6, reject_6) { require(["../components/InfoPanel"], resolve_6, reject_6); }).then(tslib_1.__importStar)];
                    case 1:
                        InfoPanel = _a.sent();
                        group = getPosition(splashButtonPosition);
                        // move the node if it exists 
                        if (propertyName === "splashButtonPosition" && node) {
                            view.ui.move(node, splashButtonPosition);
                            node.group = group;
                        }
                        else if (propertyName === "info") {
                            // create panel content 
                            if (node)
                                return [2 /*return*/];
                            panel = new InfoPanel.default(props);
                            infoExpand = new Expand_1.default({
                                id: "infoExpand",
                                content: panel,
                                group: group,
                                expandIconClass: "esri-icon-description",
                                mode: "floating",
                                view: view
                            });
                            if (detailsOpenAtStart) {
                                infoExpand.expand();
                            }
                            view.ui.add(infoExpand, splashButtonPosition);
                        }
                        else if (propertyName === "detailsOpenAtStart" && node) {
                            if (detailsOpenAtStart) {
                                node.expand();
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.addInfo = addInfo;
    function addZoom(props) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var view, config, propertyName, mapZoom, mapZoomPosition, node, index, Zoom;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = props.view, config = props.config, propertyName = props.propertyName;
                        mapZoom = config.mapZoom, mapZoomPosition = config.mapZoomPosition;
                        node = _findNode("esri-zoom");
                        if (!mapZoom) {
                            if (node)
                                view.ui.remove(node);
                            index = view.ui.components.indexOf("zoom");
                            if (index > -1) {
                                view.ui.components.splice(index, 1);
                            }
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, new Promise(function (resolve_7, reject_7) { require(["esri/widgets/Zoom"], resolve_7, reject_7); }).then(tslib_1.__importStar)];
                    case 1:
                        Zoom = _a.sent();
                        if (node && !mapZoom)
                            view.ui.remove(node);
                        if (propertyName === "mapZoomPosition" && node) {
                            view.ui.move(node, mapZoomPosition);
                        }
                        else if (propertyName === "mapZoom" && !node) {
                            view.ui.add(new Zoom.default({ view: view }), mapZoomPosition);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.addZoom = addZoom;
    function addFullscreen(props) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var view, config, propertyName, fullScreen, fullScreenPosition, node, Fullscreen;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = props.view, config = props.config, propertyName = props.propertyName;
                        fullScreen = config.fullScreen, fullScreenPosition = config.fullScreenPosition;
                        node = _findNode("esri-fullscreen");
                        if (!fullScreen) {
                            if (node)
                                view.ui.remove(node);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, new Promise(function (resolve_8, reject_8) { require(["esri/widgets/Fullscreen"], resolve_8, reject_8); }).then(tslib_1.__importStar)];
                    case 1:
                        Fullscreen = _a.sent();
                        // move the node if it exists 
                        if (propertyName === "fullScreenPosition" && node) {
                            view.ui.move(node, fullScreenPosition);
                        }
                        else if (propertyName === "fullScreen") {
                            view.ui.add(new Fullscreen.default({
                                view: view
                            }), fullScreenPosition);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.addFullscreen = addFullscreen;
    function addShare(props) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var view, config, propertyName, share, sharePosition, theme, node, Share, shareWidget, shareWidget;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = props.view, config = props.config, propertyName = props.propertyName;
                        share = config.share, sharePosition = config.sharePosition, theme = config.theme;
                        node = _findNode("esri-share");
                        if (!share) {
                            if (node)
                                view.ui.remove(node);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, new Promise(function (resolve_9, reject_9) { require(["Components/Share/Share"], resolve_9, reject_9); }).then(tslib_1.__importStar)];
                    case 1:
                        Share = _a.sent();
                        if (propertyName === "sharePosition" && node) {
                            view.ui.move(node, sharePosition);
                        }
                        else if (propertyName === "share" && !node) {
                            shareWidget = new Share.default({
                                view: view,
                                theme: theme
                            });
                            view.ui.add(shareWidget, sharePosition);
                        }
                        else if (propertyName === "theme" && node) {
                            // TODO: look at component and see if we can update theme
                            // without destroy/create
                            view.ui.remove(node);
                            shareWidget = new Share.default({
                                view: view,
                                theme: theme
                            });
                            view.ui.add(shareWidget, sharePosition);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.addShare = addShare;
    function addScreenshot(props) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var view, config, propertyName, screenshot, screenshotPosition, legend, popupHover, node, Screenshot, group, content, screenshotExpand;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = props.view, config = props.config, propertyName = props.propertyName;
                        screenshot = config.screenshot, screenshotPosition = config.screenshotPosition, legend = config.legend, popupHover = config.popupHover;
                        node = view.ui.find("screenshotExpand");
                        if (!screenshot) {
                            if (node)
                                view.ui.remove(node);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, new Promise(function (resolve_10, reject_10) { require(["Components/Screenshot/Screenshot"], resolve_10, reject_10); }).then(tslib_1.__importStar)];
                    case 1:
                        Screenshot = _a.sent();
                        group = getPosition(screenshotPosition);
                        if (propertyName === "screenshotPosition" && node) {
                            view.ui.move(node, screenshotPosition);
                            node.group = group;
                        }
                        else if (propertyName === "screenshot") {
                            content = new Screenshot.default({
                                view: view,
                                enableLegendOption: legend ? true : false,
                                enablePopupOption: popupHover ? false : true,
                                includeLayoutOption: (legend || !popupHover) ? true : false,
                                includePopupInScreenshot: false,
                                includeLegendInScreenshot: false
                            });
                            screenshotExpand = new Expand_1.default({
                                id: "screenshotExpand",
                                content: content,
                                mode: "floating",
                                group: group,
                                expandTooltip: i18n.tools.screenshot.label,
                                view: view
                            });
                            view.ui.add(screenshotExpand, screenshotPosition);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.addScreenshot = addScreenshot;
    function addPrinter(props) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var view, config, propertyName, portal, print, printPosition, node, Print, group, content, printExpand;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = props.view, config = props.config, propertyName = props.propertyName, portal = props.portal;
                        print = config.print, printPosition = config.printPosition;
                        node = view.ui.find("printExpand");
                        if (!print) {
                            if (node)
                                view.ui.remove(node);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, new Promise(function (resolve_11, reject_11) { require(["esri/widgets/Print"], resolve_11, reject_11); }).then(tslib_1.__importStar)];
                    case 1:
                        Print = _a.sent();
                        group = getPosition(printPosition);
                        if (propertyName === "printPosition" && node) {
                            view.ui.move(node, printPosition);
                            node.group = group;
                        }
                        else if (propertyName === "print") {
                            content = new Print.default({
                                view: view,
                                printServiceUrl: portal.helperServices.printTask.url
                            });
                            printExpand = new Expand_1.default({
                                id: "printExpand",
                                content: content,
                                group: group,
                                expandTooltip: content.label,
                                mode: "floating",
                                view: view
                            });
                            view.ui.add(printExpand, printPosition);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.addPrinter = addPrinter;
    function addBookmarks(props) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var view, config, propertyName, slides, slidesPosition, node, map, mapContainsBookmarks, Bookmarks, group, content, bookmarksExpand;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        view = props.view, config = props.config, propertyName = props.propertyName;
                        slides = config.slides, slidesPosition = config.slidesPosition;
                        node = view.ui.find("bookmarksExpand");
                        map = view.map;
                        mapContainsBookmarks = ((_b = (_a = map === null || map === void 0 ? void 0 : map.presentation) === null || _a === void 0 ? void 0 : _a.slides) === null || _b === void 0 ? void 0 : _b.length) > 0 ? true : false;
                        if (!slides || !mapContainsBookmarks) {
                            if (node)
                                view.ui.remove(node);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, new Promise(function (resolve_12, reject_12) { require(["../components/Slides"], resolve_12, reject_12); }).then(tslib_1.__importStar)];
                    case 1:
                        Bookmarks = _c.sent();
                        group = getPosition(slidesPosition);
                        if (propertyName === "slidesPosition" && node) {
                            view.ui.move(node, slidesPosition);
                            node.group = group;
                        }
                        else if (propertyName === "slides") {
                            content = new Bookmarks.default({
                                view: view
                            });
                            bookmarksExpand = new Expand_1.default({
                                id: "bookmarksExpand",
                                content: content,
                                group: group,
                                mode: "floating",
                                view: view
                            });
                            view.ui.add(bookmarksExpand, slidesPosition);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.addBookmarks = addBookmarks;
    function setTimeExtent(props) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var config, liveData, durationTime, durationPeriod, TimeExtent, fullTimeExtent;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config = props.config;
                        liveData = config.liveData, durationTime = config.durationTime, durationPeriod = config.durationPeriod;
                        if (!liveData)
                            return [2 /*return*/, promiseUtils_1.resolve()];
                        return [4 /*yield*/, new Promise(function (resolve_13, reject_13) { require(["esri/TimeExtent"], resolve_13, reject_13); }).then(tslib_1.__importStar)];
                    case 1:
                        TimeExtent = _a.sent();
                        fullTimeExtent = null;
                        if (durationTime <= 0) {
                            console.log("Invalid duration specified " + durationTime);
                        }
                        else {
                            // set startTime to the current date/time 
                            fullTimeExtent = new TimeExtent.default({
                                start: new Date(),
                                end: moment().add(durationTime, durationPeriod).toDate()
                            });
                            config.timeMode = "cumulative-from-start";
                        }
                        return [2 /*return*/, promiseUtils_1.resolve(fullTimeExtent)];
                }
            });
        });
    }
    function setTimeEffects(props, timeSlider) {
        var _this = this;
        var view = props.view, config = props.config;
        var timeEffect = config.timeEffect, includedEffect = config.includedEffect, excludedEffect = config.excludedEffect;
        // If a filter and effects are specified apply them 
        // to the layers 
        var exclude = null;
        var include = null;
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
            var layerViews_1 = [];
            view.map.layers.forEach(function (layer) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var fl, timeLayer;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (layer.type !== "feature") {
                                return [2 /*return*/];
                            }
                            fl = layer;
                            if (!fl.timeInfo) return [3 /*break*/, 2];
                            return [4 /*yield*/, view.whenLayerView(fl)];
                        case 1:
                            timeLayer = _a.sent();
                            timeLayer.effect = {
                                filter: {
                                    timeExtent: timeSlider.timeExtent,
                                    geometry: view.extent
                                },
                                includedEffect: include,
                                excludedEffect: exclude
                            };
                            layerViews_1.push(timeLayer);
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            }); });
            timeSlider.watch("timeExtent", function (value) {
                // set time extent to time aware layer views 
                layerViews_1 && layerViews_1.forEach(function (lv) {
                    lv.effect = {
                        filter: {
                            timeExtent: timeSlider.timeExtent,
                            geometry: view.extent
                        },
                        includedEffect: include,
                        excludedEffect: exclude
                    };
                });
            });
        }
    }
    function updateTimeProps(props, timeSlider) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var view, config, propertyName, slider, expand, hideSliderBar, time, timeLoop, timeVisible, timePosition, timeExpandAtStart, timeEffect, liveData, durationTime, durationPeriod, includedEffect, excludedEffect, group;
            return tslib_1.__generator(this, function (_a) {
                if (!timeSlider && !(timeSlider === null || timeSlider === void 0 ? void 0 : timeSlider.expand) && !(timeSlider === null || timeSlider === void 0 ? void 0 : timeSlider.slider))
                    return [2 /*return*/];
                view = props.view, config = props.config, propertyName = props.propertyName;
                slider = timeSlider.slider, expand = timeSlider.expand;
                hideSliderBar = config.hideSliderBar, time = config.time, timeLoop = config.timeLoop, timeVisible = config.timeVisible, timePosition = config.timePosition, timeExpandAtStart = config.timeExpandAtStart, timeEffect = config.timeEffect, liveData = config.liveData, durationTime = config.durationTime, durationPeriod = config.durationPeriod, includedEffect = config.includedEffect, excludedEffect = config.excludedEffect;
                if (!time)
                    return [2 /*return*/];
                if (propertyName === "hideSliderBar") {
                    hideSliderBar ? expand.container.classList.add("no-slider") : expand.container.classList.remove("no-slider");
                }
                if (propertyName === "timePosition" && expand) {
                    group = getPosition(timePosition);
                    view.ui.move(expand, timePosition);
                    expand.group = group;
                }
                if (propertyName === "timeExpandAtStart" && expand) {
                    timeExpandAtStart ? expand.expand() : expand.collapse();
                }
                if (propertyName === "timeLoop" && slider)
                    slider.loop = timeLoop;
                if (propertyName === "timeVisible" && slider)
                    slider.timeVisible = timeVisible;
                if (slider && (propertyName === "timeEffect" || propertyName === "includedEffect" || propertyName === "excludedEffect")) {
                    setTimeEffects(props, slider);
                }
                if (slider && (propertyName === "liveData" || propertyName === "durationTime" || propertyName === "durationPeriod")) {
                    setTimeExtent(props).then(function (response) {
                        if (response) {
                            slider.extent = response;
                            view.timeExtent = response;
                        }
                    });
                }
                return [2 /*return*/];
            });
        });
    }
    exports.updateTimeProps = updateTimeProps;
    function addLayerList(props) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var view, config, propertyName, layerList, layerListPosition, layerListOpenAtStart, layerListIncludeTable, node, modules, LayerList, group, list, content, layerListExpand;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = props.view, config = props.config, propertyName = props.propertyName;
                        layerList = config.layerList, layerListPosition = config.layerListPosition, layerListOpenAtStart = config.layerListOpenAtStart, layerListIncludeTable = config.layerListIncludeTable;
                        node = view.ui.find("layerListExpand");
                        if (!layerList) {
                            if (node)
                                view.ui.remove(node);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, promiseUtils_1.eachAlways([new Promise(function (resolve_14, reject_14) { require(["esri/widgets/LayerList"], resolve_14, reject_14); }).then(tslib_1.__importStar)])];
                    case 1:
                        modules = _a.sent();
                        LayerList = modules.map(function (module) { return module.value; })[0];
                        group = getPosition(layerListPosition);
                        if ((propertyName === "layerListIncludeTable" || propertyName === "layerListOpenAtStart" || propertyName === "layerListPosition") && node) {
                            if (propertyName === "layerListPosition") {
                                view.ui.move(node, layerListPosition);
                                node.group = group;
                            }
                            if (propertyName === "layerListOpenAtStart")
                                layerListOpenAtStart ? node.expand() : node.collapse();
                            if (propertyName === "layerListIncludeTable") {
                                list = node.content;
                                if (!layerListIncludeTable) {
                                    list.listItemCreatedFunction = function (item) {
                                        var _a;
                                        if ((_a = item === null || item === void 0 ? void 0 : item.item) === null || _a === void 0 ? void 0 : _a.actionsSections) {
                                            item.item.actionsSections = [];
                                        }
                                    };
                                }
                                else {
                                    _createActions(list, view, config);
                                }
                            }
                        }
                        else if (propertyName === "layerList") {
                            content = new LayerList.default({
                                view: view
                            });
                            if (layerListIncludeTable) {
                                _createActions(content, view, config);
                            }
                            layerListExpand = new Expand_1.default({
                                id: "layerListExpand",
                                content: content,
                                group: group,
                                mode: "floating",
                                view: view
                            });
                            if (layerListOpenAtStart)
                                layerListExpand.expand();
                            view.ui.add(layerListExpand, layerListPosition);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.addLayerList = addLayerList;
    function addSlice(props) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var view, config, propertyName, sceneView, slice, slicePosition, sliceOpenAtStart, node, SlicePanel, group, content, sliceExpand;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = props.view, config = props.config, propertyName = props.propertyName;
                        sceneView = view;
                        slice = config.slice, slicePosition = config.slicePosition, sliceOpenAtStart = config.sliceOpenAtStart;
                        node = view.ui.find("sliceExpand");
                        if (!slice) {
                            if (node)
                                view.ui.remove(node);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, new Promise(function (resolve_15, reject_15) { require(["../components/SlicePanel"], resolve_15, reject_15); }).then(tslib_1.__importStar)];
                    case 1:
                        SlicePanel = _a.sent();
                        group = getPosition(slicePosition);
                        if ((propertyName === "slicePosition" || propertyName === "sliceOpenAtStart") && node) {
                            if (propertyName === "sliceOpenAtStart") {
                                sliceOpenAtStart ? node.expand() : node.collapse();
                            }
                            if (propertyName === "slicePosition") {
                                view.ui.move(node, slicePosition);
                                node.group = group;
                            }
                        }
                        else if (propertyName === "slice") {
                            content = new SlicePanel.default({
                                config: config,
                                view: sceneView
                            });
                            sliceExpand = new Expand_1.default({
                                id: "sliceExpand",
                                content: content,
                                group: group,
                                expandIconClass: "slice-icon",
                                mode: "floating",
                                expandTooltip: "Expand slice",
                                view: view
                            });
                            if (sliceOpenAtStart)
                                sliceExpand.expand();
                            view.ui.add(sliceExpand, slicePosition);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.addSlice = addSlice;
    function addLegend(props) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var view, config, propertyName, legend, legendPosition, legendOpenAtStart, legendConfig, node, Legend, group, l, content, legendExpand;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = props.view, config = props.config, propertyName = props.propertyName;
                        legend = config.legend, legendPosition = config.legendPosition, legendOpenAtStart = config.legendOpenAtStart, legendConfig = config.legendConfig;
                        node = view.ui.find("legendExpand");
                        if (!legend) {
                            if (node)
                                view.ui.remove(node);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, new Promise(function (resolve_16, reject_16) { require(["esri/widgets/Legend"], resolve_16, reject_16); }).then(tslib_1.__importStar)];
                    case 1:
                        Legend = _a.sent();
                        group = getPosition(legendPosition);
                        if ((propertyName === "legendConfig" || propertyName === "legendPosition" || propertyName === "legendOpenAtStart") && node) {
                            if (propertyName === "legendOpenAtStart") {
                                legendOpenAtStart ? node.expand() : node.collapse();
                            }
                            if (propertyName === "legendConfig") {
                                l = node.content;
                                if (legendConfig === null || legendConfig === void 0 ? void 0 : legendConfig.style) {
                                    l.style = legendConfig.style;
                                }
                            }
                            if (propertyName === "legendPosition") {
                                view.ui.move(node, legendPosition);
                                node.group = group;
                            }
                        }
                        else if (propertyName === "legend") {
                            content = new Legend.default({
                                style: legendConfig.style,
                                view: view
                            });
                            legendExpand = new Expand_1.default({
                                id: "legendExpand",
                                content: content,
                                group: group,
                                mode: "floating",
                                view: view
                            });
                            if (legendOpenAtStart)
                                legendExpand.expand();
                            view.ui.add(legendExpand, legendPosition);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.addLegend = addLegend;
    function addMeasurement(props) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var view, config, portal, propertyName, measure, measurePosition, measureOpenAtStart, node, modules, MeasurePanel, group, sv, content, measureExpand;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = props.view, config = props.config, portal = props.portal, propertyName = props.propertyName;
                        measure = config.measure, measurePosition = config.measurePosition, measureOpenAtStart = config.measureOpenAtStart;
                        node = view.ui.find("measureExpand");
                        if (!measure) {
                            if (node)
                                view.ui.remove(node);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, promiseUtils_1.eachAlways([new Promise(function (resolve_17, reject_17) { require(["../components/MeasurePanel"], resolve_17, reject_17); }).then(tslib_1.__importStar)])];
                    case 1:
                        modules = _a.sent();
                        MeasurePanel = modules.map(function (module) { return module.value; })[0];
                        group = getPosition(measurePosition);
                        if ((propertyName === "measurePosition" || propertyName === "measureOpenAtStart") && node) {
                            if (propertyName === "measureOpenAtStart") {
                                measureOpenAtStart ? node.expand() : node.collapse();
                            }
                            if (propertyName === "measurePosition") {
                                view.ui.move(node, measurePosition);
                                node.group = group;
                            }
                        }
                        else if (propertyName === "measure") {
                            sv = view;
                            content = new MeasurePanel.default({
                                config: config,
                                view: sv
                            });
                            measureExpand = new Expand_1.default({
                                id: "measureExpand",
                                content: content,
                                group: group,
                                expandIconClass: "esri-icon-measure",
                                expandTooltip: "Expand measure tools",
                                mode: "floating",
                                view: view
                            });
                            if (measureOpenAtStart)
                                measureExpand.expand();
                            view.ui.add(measureExpand, measurePosition);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.addMeasurement = addMeasurement;
    function addLineOfSight(props) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var view, config, propertyName, lineOfSight, lineOfSightPosition, lineOfSightOpenAtStart, node, LineOfSight, group, content, lineOfSightExpand;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = props.view, config = props.config, propertyName = props.propertyName;
                        lineOfSight = config.lineOfSight, lineOfSightPosition = config.lineOfSightPosition, lineOfSightOpenAtStart = config.lineOfSightOpenAtStart;
                        node = view.ui.find("lineOfSightExpand");
                        if (!lineOfSight) {
                            if (node)
                                view.ui.remove(node);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, new Promise(function (resolve_18, reject_18) { require(["esri/widgets/LineOfSight"], resolve_18, reject_18); }).then(tslib_1.__importStar)];
                    case 1:
                        LineOfSight = _a.sent();
                        group = getPosition(lineOfSightPosition);
                        if ((propertyName === "lineOfSightPosition" || propertyName === "lineOfSightOpenAtStart") && node) {
                            if (propertyName === "lineOfSightOpenAtStart") {
                                lineOfSightOpenAtStart ? node.expand() : node.collapse();
                            }
                            if (propertyName === "lineOfSightPosition") {
                                view.ui.move(node, lineOfSightPosition);
                                node.group = group;
                            }
                        }
                        else if (propertyName === "lineOfSight") {
                            content = new LineOfSight.default({
                                view: view
                            });
                            lineOfSightExpand = new Expand_1.default({
                                id: "lineOfSightExpand",
                                content: content,
                                group: group,
                                expandIconClass: "los-icon",
                                mode: "floating",
                                expandTooltip: "Expand line of sight",
                                view: view
                            });
                            if (lineOfSightOpenAtStart)
                                lineOfSightExpand.expand();
                            view.ui.add(lineOfSightExpand, lineOfSightPosition);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.addLineOfSight = addLineOfSight;
    function addDaylight(props) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var view, config, propertyName, daylight, daylightPosition, daylightDate, daylightDateOrSeason, daylightOpenAtStart, node, Daylight, sv, group, content, content, daylightExpand;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = props.view, config = props.config, propertyName = props.propertyName;
                        daylight = config.daylight, daylightPosition = config.daylightPosition, daylightDate = config.daylightDate, daylightDateOrSeason = config.daylightDateOrSeason, daylightOpenAtStart = config.daylightOpenAtStart;
                        node = view.ui.find("daylightExpand");
                        if (!daylight) {
                            if (node)
                                view.ui.remove(node);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, new Promise(function (resolve_19, reject_19) { require(["esri/widgets/Daylight"], resolve_19, reject_19); }).then(tslib_1.__importStar)];
                    case 1:
                        Daylight = _a.sent();
                        sv = view;
                        group = getPosition(daylightPosition);
                        if ((propertyName === "daylightDate" || propertyName === "daylightDateOrSeason" || propertyName === "daylightPosition" || propertyName === "daylightOpenAtStart") && node) {
                            if (propertyName === "daylightOpenAtStart") {
                                daylightOpenAtStart ? node.expand() : node.collapse();
                            }
                            if (propertyName === "daylightDate") {
                                sv.environment.lighting.date = daylightDate || new Date();
                            }
                            if (propertyName === "daylightDateOrSeason") {
                                content = node.content;
                                content.dateOrSeason = daylightDateOrSeason;
                            }
                            if (propertyName === "daylightPosition") {
                                view.ui.move(node, daylightPosition);
                                node.group = group;
                            }
                        }
                        else if (propertyName === "daylight") {
                            // set view's date 
                            sv.environment.lighting.date = daylightDate || new Date();
                            sv.environment.lighting.directShadowsEnabled = true;
                            content = new Daylight.default({
                                view: view,
                                dateOrSeason: daylightDateOrSeason
                            });
                            daylightExpand = new Expand_1.default({
                                id: "daylightExpand",
                                content: content,
                                group: group,
                                expandIconClass: "esri-icon-environment-settings",
                                mode: "floating",
                                expandTooltip: "Expand daylight",
                                view: view
                            });
                            if (daylightOpenAtStart)
                                daylightExpand.expand();
                            view.ui.add(daylightExpand, daylightPosition);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.addDaylight = addDaylight;
    function addSearch(props) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var view, portal, config, propertyName, search, searchPosition, searchConfiguration, searchOpenAtStart, extentSelector, extentSelectorConfig, node, modules, _b, Search, FeatureLayer, group, sources, extent_1, geometry, content, searchExpand;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        view = props.view, portal = props.portal, config = props.config, propertyName = props.propertyName;
                        search = config.search, searchPosition = config.searchPosition, searchConfiguration = config.searchConfiguration, searchOpenAtStart = config.searchOpenAtStart, extentSelector = config.extentSelector, extentSelectorConfig = config.extentSelectorConfig;
                        node = view.ui.find("searchExpand");
                        if (!search) {
                            if (node)
                                view.ui.remove(node);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, promiseUtils_1.eachAlways([new Promise(function (resolve_20, reject_20) { require(["esri/widgets/Search"], resolve_20, reject_20); }).then(tslib_1.__importStar), new Promise(function (resolve_21, reject_21) { require(["esri/layers/FeatureLayer"], resolve_21, reject_21); }).then(tslib_1.__importStar)])];
                    case 1:
                        modules = _c.sent();
                        _b = modules.map(function (module) { return module.value; }), Search = _b[0], FeatureLayer = _b[1];
                        if (!Search || !FeatureLayer || !Expand_1.default)
                            return [2 /*return*/];
                        group = getPosition(searchPosition);
                        if (propertyName === "searchPosition" && node) {
                            // move the node if it exists we have to type as any here 
                            // due to a doc issue with move once index is doc'd remove 
                            view.ui.move(node, searchPosition);
                            node.group = group;
                        }
                        else if (propertyName === "searchOpenAtStart" && node) {
                            node.expanded = searchOpenAtStart;
                        }
                        else if (propertyName === "search" || (propertyName === "extentSelector" && node) || (node && propertyName === "extentSelector") || (propertyName === "searchConfiguration" && node)) {
                            if (node)
                                view.ui.remove(node);
                            sources = searchConfiguration === null || searchConfiguration === void 0 ? void 0 : searchConfiguration.sources;
                            if (sources) {
                                extent_1 = null;
                                if (extentSelector) {
                                    geometry = ((_a = extentSelectorConfig === null || extentSelectorConfig === void 0 ? void 0 : extentSelectorConfig.constraints) === null || _a === void 0 ? void 0 : _a.geometry) || null;
                                    if (geometry) {
                                        extent_1 = jsonUtils_1.fromJSON(geometry);
                                    }
                                }
                                sources.forEach(function (source) {
                                    var _a, _b, _c;
                                    var sourceLayer = null;
                                    if ((_a = source === null || source === void 0 ? void 0 : source.layer) === null || _a === void 0 ? void 0 : _a.id)
                                        sourceLayer = view.map.findLayerById(source.layer.id);
                                    if (!sourceLayer && ((_b = source === null || source === void 0 ? void 0 : source.layer) === null || _b === void 0 ? void 0 : _b.url))
                                        sourceLayer = new FeatureLayer.default((_c = source === null || source === void 0 ? void 0 : source.layer) === null || _c === void 0 ? void 0 : _c.url);
                                    source.layer = sourceLayer;
                                    if (extent_1 && ((extent_1 === null || extent_1 === void 0 ? void 0 : extent_1.type) === "extent" || (extent_1 === null || extent_1 === void 0 ? void 0 : extent_1.type) === "polygon")) {
                                        source.filter = {
                                            geometry: extent_1
                                        };
                                    }
                                    else {
                                        source.filter = null;
                                    }
                                });
                            }
                            content = new Search.default(tslib_1.__assign({ view: view,
                                portal: portal }, searchConfiguration));
                            searchExpand = new Expand_1.default({
                                expanded: searchOpenAtStart,
                                id: "searchExpand",
                                content: content,
                                group: group,
                                mode: "floating",
                                view: view
                            });
                            view.ui.add(searchExpand, searchPosition);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.addSearch = addSearch;
    function _createActions(layerList, view, config) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var FeatureTableLayer;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve_22, reject_22) { require(["../components/FeatureTableLayer"], resolve_22, reject_22); }).then(tslib_1.__importStar)];
                    case 1:
                        FeatureTableLayer = _a.sent();
                        layerList.listItemCreatedFunction = function (event) {
                            var _a;
                            var item = event.item;
                            if (((_a = item === null || item === void 0 ? void 0 : item.layer) === null || _a === void 0 ? void 0 : _a.type) !== "feature") {
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
                        };
                        layerList.on("trigger-action", function (actionEvent) {
                            var id = actionEvent.action.id;
                            if (id === "show-table") {
                                // create panel with table and dock at bottom of app
                                var layer = actionEvent.item.layer;
                                if (!layer)
                                    return;
                                var table_1 = new FeatureTableLayer.default({ view: view, layer: layer, config: config });
                                table_1.watch("dismissed", function () {
                                    if (table_1.dismissed) {
                                        view.ui.remove(table_1);
                                    }
                                });
                                view.ui.add(table_1, "manual");
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    }
    function getPosition(position) {
        // object or string 
        var groupName = null;
        if (typeof position === "string") {
            groupName = position;
        }
        else if (position === null || position === void 0 ? void 0 : position.position) {
            groupName = position.position;
        }
        return groupName;
    }
    exports.getPosition = getPosition;
    function _getLayers(view, layers) {
        if (!layers || !layers.layers) {
            return;
        }
        var returnLayers = new Collection_1.default();
        layers.layers.forEach(function (layer) {
            var found = view.map.findLayerById(layer.id);
            if (found) {
                returnLayers.add(found);
            }
        });
        return returnLayers;
    }
});
//# sourceMappingURL=esriWidgetUtils.js.map