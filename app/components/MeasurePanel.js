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
define(["require", "exports", "tslib", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "esri/widgets/support/widget", "esri/widgets/Measurement"], function (require, exports, tslib_1, decorators_1, Widget, widget_1, Measurement_1) {
    "use strict";
    Measurement_1 = tslib_1.__importDefault(Measurement_1);
    var CSS = {
        base: "measurement-panel"
    };
    var MeasurePanel = /** @class */ (function (_super) {
        tslib_1.__extends(MeasurePanel, _super);
        function MeasurePanel(params) {
            var _this = _super.call(this, params) || this;
            _this.rootNode = null;
            _this.measureTool = null;
            return _this;
        }
        MeasurePanel.prototype.render = function () {
            return (widget_1.tsx("calcite-panel", { theme: this.config.theme, class: this.classes([this.config.theme, CSS.base]) },
                widget_1.tsx("calcite-radio-group", { width: "full", theme: this.config.theme, afterCreate: widget_1.storeNode, "data-node-ref": "rootNode", bind: this, layout: "horizontal", onclick: this._handleButtonClick },
                    widget_1.tsx("calcite-radio-group-item", { value: "direct-line", title: "Measure line", icon: "measure" }, " "),
                    widget_1.tsx("calcite-radio-group-item", { value: "area", title: "Measure area", icon: "measure-area" }, " "),
                    widget_1.tsx("calcite-radio-group-item", { value: "clear", title: "Clear", icon: "trash" }, " ")),
                widget_1.tsx("div", { bind: this, afterCreate: this._createMeasureTool })));
        };
        MeasurePanel.prototype._createMeasureTool = function (container) {
            this.measureTool = new Measurement_1.default({
                view: this.view,
                container: container
            });
        };
        MeasurePanel.prototype._handleButtonClick = function () {
            var _a, _b;
            var selected = (_b = (_a = this.rootNode) === null || _a === void 0 ? void 0 : _a.selectedItem) === null || _b === void 0 ? void 0 : _b.value;
            if (!this.measureTool) {
                return;
            }
            this.measureTool.clear();
            if (selected === "direct-line") {
                this.measureTool.activeTool = "direct-line";
            }
            else if (selected === "area") {
                this.measureTool.activeTool = "area";
            }
        };
        tslib_1.__decorate([
            decorators_1.property()
        ], MeasurePanel.prototype, "config", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], MeasurePanel.prototype, "view", void 0);
        MeasurePanel = tslib_1.__decorate([
            decorators_1.subclass("MeasurePanel")
        ], MeasurePanel);
        return MeasurePanel;
    }(Widget));
    return MeasurePanel;
});
//# sourceMappingURL=MeasurePanel.js.map