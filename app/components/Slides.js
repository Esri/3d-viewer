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
define(["require", "exports", "tslib", "esri/core/watchUtils", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "esri/core/Handles", "esri/widgets/support/widget", "./Slides/SlideViewModel"], function (require, exports, tslib_1, watchUtils, decorators_1, Widget, HandleRegistry, widget_1, SlideViewModel) {
    "use strict";
    var CSS = {
        base: "app-bookmarks",
        title: "app-bookmarks-title",
        loading: "app-bookmarks__loading",
        loadingIcon: "esri-icon-loading-indicator esri-rotating",
        fadeIn: "app-bookmarks--fade-in",
        iconClass: "esri-icon-labels",
        bookmarkList: "app-bookmarks__list",
        bookmarkItem: "app-bookmarks__item",
        bookmarkItemIcon: "app-bookmarks__item-icon",
        bookmarkItemName: "app-bookmarks__item-name",
        bookmarkItemActive: "app-bookmarks__item--active"
    };
    var Slides = /** @class */ (function (_super) {
        tslib_1.__extends(Slides, _super);
        //--------------------------------------------------------------------------
        //
        //  Lifecycle
        //
        //--------------------------------------------------------------------------
        function Slides(params) {
            var _this = _super.call(this, params) || this;
            //--------------------------------------------------------------------------
            //
            //  Variables
            //
            //--------------------------------------------------------------------------
            _this._handles = new HandleRegistry();
            //--------------------------------------------------------------------------
            //
            //  Properties
            //
            //--------------------------------------------------------------------------
            //----------------------------------
            //  iconClass
            //----------------------------------
            _this.iconClass = CSS.iconClass;
            //----------------------------------
            //  label
            //----------------------------------
            _this.containerTitle = null;
            //----------------------------------
            //  label
            //----------------------------------
            _this.label = "Slides";
            //----------------------------------
            //  view
            //----------------------------------
            _this.view = null;
            //----------------------------------
            //  viewModel
            //----------------------------------
            _this.viewModel = new SlideViewModel();
            return _this;
        }
        Slides.prototype.postInitialize = function () {
            var _this = this;
            this.own(watchUtils.on(this, "viewModel.bookmarkItems", "change", function () { return _this._bookmarkItemsChanged(); }));
            this._bookmarkItemsChanged();
        };
        Slides.prototype.destroy = function () {
            this._handles.destroy();
            this._handles = null;
        };
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        Slides.prototype.render = function () {
            var bookmarkNodes = this._renderBookmarks();
            var state = this.viewModel.state;
            var containerTitle = this.containerTitle || this.label;
            var bookmarkListNode = state === "ready" && bookmarkNodes.length ? [
                widget_1.tsx("ul", { "aria-label": this.label, class: CSS.bookmarkList }, bookmarkNodes)
            ] :
                state === "loading";
            null;
            return (widget_1.tsx("div", { class: CSS.base },
                widget_1.tsx("div", { class: CSS.title }, containerTitle),
                bookmarkListNode));
        };
        //--------------------------------------------------------------------------
        //
        //  Private Methods
        //
        //--------------------------------------------------------------------------
        Slides.prototype._renderBookmarks = function () {
            var _this = this;
            var bookmarkItems = this.viewModel.bookmarkItems;
            return bookmarkItems.toArray().map(function (bookmarkItem) { return _this._renderBookmark(bookmarkItem); });
        };
        Slides.prototype._renderBookmark = function (bookmarkItem) {
            var _a;
            var active = bookmarkItem.active, name = bookmarkItem.name;
            var bookmarkItemClasses = (_a = {},
                _a[CSS.bookmarkItemActive] = active,
                _a);
            var title = "Go to " + name;
            return (widget_1.tsx("li", { bind: this, "data-bookmark-item": bookmarkItem, class: this.classes(CSS.bookmarkItem, bookmarkItemClasses), onclick: this._goToBookmark, onkeydown: this._goToBookmark, tabIndex: 0, role: "button", title: title, "aria-label": name },
                widget_1.tsx("img", { class: this.classes(CSS.iconClass, CSS.bookmarkItemIcon), src: bookmarkItem.slide.thumbnail.url, alt: name }),
                widget_1.tsx("span", { class: CSS.bookmarkItemName }, name)));
        };
        Slides.prototype._bookmarkItemsChanged = function () {
            var _this = this;
            var itemsKey = "items";
            var bookmarkItems = this.viewModel.bookmarkItems;
            var _handles = this._handles;
            _handles.remove(itemsKey);
            var handles = bookmarkItems.map(function (bookmarkItem) {
                return watchUtils.watch(bookmarkItem, [
                    "active",
                    "name"
                ], function () { return _this.scheduleRender(); });
            });
            _handles.add(handles, itemsKey);
            this.scheduleRender();
        };
        Slides.prototype._goToBookmark = function (event) {
            var node = event.currentTarget;
            var bookmarkItem = node["data-bookmark-item"];
            this.viewModel.goTo(bookmarkItem);
        };
        tslib_1.__decorate([
            decorators_1.property()
        ], Slides.prototype, "iconClass", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], Slides.prototype, "containerTitle", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], Slides.prototype, "label", void 0);
        tslib_1.__decorate([
            decorators_1.aliasOf("viewModel.view")
        ], Slides.prototype, "view", void 0);
        tslib_1.__decorate([
            decorators_1.property({
                type: SlideViewModel
            }),
            widget_1.renderable([
                "state"
            ])
        ], Slides.prototype, "viewModel", void 0);
        tslib_1.__decorate([
            widget_1.accessibleHandler()
        ], Slides.prototype, "_goToBookmark", null);
        Slides = tslib_1.__decorate([
            decorators_1.subclass("app.Slides")
        ], Slides);
        return Slides;
    }((Widget)));
    return Slides;
});
//# sourceMappingURL=Slides.js.map