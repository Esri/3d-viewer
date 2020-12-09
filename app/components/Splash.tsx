
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
import i18n = require("dojo/i18n!../nls/resources");
import Widget from "esri/widgets/Widget";
import { esriWidgetProps } from '../interfaces/interfaces';

const CSS = {
    base: "media-splash-panel",
    content: "media-splash-panel__content"
};
@subclass("InfoPanel")
class Splash extends (Widget) {
    @property()
    @renderable(["config.applySharedTheme", "config.theme", "config.splashTitle", "config.splashContent", "splashButtonText"])
    config: AppConfig;

    @property()
    view: __esri.MapView;

    @property()
    defaultDescription: any = null;

    @property()
    defaultTitle: string = null;

    rootNode: HTMLElement = null;
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
        const { splashTitle, splashContent, splashButtonText, theme } = this.config;

        const title = splashTitle ? splashTitle : this.defaultTitle;
        const content = splashContent ? splashContent : this.defaultDescription;
        return (
            <div class={CSS.base}>
                <calcite-modal
                    aria-labelledby="modal-title"
                    disable-escape=""
                    disable-close-button=""
                    data-node-ref="rootNode"
                    bind={this}
                    afterUpdate={storeNode}
                    afterCreate={this.displaySplash}
                    theme={theme}
                    class={this.classes(CSS.base)}>
                    <h2 id="modal-title" slot="header">{title}</h2>
                    <div theme={theme} slot="content" innerHTML={content}>

                    </div>
                    <calcite-button bind={this} onclick={this._closePanel} slot="primary" width="full" >
                        {splashButtonText ? splashButtonText : i18n.tools.splash.close}
                    </calcite-button>

                </calcite-modal>
            </div>

        );
    }
    _closePanel() {
        if (this.rootNode) {
            this.rootNode.removeAttribute("active");
        }
    }
    displaySplash(container) {
        // if there isn't a value in session storage 
        //show the splash screen 
        const sameSession = window.sessionStorage.getItem("splash-key");
        if (!sameSession) {
            container.setAttribute("active", "");
            window.sessionStorage.setItem("splash-key", "true");
        }

    }
    open() {
        // enable disable splash by adding and removing active prop
        if (this.rootNode) {
            this.rootNode.setAttribute("active", "");
        }
    }

}
export default Splash;
