
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

import i18n = require("dojo/i18n!../nls/resources");
import {
    subclass,
    property
} from "esri/core/accessorSupport/decorators";
import Widget from "esri/widgets/Widget";
import { renderable, tsx } from "esri/widgets/support/widget";

import AppConfig from "../ConfigurationSettings";
import { esriWidgetProps } from "../interfaces/interfaces";
import { getBackgroundColorTheme } from "esri/views/support/colorUtils";

import Expand from "esri/widgets/Expand";
import MapView from "esri/views/MapView";
import SceneView from "esri/views/SceneView";
import Map from "esri/Map";
import Split from "./splitMaps";
import GraphicsLayer from "esri/layers/GraphicsLayer";
import { init, once, pausable, whenFalseOnce } from 'esri/core/watchUtils';
import Graphic from "esri/Graphic";
import { createWebMapFromItem, createWebSceneFromItem } from 'ApplicationBase/support/itemUtils';
import geometryEngineAsync = require('esri/geometry/geometryEngineAsync');
const CSS = {
    base: "overview-map"
};
const splitterOptions: any = {
    minSize: 0,
    gutterSize: 20
};
const scale = 4;
const width = 250;
const height = 250;
const defaultDirectionSymbol = {
    type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
    path: "M14.5,29 23.5,0 14.5,9 5.5,0z",
    color: "#333",
    outline: {
        color: "#fff",
        width: 1
    },
    angle: 180,
    size: 18
};
const expandOpen = "esri-icon-zoom-out-fixed";
const expandClose = "esri-icon-zoom-in-fixed";
const viewContainerNode = document.getElementById("splitContainer");
// migrate both extents logic 

@subclass("OverviewMap")
class OverviewMap extends (Widget) {
    constructor(props: esriWidgetProps) {
        super(props);
    }
    postInitialize() {
        this._createMap();
    }

    @property({ dependsOn: ["insetView.ready"], readOnly: true })
    get state(): string {
        const loaded = this.insetView.ready;
        return loaded ? "ready" : "loading";
    }

    @property()
    @renderable(["config.insetOverviewMapBasemap"])
    config: AppConfig;

    @property()
    portal: __esri.Portal;

    @property()
    view: __esri.MapView;

    @property()
    insetView: __esri.MapView | __esri.SceneView = null;

    @property()
    insetExpand: __esri.Expand = null;

    @property()
    expandButton: HTMLButtonElement = null;

    @property() splitter: any = null;

    @property() graphicsLayer: GraphicsLayer;
    @property() mover: any;
    @property() extentWatchHandle: __esri.PausableWatchHandle;
    @property() cameraWatchHandle: __esri.PausableWatchHandle;
    @property() activeGraphic: Graphic;
    @property({ readOnly: true })
    get basemapColorTheme(): Number[] {
        const lightColor = [0, 0, 0, 0.7];
        const darkColor = [255, 255, 255, 0.7];
        return this._colorTheme === "dark" ? lightColor : darkColor;

    }
    _colorTheme: string = "light";
    render() {
        return (
            <div class={this.classes([this.config.theme, CSS.base])} bind={this} afterCreate={this._createInset}>
            </div>
        );

    }
    private _createInset(container) {
        this.own(init(this, "insetView", () => {
            const { insetOverviewMapPosition, insetOverviewExpandButton, insetOverviewSplitDirection } = this.config;

            if (this?.insetView?.container) {

                if (insetOverviewExpandButton && !this.expandButton) {
                    this.expandButton = document.createElement("button");
                    this.expandButton.classList.add("esri-widget--button", expandOpen, 'expand-button');

                    this.expandButton.title = "Expand";
                    this.expandButton.setAttribute("aria-label", "Expand");
                    this.insetView.ui.add(this.expandButton, "bottom-right");
                }

                this.splitter = null;

                (insetOverviewSplitDirection === "vertical") ?
                    // stack maps on top of each other
                    splitterOptions.direction = "vertical" :
                    splitterOptions.sizes = [50, 50];

                if (insetOverviewExpandButton) {
                    this.expandButton.addEventListener("click", () => {

                        if (this.expandButton.classList.contains(expandOpen)) {

                            // Inset so move to full                   
                            this.view.ui.remove(this.insetExpand);
                            viewContainerNode.appendChild(this.insetView.container);

                            this.splitter = Split(["#viewContainer", "#mapInset"], splitterOptions);

                            this.expandButton.title = "Collapse";
                        } else {
                            // Full move to inset
                            if (this.splitter) {
                                this.splitter.destroy();
                                this.splitter = null;
                            }

                            viewContainerNode.removeChild(this.insetView.container);
                            const expandcontainer = document.createElement("div");
                            expandcontainer.appendChild(this.insetView.container);
                            this.insetExpand.content = expandcontainer;
                            this.view.ui.add(this.insetExpand, insetOverviewMapPosition as any);

                            // expand inset a bit
                            this.insetView.extent.expand(0.5);
                            this.expandButton.title = i18n.tools.expand;
                        }
                        this.expandButton.classList.toggle(expandOpen);
                        this.expandButton.classList.toggle(expandClose);

                    });
                }

                container.append(this.insetView.container);

            }
        }));
    }

