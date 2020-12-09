
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
import { renderable, tsx } from "esri/widgets/support/widget";

import AppConfig from "../ConfigurationSettings";

import Widget from "esri/widgets/Widget";
import { esriWidgetProps } from '../interfaces/interfaces';

const CSS = {
    base: "media-info-panel",
    content: "media-info-panel__content"
};
@subclass("InfoPanel")
class InfoPanel extends (Widget) {

    @property()
    @renderable(["config.applySharedTheme", "config.theme", "config.splashTitle", "config.splashContnet"])
    config: AppConfig;


    @property()
    view: __esri.MapView;

    @property()
    defaultDescription: any = null;

    @property()
    defaultTitle: string = null;

    constructor(props: esriWidgetProps) {
        super(props);
    }
    initialize() {
        const webmap = this.view.map as __esri.WebMap;
        if (webmap.portalItem) {
            this.defaultDescription = webmap.portalItem.description || webmap.portalItem.snippet;
            this.defaultTitle = webmap.portalItem.title;
        }
    }

    render() {
        const { splashTitle, splashContent, theme } = this.config;

        const title = splashTitle ? splashTitle : this.defaultTitle;

        const content = splashContent ? splashContent : this.defaultDescription;
        return (
            <div class={this.classes(CSS.base)}>
                <calcite-panel theme={theme}>
                    <div slot="header-content">{title}</div>
                    <div class={CSS.content} innerHTML={content}></div>
                </calcite-panel>
            </div>
        );
    }

}
export default InfoPanel;
