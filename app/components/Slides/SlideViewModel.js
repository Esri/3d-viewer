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
define(["require", "exports", "tslib", "esri/core/accessorSupport/decorators", "esri/core/Accessor", "esri/core/Handles", "esri/core/promiseUtils", "esri/core/watchUtils", "esri/core/Collection", "./SlideItem"], function (require, exports, tslib_1, decorators_1, Accessor, HandleRegistry, promiseUtils, watchUtils, Collection, SlideItem) {
    "use strict";
    var SlideItemCollection = Collection.ofType(SlideItem);
    var SlidesViewModel = /** @class */ (function (_super) {
        tslib_1.__extends(SlidesViewModel, _super);
        function SlidesViewModel() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
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
            //  bookmarkItems
            //----------------------------------
            _this.bookmarkItems = new SlideItemCollection;
            //----------------------------------
            //  view
            //----------------------------------
            _this.view = null;
            return _this;
        }
        //--------------------------------------------------------------------------
        //
        //  Lifecycle
        //
        //--------------------------------------------------------------------------
        SlidesViewModel.prototype.initialize = function () {
            var _this = this;
            this._handles.add(watchUtils.init(this, "view", function (view) { return _this._viewUpdated(view); }));
        };
        SlidesViewModel.prototype.destroy = function () {
            this._handles.destroy();
            this._handles = null;
            this.view = null;
            this.bookmarkItems.removeAll();
        };
        Object.defineProperty(SlidesViewModel.prototype, "state", {
            //----------------------------------
            //  state
            //----------------------------------
            get: function () {
                var view = this.get("view");
                var ready = this.get("view.ready");
                return ready ? "ready" :
                    view ? "loading" : "disabled";
            },
            enumerable: false,
            configurable: true
        });
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        SlidesViewModel.prototype.goTo = function (bookmarkItem) {
            var view = this.view;
            if (!bookmarkItem) {
                return promiseUtils.reject(new Error("BookmarkItem is required"));
            }
            if (!view) {
                return promiseUtils.reject(new Error("View is required"));
            }
            bookmarkItem.active = true;
            var slide = bookmarkItem.slide;
            return slide.applyTo(view).then(function () {
                bookmarkItem.active = false;
                bookmarkItem.active = false;
            });
        };
        //--------------------------------------------------------------------------
        //
        //  Private Methods
        //
        //--------------------------------------------------------------------------
        SlidesViewModel.prototype._viewUpdated = function (view) {
            var _this = this;
            var _handles = this._handles;
            var mapHandleKey = "map";
            _handles.remove(mapHandleKey);
            if (!view) {
                return;
            }
            view.when(function () {
                _handles.add(watchUtils.init(view, "map", function (map) { return _this._mapUpdated(map); }), mapHandleKey);
            });
        };
        SlidesViewModel.prototype._mapUpdated = function (map) {
            if (!map) {
                return;
            }
            var bookmarkItems = this.bookmarkItems;
            bookmarkItems.removeAll();
            var slides = map.presentation.slides;
            slides.forEach(function (slide) {
                bookmarkItems.add(new SlideItem({
                    slide: slide,
                    name: slide.title.text
                }));
            });
        };
        tslib_1.__decorate([
            decorators_1.property({
                type: SlideItemCollection
            })
        ], SlidesViewModel.prototype, "bookmarkItems", void 0);
        tslib_1.__decorate([
            decorators_1.property({
                dependsOn: ["view.ready"],
                readOnly: true
            })
        ], SlidesViewModel.prototype, "state", null);
        tslib_1.__decorate([
            decorators_1.property()
        ], SlidesViewModel.prototype, "view", void 0);
        SlidesViewModel = tslib_1.__decorate([
            decorators_1.subclass("app.SlidesViewModel")
        ], SlidesViewModel);
        return SlidesViewModel;
    }((Accessor)));
    return SlidesViewModel;
});
//# sourceMappingURL=SlideViewModel.js.map