    private async _createMap() {
        const { insetOverviewMapBasemap, insetOverviewCompareMap, insetOverviewMapPosition, insetOverviewMapOpenAtStart, insetOverviewExpandButton } = this.config;

        let map: any = this.view.map.basemap;
        if (insetOverviewCompareMap) {
            const items = await this?.portal?.queryItems({ query: `id:${insetOverviewCompareMap}` })
            const result = items?.results && items.results[0];

            map = await createWebMapFromItem({ item: result });
            await map.load();
            this._updateProxiedLayers(map);
        } else {
            // no map specified let's use specified basemap or map basemap
            const basemap = insetOverviewMapBasemap ? await this.getBasemap(insetOverviewMapBasemap) : this.view.map.basemap;
            map = new Map({ basemap });

        }
        let container = document.getElementById("mapInset") as HTMLDivElement;
        if (!container) {
            container = document.createElement("div");
            container.id = "mapInset";
            container.classList.add("inset-map");

            container.classList.add("hide");
            document.getElementById("splitContainer").appendChild(container);
        }

        const mapProps = {
            map,
            ui: {
                components: ["attribution"]
            },
            extent: this.view.extent,
            scale: this.view.scale * scale * Math.max(this.view.width / width, this.view.height / height),
            constraints: {
                snapToZoom: false,
                rotationEnabled: false
            },
            container
        }
        this.insetView = new MapView(mapProps);

        this.graphicsLayer = new GraphicsLayer();
        this.insetView.map.add(this.graphicsLayer);
        once(this.insetView, "updating", () => {
            const index = this.insetView.layerViews.length > 0 ? this.insetView.layerViews.length : 0;
            this.insetView.map.reorder(this.graphicsLayer, index);
        });
        const group = this._getPosition(insetOverviewMapPosition);
        this.insetExpand = new Expand({
            view: this.view,
            id: "expand-overview",
            group,
            expanded: insetOverviewMapOpenAtStart,
            expandIconClass: "esri-icon-globe",
            mode: "floating",
            content: this.insetView.container
        });
        container.classList.remove("hide");
        this.insetView.container.classList.add(CSS.base);
        this.view.ui.add(this.insetExpand, insetOverviewMapPosition);
        this.insetView.when(() => {
            this._updatePosition();
            this._syncViews();
        });
    }

    private _updateProxiedLayers(map) {
        const { appProxies } = this.config;
        if (!appProxies) {
            return;
        }
        appProxies.forEach(proxy => {
            map.layers.forEach((layer: any) => {
                if (layer.url === proxy.sourceUrl) {
                    layer.url = proxy.proxyUrl;
                }
            });
        });
    }
    private _getPosition(position) {
        // object or string 
        let groupName = null;
        if (typeof position === "string") {
            groupName = position
        } else if (position?.position) {
            groupName = position.position;
        }
        return groupName;
    }
    private async _syncViews() {
        this.extentWatchHandle = pausable(this.view, "extent", () => this._updatePosition());
        this.cameraWatchHandle = pausable(this.view, "camera", () => this._updatePosition());

        this.insetView.on("immediate-click", async e => {
            if (!this.view?.map?.ground) return;
            const result = await this.view.map.ground.queryElevation(e.mapPoint);
            await this.view.goTo({
                target: result.geometry
            }, { animate: false }).catch(() => { });
        });
    }
    private async _pauseAndUpdate(mapPoint, animate) {
        const result = await this.view.map.ground.queryElevation(mapPoint);
        await this.view.goTo({
            target: result.geometry
        }, { animate: animate }).catch(() => { });

        this.extentWatchHandle.resume();
        this.cameraWatchHandle.resume();
        geometryEngineAsync.contains(this.insetView.extent, result.geometry).then((contains) => {
            if (!contains) {
                this._panInsetView(result.geometry, false);
            }
        });
    }
    _panInsetView(geometry, animate = false) {
        if (!this.insetView.ready) { return; }
        this.insetView.goTo(geometry, { animate: animate }).catch(() => { });
    }
    private _updatePosition(geometry?, animate = true) {
        this.graphicsLayer.removeAll();
        let camera = null;
        if (this.view?.type !== "2d") {
            const sv = this.view as any as SceneView;
            camera = sv.camera;
        }
        const position = geometry || camera?.position || null;
        //  symbol is a certain direction so we need to rotate it...
        defaultDirectionSymbol.angle = 180 + (camera?.heading || 0);


        this.activeGraphic = new Graphic({
            geometry: position,
            symbol: defaultDirectionSymbol
        });
        this.graphicsLayer.add(this.activeGraphic);

        // Pan to graphic if it moves out of inset view
        whenFalseOnce(this.view, "interacting", () => {
            this._panInsetView(position, false);
        });
    }
    public async changeBasemap(basemap) {
        const newBasemap = await this.getBasemap(basemap);
        const map = this.insetView?.map;
        if (map) {
            map.set("basemap", newBasemap);
        }
    }
    public async getBasemap(id): Promise<__esri.Basemap> {
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
    public updateDirection() {
        const { insetOverviewSplitDirection } = this.config;
        if (splitterOptions) {
            splitterOptions.direction = insetOverviewSplitDirection;
            splitterOptions.sizes = [50, 50];
        }
        if (this.expandButton) {
            this.expandButton.click();
            this.expandButton.click();
        }
    }
}

export default OverviewMap;
