
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

import { tsx, storeNode, renderable } from "esri/widgets/support/widget";
import Slice from "esri/widgets/Slice";
import SlicePlane from "esri/widgets/Slice/SlicePlane";
import { init } from 'esri/core/watchUtils';

interface SliceProps extends __esri.WidgetProperties {
    config: any;
    view: __esri.SceneView;
}

const CSS = {
    base: "slice-panel"
};

@subclass("SlicePanel")
class SlicePanel extends Widget {
    @property()
    config: AppConfig;

    @property()
    view: __esri.SceneView;

    @property()
    @renderable()
    state: string = null;

    @property()
    rootNode: any = null;
    sliceTool: __esri.Slice = null;
    constructor(params: SliceProps) {
        super(params);
    }

    postInitialize() {

    }
    render() {
        const { theme } = this.config;

        return (

            <calcite-panel theme={theme} class={this.classes([theme, CSS.base])}>
                <div bind={this} afterCreate={this._createSliceTool}></div>
                <div class="esri-slice__actions">
                    <button disabled={this.state === "disabled" ? true : false} class="esri-button esri-slice__clear-button esri-button--secondary" onclick={this._handleSliceClear} bind={this} theme={theme}>Clear</button>
                </div>
            </calcite-panel>);
    }
    _createSliceTool(container) {
        this.sliceTool = new Slice({
            view: this.view,
            container
        });
        this.sliceTool.viewModel.tiltEnabled = true;
        init(this.sliceTool, "viewModel.state", (state) => {
            this.state = state;
        });
    }
    _handleSliceClear() {
        if (!this.sliceTool) {
            return;
        }
        this.sliceTool.viewModel.clear();
    }


}

export = SlicePanel;
