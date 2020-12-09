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
define(["require", "exports", "tslib", "esri/core/accessorSupport/decorators", "esri/widgets/support/widget", "esri/widgets/Widget"], function (require, exports, tslib_1, decorators_1, widget_1, Widget_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Widget_1 = tslib_1.__importDefault(Widget_1);
    var CSS = {
        base: "media-info-panel",
        content: "media-info-panel__content"
    };
    var InfoPanel = /** @class */ (function (_super) {
        tslib_1.__extends(InfoPanel, _super);
        function InfoPanel(props) {
            var _this = _super.call(this, props) || this;
            _this.defaultDescription = null;
            _this.defaultTitle = null;
            return _this;
        }
        InfoPanel.prototype.initialize = function () {
            var webmap = this.view.map;
            if (webmap.portalItem) {
                this.defaultDescription = webmap.portalItem.description || webmap.portalItem.snippet;
                this.defaultTitle = webmap.portalItem.title;
            }
        };
        InfoPanel.prototype.render = function () {
            var _a = this.config, splashTitle = _a.splashTitle, splashContent = _a.splashContent, theme = _a.theme;
            var title = splashTitle ? splashTitle : this.defaultTitle;
            var content = splashContent ? splashContent : this.defaultDescription;
            return (widget_1.tsx("div", { class: this.classes(CSS.base) },
                widget_1.tsx("calcite-panel", { theme: theme },
                    widget_1.tsx("div", { slot: "header-content" }, title),
                    widget_1.tsx("div", { class: CSS.content, innerHTML: content }))));
        };
        tslib_1.__decorate([
            decorators_1.property(),
            widget_1.renderable(["config.applySharedTheme", "config.theme", "config.splashTitle", "config.splashContnet"])
        ], InfoPanel.prototype, "config", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], InfoPanel.prototype, "view", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], InfoPanel.prototype, "defaultDescription", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], InfoPanel.prototype, "defaultTitle", void 0);
        InfoPanel = tslib_1.__decorate([
            decorators_1.subclass("InfoPanel")
        ], InfoPanel);
        return InfoPanel;
    }((Widget_1.default)));
    exports.default = InfoPanel;
});
//# sourceMappingURL=InfoPanel.js.map