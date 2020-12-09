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
define(["require", "exports", "tslib", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "esri/widgets/support/widget", "esri/widgets/Slice", "esri/core/watchUtils"], function (require, exports, tslib_1, decorators_1, Widget, widget_1, Slice_1, watchUtils_1) {
    "use strict";
    Slice_1 = tslib_1.__importDefault(Slice_1);
    var CSS = {
        base: "slice-panel"
    };
    var SlicePanel = /** @class */ (function (_super) {
        tslib_1.__extends(SlicePanel, _super);
        function SlicePanel(params) {
            var _this = _super.call(this, params) || this;
            _this.state = null;
            _this.rootNode = null;
            _this.sliceTool = null;
            return _this;
        }
        SlicePanel.prototype.postInitialize = function () {
        };
        SlicePanel.prototype.render = function () {
            var theme = this.config.theme;
            return (widget_1.tsx("calcite-panel", { theme: theme, class: this.classes([theme, CSS.base]) },
                widget_1.tsx("div", { bind: this, afterCreate: this._createSliceTool }),
                widget_1.tsx("div", { class: "esri-slice__actions" },
                    widget_1.tsx("button", { disabled: this.state === "disabled" ? true : false, class: "esri-button esri-slice__clear-button esri-button--secondary", onclick: this._handleSliceClear, bind: this, theme: theme }, "Clear"))));
        };
        SlicePanel.prototype._createSliceTool = function (container) {
            var _this = this;
            this.sliceTool = new Slice_1.default({
                view: this.view,
                container: container
            });
            this.sliceTool.viewModel.tiltEnabled = true;
            watchUtils_1.init(this.sliceTool, "viewModel.state", function (state) {
                _this.state = state;
            });
        };
        SlicePanel.prototype._handleSliceClear = function () {
            if (!this.sliceTool) {
                return;
            }
            this.sliceTool.viewModel.clear();
        };
        tslib_1.__decorate([
            decorators_1.property()
        ], SlicePanel.prototype, "config", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], SlicePanel.prototype, "view", void 0);
        tslib_1.__decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], SlicePanel.prototype, "state", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], SlicePanel.prototype, "rootNode", void 0);
        SlicePanel = tslib_1.__decorate([
            decorators_1.subclass("SlicePanel")
        ], SlicePanel);
        return SlicePanel;
    }(Widget));
    return SlicePanel;
});
//# sourceMappingURL=SlicePanel.js.map