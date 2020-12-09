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
define(["require", "exports", "tslib", "dojo/i18n!../nls/resources", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "esri/widgets/support/widget", "esri/widgets/Expand", "esri/views/MapView", "esri/Map", "./splitMaps", "esri/layers/GraphicsLayer", "esri/core/watchUtils", "esri/Graphic", "ApplicationBase/support/itemUtils", "esri/geometry/geometryEngineAsync"], function (require, exports, tslib_1, i18n, decorators_1, Widget_1, widget_1, Expand_1, MapView_1, Map_1, splitMaps_1, GraphicsLayer_1, watchUtils_1, Graphic_1, itemUtils_1, geometryEngineAsync) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Widget_1 = tslib_1.__importDefault(Widget_1);
    Expand_1 = tslib_1.__importDefault(Expand_1);
    MapView_1 = tslib_1.__importDefault(MapView_1);
    Map_1 = tslib_1.__importDefault(Map_1);
    splitMaps_1 = tslib_1.__importDefault(splitMaps_1);
    GraphicsLayer_1 = tslib_1.__importDefault(GraphicsLayer_1);
    Graphic_1 = tslib_1.__importDefault(Graphic_1);
    var CSS = {
        base: "overview-map"
    };
    var splitterOptions = {
        minSize: 0,
        gutterSize: 20
    };
    var scale = 4;
    var width = 250;
    var height = 250;
    var defaultDirectionSymbol = {
        type: "simple-marker",
        path: "M14.5,29 23.5,0 14.5,9 5.5,0z",
        color: "#333",
        outline: {
            color: "#fff",
            width: 1
        },
        angle: 180,
        size: 18
    };
    var expandOpen = "esri-icon-zoom-out-fixed";
    var expandClose = "esri-icon-zoom-in-fixed";
    var viewContainerNode = document.getElementById("splitContainer");
    // migrate both extents logic 
    var OverviewMap = /** @class */ (function (_super) {
        tslib_1.__extends(OverviewMap, _super);
        function OverviewMap(props) {
            var _this = _super.call(this, props) || this;
            _this.insetView = null;
            _this.insetExpand = null;
            _this.expandButton = null;
            _this.splitter = null;
            _this._colorTheme = "light";
            return _this;
        }
        OverviewMap.prototype.postInitialize = function () {
            this._createMap();
        };
        Object.defineProperty(OverviewMap.prototype, "state", {
            get: function () {
                var loaded = this.insetView.ready;
                return loaded ? "ready" : "loading";
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(OverviewMap.prototype, "basemapColorTheme", {
            get: function () {
                var lightColor = [0, 0, 0, 0.7];
                var darkColor = [255, 255, 255, 0.7];
                return this._colorTheme === "dark" ? lightColor : darkColor;
            },
            enumerable: false,
            configurable: true
        });
        OverviewMap.prototype.render = function () {
            return (widget_1.tsx("div", { class: this.classes([this.config.theme, CSS.base]), bind: this, afterCreate: this._createInset }));
        };
        OverviewMap.prototype._createInset = function (container) {
            var _this = this;
            this.own(watchUtils_1.init(this, "insetView", function () {
                var _a;
                var _b = _this.config, insetOverviewMapPosition = _b.insetOverviewMapPosition, insetOverviewExpandButton = _b.insetOverviewExpandButton, insetOverviewSplitDirection = _b.insetOverviewSplitDirection;
                if ((_a = _this === null || _this === void 0 ? void 0 : _this.insetView) === null || _a === void 0 ? void 0 : _a.container) {
                    if (insetOverviewExpandButton && !_this.expandButton) {
                        _this.expandButton = document.createElement("button");
                        _this.expandButton.classList.add("esri-widget--button", expandOpen, 'expand-button');
                        _this.expandButton.title = "Expand";
                        _this.expandButton.setAttribute("aria-label", "Expand");
                        _this.insetView.ui.add(_this.expandButton, "bottom-right");
                    }
                    _this.splitter = null;
                    (insetOverviewSplitDirection === "vertical") ?
                        // stack maps on top of each other
                        splitterOptions.direction = "vertical" :
                        splitterOptions.sizes = [50, 50];
                    if (insetOverviewExpandButton) {
                        _this.expandButton.addEventListener("click", function () {
                            if (_this.expandButton.classList.contains(expandOpen)) {
                                // Inset so move to full                   
                                _this.view.ui.remove(_this.insetExpand);
                                viewContainerNode.appendChild(_this.insetView.container);
                                _this.splitter = splitMaps_1.default(["#viewContainer", "#mapInset"], splitterOptions);
                                _this.expandButton.title = "Collapse";
                            }
                            else {
                                // Full move to inset
                                if (_this.splitter) {
                                    _this.splitter.destroy();
                                    _this.splitter = null;
                                }
                                viewContainerNode.removeChild(_this.insetView.container);
                                var expandcontainer = document.createElement("div");
                                expandcontainer.appendChild(_this.insetView.container);
                                _this.insetExpand.content = expandcontainer;
                                _this.view.ui.add(_this.insetExpand, insetOverviewMapPosition);
                                // expand inset a bit
                                _this.insetView.extent.expand(0.5);
                                _this.expandButton.title = i18n.tools.expand;
                            }
                            _this.expandButton.classList.toggle(expandOpen);
                            _this.expandButton.classList.toggle(expandClose);
                        });
                    }
                    container.append(_this.insetView.container);
                }
            }));
        };
        OverviewMap.prototype._createMap = function () {
            var _a;
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var _b, insetOverviewMapBasemap, insetOverviewCompareMap, insetOverviewMapPosition, insetOverviewMapOpenAtStart, insetOverviewExpandButton, map, items, result, basemap, _c, container, mapProps, group;
                var _this = this;
                return tslib_1.__generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _b = this.config, insetOverviewMapBasemap = _b.insetOverviewMapBasemap, insetOverviewCompareMap = _b.insetOverviewCompareMap, insetOverviewMapPosition = _b.insetOverviewMapPosition, insetOverviewMapOpenAtStart = _b.insetOverviewMapOpenAtStart, insetOverviewExpandButton = _b.insetOverviewExpandButton;
                            map = this.view.map.basemap;
                            if (!insetOverviewCompareMap) return [3 /*break*/, 4];
                            return [4 /*yield*/, ((_a = this === null || this === void 0 ? void 0 : this.portal) === null || _a === void 0 ? void 0 : _a.queryItems({ query: "id:" + insetOverviewCompareMap }))];
                        case 1:
                            items = _d.sent();
                            result = (items === null || items === void 0 ? void 0 : items.results) && items.results[0];
                            return [4 /*yield*/, itemUtils_1.createWebMapFromItem({ item: result })];
                        case 2:
                            map = _d.sent();
                            return [4 /*yield*/, map.load()];
                        case 3:
                            _d.sent();
                            this._updateProxiedLayers(map);
                            return [3 /*break*/, 8];
                        case 4:
                            if (!insetOverviewMapBasemap) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.getBasemap(insetOverviewMapBasemap)];
                        case 5:
                            _c = _d.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            _c = this.view.map.basemap;
                            _d.label = 7;
                        case 7:
                            basemap = _c;
                            map = new Map_1.default({ basemap: basemap });
                            _d.label = 8;
                        case 8:
                            container = document.getElementById("mapInset");
                            if (!container) {
                                container = document.createElement("div");
                                container.id = "mapInset";
                                container.classList.add("inset-map");
                                container.classList.add("hide");
                                document.getElementById("splitContainer").appendChild(container);
                            }
                            mapProps = {
                                map: map,
                                ui: {
                                    components: ["attribution"]
                                },
                                extent: this.view.extent,
                                scale: this.view.scale * scale * Math.max(this.view.width / width, this.view.height / height),
                                constraints: {
                                    snapToZoom: false,
                                    rotationEnabled: false
                                },
                                container: container
                            };
                            this.insetView = new MapView_1.default(mapProps);
                            this.graphicsLayer = new GraphicsLayer_1.default();
                            this.insetView.map.add(this.graphicsLayer);
                            watchUtils_1.once(this.insetView, "updating", function () {
                                var index = _this.insetView.layerViews.length > 0 ? _this.insetView.layerViews.length : 0;
                                _this.insetView.map.reorder(_this.graphicsLayer, index);
                            });
                            group = this._getPosition(insetOverviewMapPosition);
                            this.insetExpand = new Expand_1.default({
                                view: this.view,
                                id: "expand-overview",
                                group: group,
                                expanded: insetOverviewMapOpenAtStart,
                                expandIconClass: "esri-icon-globe",
                                mode: "floating",
                                content: this.insetView.container
                            });
                            container.classList.remove("hide");
                            this.insetView.container.classList.add(CSS.base);
                            this.view.ui.add(this.insetExpand, insetOverviewMapPosition);
                            this.insetView.when(function () {
                                _this._updatePosition();
                                _this._syncViews();
                            });
                            return [2 /*return*/];
                    }
                });
            });
        };
        OverviewMap.prototype._updateProxiedLayers = function (map) {
            var appProxies = this.config.appProxies;
            if (!appProxies) {
                return;
            }
            appProxies.forEach(function (proxy) {
                map.layers.forEach(function (layer) {
                    if (layer.url === proxy.sourceUrl) {
                        layer.url = proxy.proxyUrl;
                    }
                });
            });
        };
        OverviewMap.prototype._getPosition = function (position) {
            // object or string 
            var groupName = null;
            if (typeof position === "string") {
                groupName = position;
            }
            else if (position === null || position === void 0 ? void 0 : position.position) {
                groupName = position.position;
            }
            return groupName;
        };
        OverviewMap.prototype._syncViews = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var _this = this;
                return tslib_1.__generator(this, function (_a) {
                    this.extentWatchHandle = watchUtils_1.pausable(this.view, "extent", function () { return _this._updatePosition(); });
                    this.cameraWatchHandle = watchUtils_1.pausable(this.view, "camera", function () { return _this._updatePosition(); });
                    this.insetView.on("immediate-click", function (e) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var result;
                        var _a, _b;
                        return tslib_1.__generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (!((_b = (_a = this.view) === null || _a === void 0 ? void 0 : _a.map) === null || _b === void 0 ? void 0 : _b.ground))
                                        return [2 /*return*/];
                                    return [4 /*yield*/, this.view.map.ground.queryElevation(e.mapPoint)];
                                case 1:
                                    result = _c.sent();
                                    return [4 /*yield*/, this.view.goTo({
                                            target: result.geometry
                                        }, { animate: false }).catch(function () { })];
                                case 2:
                                    _c.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
                });
            });
        };
        OverviewMap.prototype._pauseAndUpdate = function (mapPoint, animate) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var result;
                var _this = this;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.view.map.ground.queryElevation(mapPoint)];
                        case 1:
                            result = _a.sent();
                            return [4 /*yield*/, this.view.goTo({
                                    target: result.geometry
                                }, { animate: animate }).catch(function () { })];
                        case 2:
                            _a.sent();
                            this.extentWatchHandle.resume();
                            this.cameraWatchHandle.resume();
                            geometryEngineAsync.contains(this.insetView.extent, result.geometry).then(function (contains) {
                                if (!contains) {
                                    _this._panInsetView(result.geometry, false);
                                }
                            });
                            return [2 /*return*/];
                    }
                });
            });
        };
        OverviewMap.prototype._panInsetView = function (geometry, animate) {
            if (animate === void 0) { animate = false; }
            if (!this.insetView.ready) {
                return;
            }
            this.insetView.goTo(geometry, { animate: animate }).catch(function () { });
        };
        OverviewMap.prototype._updatePosition = function (geometry, animate) {
            var _this = this;
            var _a;
            if (animate === void 0) { animate = true; }
            this.graphicsLayer.removeAll();
            var camera = null;
            if (((_a = this.view) === null || _a === void 0 ? void 0 : _a.type) !== "2d") {
                var sv = this.view;
                camera = sv.camera;
            }
            var position = geometry || (camera === null || camera === void 0 ? void 0 : camera.position) || null;
            //  symbol is a certain direction so we need to rotate it...
            defaultDirectionSymbol.angle = 180 + ((camera === null || camera === void 0 ? void 0 : camera.heading) || 0);
            this.activeGraphic = new Graphic_1.default({
                geometry: position,
                symbol: defaultDirectionSymbol
            });
            this.graphicsLayer.add(this.activeGraphic);
            // Pan to graphic if it moves out of inset view
            watchUtils_1.whenFalseOnce(this.view, "interacting", function () {
                _this._panInsetView(position, false);
            });
        };
        OverviewMap.prototype.changeBasemap = function (basemap) {
            var _a;
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var newBasemap, map;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.getBasemap(basemap)];
                        case 1:
                            newBasemap = _b.sent();
                            map = (_a = this.insetView) === null || _a === void 0 ? void 0 : _a.map;
                            if (map) {
                                map.set("basemap", newBasemap);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        OverviewMap.prototype.getBasemap = function (id) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var Basemap, basemap;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, new Promise(function (resolve_1, reject_1) { require(["esri/Basemap"], resolve_1, reject_1); }).then(tslib_1.__importStar)];
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
        };
        OverviewMap.prototype.updateDirection = function () {
            var insetOverviewSplitDirection = this.config.insetOverviewSplitDirection;
            if (splitterOptions) {
                splitterOptions.direction = insetOverviewSplitDirection;
                splitterOptions.sizes = [50, 50];
            }
            if (this.expandButton) {
                this.expandButton.click();
                this.expandButton.click();
            }
        };
        tslib_1.__decorate([
            decorators_1.property({ dependsOn: ["insetView.ready"], readOnly: true })
        ], OverviewMap.prototype, "state", null);
        tslib_1.__decorate([
            decorators_1.property(),
            widget_1.renderable(["config.insetOverviewMapBasemap"])
        ], OverviewMap.prototype, "config", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], OverviewMap.prototype, "portal", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], OverviewMap.prototype, "view", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], OverviewMap.prototype, "insetView", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], OverviewMap.prototype, "insetExpand", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], OverviewMap.prototype, "expandButton", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], OverviewMap.prototype, "splitter", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], OverviewMap.prototype, "graphicsLayer", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], OverviewMap.prototype, "mover", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], OverviewMap.prototype, "extentWatchHandle", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], OverviewMap.prototype, "cameraWatchHandle", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], OverviewMap.prototype, "activeGraphic", void 0);
        tslib_1.__decorate([
            decorators_1.property({ readOnly: true })
        ], OverviewMap.prototype, "basemapColorTheme", null);
        OverviewMap = tslib_1.__decorate([
            decorators_1.subclass("OverviewMap")
        ], OverviewMap);
        return OverviewMap;
    }((Widget_1.default)));
    exports.default = OverviewMap;
});
//# sourceMappingURL=InsetMap.js.map