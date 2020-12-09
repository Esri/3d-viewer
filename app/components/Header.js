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
define(["require", "exports", "tslib", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "esri/widgets/support/widget", "esri/core/watchUtils"], function (require, exports, tslib_1, decorators_1, Widget, widget_1, watchUtils_1) {
    "use strict";
    var CSS = {
        title: "title-container",
        titleDark: "title-container--dark",
        sharedThemeLogo: "esri-header__shared-theme-logo",
        sharedthemeTitle: "esri-header__shared-theme-title",
        header: "custom-header",
        footer: "custom-footer",
        innerHeader: "custom-inner-header ",
        headerBottom: "custom-header-bottom",
        headerTop: "custom-header-top"
    };
    var Header = /** @class */ (function (_super) {
        tslib_1.__extends(Header, _super);
        function Header(params) {
            var _this = _super.call(this, params) || this;
            // private _customHeaderNode = null;
            _this._previousHeight = null;
            _this._sharedTheme = null;
            _this._customHeaderNode = null;
            _this.portal = null;
            return _this;
        }
        Header.prototype.postInitialize = function () {
            var _this = this;
            this.own([
                watchUtils_1.init(this.config, "customHeaderHTML", function () {
                    _this._handleCustomHeaderContent();
                }),
            ]);
        };
        Header.prototype.render = function () {
            var _a = this.config, customHeaderHTML = _a.customHeaderHTML, customHeaderPositionedAtBottom = _a.customHeaderPositionedAtBottom, title = _a.title;
            this._sharedTheme = this._createSharedTheme();
            var headerContent = null;
            if (customHeaderHTML && customHeaderHTML !== "") {
                headerContent = this._renderCustomHeader();
            }
            else if (title || document.title) {
                headerContent = this._renderDefaultHeader();
            }
            //customHeaderHTML ? this._renderCustomHeader() : this._renderDefaultHeader();
            var positionCSS = customHeaderPositionedAtBottom ? CSS.headerBottom : CSS.headerTop;
            return (widget_1.tsx("div", { bind: this, class: positionCSS, afterUpdate: this.handleHeader }, headerContent));
        };
        Header.prototype.handleHeader = function (headerContainer) {
            var _this = this;
            var headerImage = headerContainer.querySelector("img");
            this._handleHeightDimensions(headerContainer);
            if (headerImage) {
                headerImage.onload = function () {
                    _this._handleHeightDimensions(headerContainer);
                };
            }
        };
        Header.prototype._handleHeightDimensions = function (headerContainer) {
            var viewParentContainer = document.getElementById("splitContainer");
            // Our child element sometimes has a larger margin than parent
            // this leads to collapsing margins so add/remove padding when 
            // calculating height
            var elementHeight = this._outerHeight(headerContainer);
            var height = "calc(100% - " + elementHeight + "px)";
            if (this._previousHeight && this._previousHeight === height) {
                return;
            }
            this._previousHeight = height;
            viewParentContainer.style.height = height;
        };
        Header.prototype._outerHeight = function (el) {
            var height = el.offsetHeight;
            //todo we need to get the proper height here its nested 
            var style = getComputedStyle(el);
            ;
            height += parseInt(style.marginTop) + parseInt(style.marginBottom);
            return height;
        };
        Header.prototype._renderCustomHeader = function () {
            var theme = this.config.theme;
            var sharedThemeStyles = this._getSharedThemeStyles();
            return (widget_1.tsx("div", { style: sharedThemeStyles, key: "custom-header", class: this.classes(CSS.header, theme), afterCreate: this._attachToNode, bind: this._customHeaderNode }));
        };
        Header.prototype._renderDefaultHeader = function () {
            var theme = this.config.theme;
            var sharedThemeStyles = this._getSharedThemeStyles();
            var logo = this._renderSharedThemeLogo();
            var appTitle = this._getTitle();
            return (widget_1.tsx("div", { key: "default-header", style: sharedThemeStyles, class: this.classes("default-header", theme) },
                logo,
                widget_1.tsx("h1", null, appTitle)));
        };
        Header.prototype._renderSharedThemeLogo = function () {
            var _a, _b, _c, _d, _e;
            var applySharedTheme = this.config.applySharedTheme;
            return applySharedTheme ? (((_a = this._sharedTheme) === null || _a === void 0 ? void 0 : _a.logo) ? (widget_1.tsx("div", { class: CSS.sharedThemeLogo }, ((_b = this._sharedTheme) === null || _b === void 0 ? void 0 : _b.logoLink) ? (widget_1.tsx("a", { class: "esri-header__logo-link", href: (_c = this._sharedTheme) === null || _c === void 0 ? void 0 : _c.logoLink, target: "_blank" },
                widget_1.tsx("img", { key: "shared-theme-logo", src: (_d = this._sharedTheme) === null || _d === void 0 ? void 0 : _d.logo }))) : (widget_1.tsx("img", { key: "shared-theme-logo", src: (_e = this._sharedTheme) === null || _e === void 0 ? void 0 : _e.logo })))) : null) : null;
        };
        Header.prototype._getTitle = function () {
            var title = this.config.title;
            if (!title) {
                title = document.title;
            }
            return document.body.clientWidth < 830 && title.length > 40
                ? title
                    .split("")
                    .slice(0, 35)
                    .join("") + "..."
                : document.body.clientWidth > 830 && title.length > 100
                    ? title
                        .split("")
                        .slice(0, 95)
                        .join("") + "..."
                    : title;
        };
        Header.prototype._getSharedThemeStyles = function () {
            var _a;
            var applySharedTheme = this.config.applySharedTheme;
            var theme = null;
            if (applySharedTheme && ((_a = this._sharedTheme) === null || _a === void 0 ? void 0 : _a.background) && this._sharedTheme.text) {
                theme = "background:" + this._sharedTheme.background + "; color:" + this._sharedTheme.text;
            }
            return theme;
        };
        Header.prototype._attachToNode = function (node) {
            var content = this;
            node.appendChild(content);
        };
        Header.prototype._createSharedTheme = function () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            var applySharedTheme = this.config.applySharedTheme;
            var sharedTheme = null;
            if (((_b = (_a = this === null || this === void 0 ? void 0 : this.portal) === null || _a === void 0 ? void 0 : _a.portalProperties) === null || _b === void 0 ? void 0 : _b.sharedTheme) && applySharedTheme) {
                var theme = (_d = (_c = this === null || this === void 0 ? void 0 : this.portal) === null || _c === void 0 ? void 0 : _c.portalProperties) === null || _d === void 0 ? void 0 : _d.sharedTheme;
                sharedTheme = {
                    background: (_e = theme === null || theme === void 0 ? void 0 : theme.header) === null || _e === void 0 ? void 0 : _e.background,
                    text: (_f = theme === null || theme === void 0 ? void 0 : theme.header) === null || _f === void 0 ? void 0 : _f.text,
                    logo: (_g = theme === null || theme === void 0 ? void 0 : theme.logo) === null || _g === void 0 ? void 0 : _g.small,
                    logoLink: (_h = theme === null || theme === void 0 ? void 0 : theme.logo) === null || _h === void 0 ? void 0 : _h.link
                };
            }
            return sharedTheme;
        };
        Header.prototype._handleCustomHeaderContent = function () {
            var content = document.createElement("div");
            // add 1px margin here to avoid margin collapse
            content.classList.add("custom-inner-header");
            content.innerHTML = this.config.customHeaderHTML;
            this._customHeaderNode = content;
            this.scheduleRender();
        };
        tslib_1.__decorate([
            decorators_1.property()
        ], Header.prototype, "portal", void 0);
        tslib_1.__decorate([
            decorators_1.property(),
            widget_1.renderable(["config.applySharedTheme", "config.title", "config.theme", "config.customHeader", "config.customHeaderHTML", "config.customHeaderPositionedAtBottom"])
        ], Header.prototype, "config", void 0);
        Header = tslib_1.__decorate([
            decorators_1.subclass("Header")
        ], Header);
        return Header;
    }(Widget));
    return Header;
});
//# sourceMappingURL=Header.js.map