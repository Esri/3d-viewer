
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
import { subclass, property } from "esri/core/accessorSupport/decorators";
import Widget = require("esri/widgets/Widget");
import AppConfig from "../ConfigurationSettings";

import { tsx, storeNode } from "esri/widgets/support/widget";
import Measurement from "esri/widgets/Measurement";

interface MeasureProps extends __esri.WidgetProperties {
    config: any;
    view: __esri.SceneView;
}

const CSS = {
    base: "measurement-panel"
};

@subclass("MeasurePanel")
class MeasurePanel extends Widget {
    @property()
    config: AppConfig;

    @property()
    view: __esri.SceneView;

    rootNode: any = null;
    measureTool: __esri.Measurement = null;
    constructor(params: MeasureProps) {
        super(params);
    }


    render() {

        return (

            <calcite-panel theme={this.config.theme} class={this.classes([this.config.theme, CSS.base])}>
                <calcite-radio-group width="full" theme={this.config.theme} afterCreate={storeNode} data-node-ref="rootNode" bind={this} layout="horizontal" onclick={this._handleButtonClick}>
                    <calcite-radio-group-item value="direct-line" title="Measure line" icon="measure"> </calcite-radio-group-item>
                    <calcite-radio-group-item value="area" title="Measure area" icon="measure-area"> </calcite-radio-group-item>
                    <calcite-radio-group-item value="clear" title="Clear" icon="trash"> </calcite-radio-group-item>
                </calcite-radio-group>
                <div bind={this} afterCreate={this._createMeasureTool}></div>

            </calcite-panel>);
    }
    _createMeasureTool(container) {
        this.measureTool = new Measurement({
            view: this.view,
            container
        });
    }
    _handleButtonClick() {
        const selected = this.rootNode?.selectedItem?.value;

        if (!this.measureTool) {
            return;
        }
        this.measureTool.clear();

        if (selected === "direct-line") {
            this.measureTool.activeTool = "direct-line";
        } else if (selected === "area") {
            this.measureTool.activeTool = "area";
        }
    }

}

export = MeasurePanel;
