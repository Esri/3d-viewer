
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

import watchUtils = require("esri/core/watchUtils");
import { aliasOf, property, subclass } from "esri/core/accessorSupport/decorators";

import Widget = require("esri/widgets/Widget");
import HandleRegistry = require("esri/core/Handles");
import { accessibleHandler, renderable, tsx } from "esri/widgets/support/widget";

import SlideViewModel = require("./Slides/SlideViewModel");
import SlideItem = require("./Slides/SlideItem");

import MapView = require("esri/views/MapView");


const CSS = {
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

@subclass("app.Slides")
class Slides extends (Widget) {

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  constructor(params?: any) {
    super(params);
  }

  postInitialize() {
    this.own(
      watchUtils.on(this, "viewModel.bookmarkItems", "change", () => this._bookmarkItemsChanged())
    );

    this._bookmarkItemsChanged();
  }

  destroy() {
    this._handles.destroy();
    this._handles = null;
  }

  //--------------------------------------------------------------------------
  //
  //  Variables
  //
  //--------------------------------------------------------------------------

  _handles: HandleRegistry = new HandleRegistry();

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  //----------------------------------
  //  iconClass
  //----------------------------------

  @property()
  iconClass = CSS.iconClass;

  //----------------------------------
  //  label
  //----------------------------------

  @property()
  containerTitle: string = null;

  //----------------------------------
  //  label
  //----------------------------------

  @property()
  label: string = "Slides";

  //----------------------------------
  //  view
  //----------------------------------

  @aliasOf("viewModel.view")
  view: MapView = null;

  //----------------------------------
  //  viewModel
  //----------------------------------

  @property({
    type: SlideViewModel
  })
  @renderable([
    "state"
  ])
  viewModel: SlideViewModel = new SlideViewModel();

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  render() {


    const bookmarkNodes = this._renderBookmarks();

    const { state } = this.viewModel;
    const containerTitle = this.containerTitle || this.label;
    const bookmarkListNode = state === "ready" && bookmarkNodes.length ? [
      <ul
        aria-label={this.label}
        class={CSS.bookmarkList}
      >{bookmarkNodes}</ul>
    ] :
      state === "loading"
    null;

    return (
      <div class={CSS.base}>
        <div class={CSS.title}>{containerTitle}</div>
        {bookmarkListNode}
      </div>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  private _renderBookmarks(): any {
    const { bookmarkItems } = this.viewModel;

    return bookmarkItems.toArray().map(bookmarkItem => this._renderBookmark(bookmarkItem));
  }

  private _renderBookmark(bookmarkItem: SlideItem): any {
    const { active, name } = bookmarkItem;

    const bookmarkItemClasses = {
      [CSS.bookmarkItemActive]: active
    };
    const title = `Go to ${name}`;
    return (
      <li bind={this}
        data-bookmark-item={bookmarkItem}
        class={this.classes(CSS.bookmarkItem, bookmarkItemClasses)}
        onclick={this._goToBookmark}
        onkeydown={this._goToBookmark}
        tabIndex={0}
        role="button"
        title={title}
        aria-label={name}
      >
        <img class={this.classes(CSS.iconClass, CSS.bookmarkItemIcon)} src={bookmarkItem.slide.thumbnail.url} alt={name} />
        <span class={CSS.bookmarkItemName}>{name}</span>
      </li>
    );
  }

  private _bookmarkItemsChanged(): void {
    const itemsKey = "items";
    const { bookmarkItems } = this.viewModel;
    const { _handles } = this;

    _handles.remove(itemsKey);

    const handles = bookmarkItems.map(bookmarkItem => {
      return watchUtils.watch(bookmarkItem, [
        "active",
        "name"
      ], () => this.scheduleRender());
    });

    _handles.add(handles, itemsKey);

    this.scheduleRender();
  }

  @accessibleHandler()
  private _goToBookmark(event: Event): void {
    const node = event.currentTarget as Element;
    const bookmarkItem = node["data-bookmark-item"] as SlideItem;
    this.viewModel.goTo(bookmarkItem);
  }

}

export = Slides;
