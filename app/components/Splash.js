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
define(["require", "exports", "tslib", "esri/core/accessorSupport/decorators", "esri/widgets/support/widget", "dojo/i18n!../nls/resources", "esri/widgets/Widget"], function (require, exports, tslib_1, decorators_1, widget_1, i18n, Widget_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Widget_1 = tslib_1.__importDefault(Widget_1);
    var CSS = {
        base: "media-splash-panel",
        content: "media-splash-panel__content"
    };
    var Splash = /** @class */ (function (_super) {
        tslib_1.__extends(Splash, _super);
        function Splash(props) {
            var _this = _super.call(this, props) || this;
            _this.defaultDescription = null;
            _this.defaultTitle = null;
            _this.rootNode = null;
            return _this;
        }
        Splash.prototype.initialize = function () {
            var webmap = this.view.map;
            if (webmap.portalItem) {
                this.defaultDescription = webmap.portalItem.description || webmap.portalItem.snippet;
                this.defaultTitle = webmap.portalItem.title;
            }
        };
        Splash.prototype.render = function () {
            var _a = this.config, splashTitle = _a.splashTitle, splashContent = _a.splashContent, splashButtonText = _a.splashButtonText, theme = _a.theme;
            var title = splashTitle ? splashTitle : this.defaultTitle;
            var content = splashContent ? splashContent : this.defaultDescription;
            return (widget_1.tsx("div", { class: CSS.base },
                widget_1.tsx("calcite-modal", { "aria-labelledby": "modal-title", "disable-escape": "", "disable-close-button": "", "data-node-ref": "rootNode", bind: this, afterUpdate: widget_1.storeNode, afterCreate: this.displaySplash, theme: theme, class: this.classes(CSS.base) },
                    widget_1.tsx("h2", { id: "modal-title", slot: "header" }, title),
                    widget_1.tsx("div", { theme: theme, slot: "content", innerHTML: content }),
                    widget_1.tsx("calcite-button", { bind: this, onclick: this._closePanel, slot: "primary", width: "full" }, splashButtonText ? splashButtonText : i18n.tools.splash.close))));
        };
        Splash.prototype._closePanel = function () {
            if (this.rootNode) {
                this.rootNode.removeAttribute("active");
            }
        };
        Splash.prototype.displaySplash = function (container) {
            // if there isn't a value in session storage 
            //show the splash screen 
            var sameSession = window.sessionStorage.getItem("splash-key");
            if (!sameSession) {
                container.setAttribute("active", "");
                window.sessionStorage.setItem("splash-key", "true");
            }
        };
        Splash.prototype.open = function () {
            // enable disable splash by adding and removing active prop
            if (this.rootNode) {
                this.rootNode.setAttribute("active", "");
            }
        };
        tslib_1.__decorate([
            decorators_1.property(),
            widget_1.renderable(["config.applySharedTheme", "config.theme", "config.splashTitle", "config.splashContent", "splashButtonText"])
        ], Splash.prototype, "config", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], Splash.prototype, "view", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], Splash.prototype, "defaultDescription", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], Splash.prototype, "defaultTitle", void 0);
        Splash = tslib_1.__decorate([
            decorators_1.subclass("InfoPanel")
        ], Splash);
        return Splash;
    }((Widget_1.default)));
    exports.default = Splash;
});
//# sourceMappingURL=Splash.js.map