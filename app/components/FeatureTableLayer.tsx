

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
import { renderable, tsx, storeNode } from "esri/widgets/support/widget";

import AppConfig from "../ConfigurationSettings";
import FeatureTable from "esri/widgets/FeatureTable";
import Widget from "esri/widgets/Widget";
import { esriTableLayerProps } from '../interfaces/interfaces';

const CSS = {
    base: "feature-table-layer-panel",
    content: "feature-table-layer__content"
};
@subclass("FeatureTableLayer")
class FeatureTableLayer extends (Widget) {

    @property()
    @renderable(["config.applySharedTheme", "config.theme"])
    config: AppConfig;

    @property()
    layer: __esri.FeatureLayer;

    @property()
    view: __esri.SceneView;

    @property()
    dismissed: boolean;

    rootNode: HTMLElement = null;

    constructor(props: esriTableLayerProps) {
        super(props);
    }

    render() {
        const { theme } = this.config;

        return (
            <div class={this.classes(CSS.base)}>
                <calcite-panel bind={this} id={this.layer.id + "-table"} heightScale="m" dismissible theme={theme} afterCreate={this._dismissPanel}>
                    <div slot="header-content">{this.layer?.title}</div>
                    <div class={CSS.content} >
                        <div class={CSS.content} bind={this} afterCreate={this._createTable}></div>
                    </div>
                </calcite-panel>
            </div>
        );
    }
    _dismissPanel(container) {
        container.addEventListener("calcitePanelDismissedChange", () => {
            this.dismissed = true;
        })
    }
    _createTable(container) {
        const { view, layer } = this;

        const featureTable = new FeatureTable({
            view,
            layer,
            container
        });
    }

}
export default FeatureTableLayer;
