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
define(["require", "exports", "tslib", "esri/core/accessorSupport/decorators", "esri/widgets/support/widget", "esri/widgets/FeatureTable", "esri/widgets/Widget"], function (require, exports, tslib_1, decorators_1, widget_1, FeatureTable_1, Widget_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    FeatureTable_1 = tslib_1.__importDefault(FeatureTable_1);
    Widget_1 = tslib_1.__importDefault(Widget_1);
    var CSS = {
        base: "feature-table-layer-panel",
        content: "feature-table-layer__content"
    };
    var FeatureTableLayer = /** @class */ (function (_super) {
        tslib_1.__extends(FeatureTableLayer, _super);
        function FeatureTableLayer(props) {
            var _this = _super.call(this, props) || this;
            _this.rootNode = null;
            return _this;
        }
        FeatureTableLayer.prototype.render = function () {
            var _a;
            var theme = this.config.theme;
            return (widget_1.tsx("div", { class: this.classes(CSS.base) },
                widget_1.tsx("calcite-panel", { bind: this, id: this.layer.id + "-table", heightScale: "m", dismissible: true, theme: theme, afterCreate: this._dismissPanel },
                    widget_1.tsx("div", { slot: "header-content" }, (_a = this.layer) === null || _a === void 0 ? void 0 : _a.title),
                    widget_1.tsx("div", { class: CSS.content },
                        widget_1.tsx("div", { class: CSS.content, bind: this, afterCreate: this._createTable })))));
        };
        FeatureTableLayer.prototype._dismissPanel = function (container) {
            var _this = this;
            container.addEventListener("calcitePanelDismissedChange", function () {
                _this.dismissed = true;
            });
        };
        FeatureTableLayer.prototype._createTable = function (container) {
            var _a = this, view = _a.view, layer = _a.layer;
            var featureTable = new FeatureTable_1.default({
                view: view,
                layer: layer,
                container: container
            });
        };
        tslib_1.__decorate([
            decorators_1.property(),
            widget_1.renderable(["config.applySharedTheme", "config.theme"])
        ], FeatureTableLayer.prototype, "config", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], FeatureTableLayer.prototype, "layer", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], FeatureTableLayer.prototype, "view", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], FeatureTableLayer.prototype, "dismissed", void 0);
        FeatureTableLayer = tslib_1.__decorate([
            decorators_1.subclass("FeatureTableLayer")
        ], FeatureTableLayer);
        return FeatureTableLayer;
    }((Widget_1.default)));
    exports.default = FeatureTableLayer;
});
//# sourceMappingURL=FeatureTableLayer.js.map