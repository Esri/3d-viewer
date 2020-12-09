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
define(["require", "exports", "tslib", "dojo/i18n!../nls/resources", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "esri/widgets/support/widget"], function (require, exports, tslib_1, i18n, decorators_1, Widget_1, widget_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Widget_1 = tslib_1.__importDefault(Widget_1);
    var CSS = {
        base: "scroll-overlay",
        button: "scroll-overlay-button",
        buttonTop: "scroll-overlay-top"
    };
    var ScrollOverlay = /** @class */ (function (_super) {
        tslib_1.__extends(ScrollOverlay, _super);
        function ScrollOverlay(props) {
            return _super.call(this, props) || this;
        }
        ScrollOverlay.prototype.initialize = function () {
            if (this.config.disableScroll && this.view) {
                this.toggleInteraction();
            }
            ;
        };
        ScrollOverlay.prototype.render = function () {
            var _a = this.config, customHeaderPositionedAtBottom = _a.customHeaderPositionedAtBottom, customHeader = _a.customHeader;
            return (widget_1.tsx("div", { class: this.classes([CSS.base, this.config.theme]) },
                widget_1.tsx("calcite-button", { appearance: "solid", bind: this, onclick: this.toggleInteraction, afterCreate: widget_1.storeNode, "data-node-ref": "scrollOverlayButton", class: this.classes(CSS.button, customHeader && customHeaderPositionedAtBottom ? CSS.buttonTop : null), scale: "m", color: this.config.theme, width: "auto" }, i18n.scrollMessage)));
        };
        ScrollOverlay.prototype.toggleInteraction = function () {
            var _a = this.view.navigation, mouseWheelZoomEnabled = _a.mouseWheelZoomEnabled, browserTouchPanEnabled = _a.browserTouchPanEnabled;
            var isEnabled = mouseWheelZoomEnabled && browserTouchPanEnabled;
            this.view.navigation.mouseWheelZoomEnabled = !isEnabled;
            this.view.navigation.browserTouchPanEnabled = !isEnabled;
            if (this === null || this === void 0 ? void 0 : this.scrollOverlayButton) {
                this.scrollOverlayButton.innerHTML = isEnabled ? i18n.scrollMessage : i18n.disableScrollMessage;
            }
        };
        ScrollOverlay.prototype._createScrollButton = function () {
            return widget_1.tsx("div", { class: this.classes([CSS.base, this.config.theme]) },
                widget_1.tsx("calcite-button", { appearance: "solid", bind: this, onclick: this.toggleInteraction, afterCreate: widget_1.storeNode, "data-node-ref": "scrollOverlayButton", class: CSS.button, scale: "s", color: this.config.theme, width: "auto" }, i18n.scrollMessage));
        };
        tslib_1.__decorate([
            decorators_1.property(),
            widget_1.renderable("config.customHeaderPositionedAtBottom,config.customHeader")
        ], ScrollOverlay.prototype, "config", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], ScrollOverlay.prototype, "view", void 0);
        ScrollOverlay = tslib_1.__decorate([
            decorators_1.subclass("ScrollOverlay")
        ], ScrollOverlay);
        return ScrollOverlay;
    }((Widget_1.default)));
    exports.default = ScrollOverlay;
});
//# sourceMappingURL=ScrollOverlay.js.map