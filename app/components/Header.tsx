
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

import { subclass, property } from "esri/core/accessorSupport/decorators";
import Widget = require("esri/widgets/Widget");
import AppConfig from "../ConfigurationSettings";

import { renderable, tsx } from "esri/widgets/support/widget";
import { VNode } from "../interfaces/interfaces";
import { esriWidgetProps } from 'ApplicationBase/support/widgetConfigUtils/widgetConfigUtils';
import { init } from 'esri/core/watchUtils';

const CSS = {
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

interface SharedThemeStyles {
  background?: string,
  text?: string,
  logoLink?: string,
  logo?: string
}
@subclass("Header")
class Header extends Widget {
  // private _customHeaderNode = null;
  private _previousHeight: string = null;
  private _sharedTheme: SharedThemeStyles = null;
  private _customHeaderNode = null;
  constructor(params: esriWidgetProps) {
    super(params);
  }
  postInitialize() {
    this.own([
      init(this.config, "customHeaderHTML", () => {
        this._handleCustomHeaderContent();
      }),
    ]);
  }
  @property()
  portal: __esri.Portal = null;
  @property()
  @renderable(["config.applySharedTheme", "config.title", "config.theme", "config.customHeader", "config.customHeaderHTML", "config.customHeaderPositionedAtBottom"])
  config: AppConfig;


  render() {
    const { customHeaderHTML, customHeaderPositionedAtBottom, title } = this.config;

    this._sharedTheme = this._createSharedTheme();
    let headerContent = null;

    if (customHeaderHTML && customHeaderHTML !== "") {
      headerContent = this._renderCustomHeader();
    } else if (title || document.title) {
      headerContent = this._renderDefaultHeader();
    }
    //customHeaderHTML ? this._renderCustomHeader() : this._renderDefaultHeader();
    const positionCSS = customHeaderPositionedAtBottom ? CSS.headerBottom : CSS.headerTop;

    return (
      <div bind={this} class={positionCSS} afterUpdate={this.handleHeader}>
        {headerContent}
      </div>
    );
  }

  handleHeader(headerContainer: HTMLElement) {
    const headerImage = headerContainer.querySelector(
      "img"
    ) as HTMLImageElement;
    this._handleHeightDimensions(headerContainer);
    if (headerImage) {
      headerImage.onload = () => {
        this._handleHeightDimensions(headerContainer);
      };
    }
  }

  private _handleHeightDimensions(headerContainer: HTMLElement): void {
    const viewParentContainer = document.getElementById(
      "splitContainer"
    );
    // Our child element sometimes has a larger margin than parent
    // this leads to collapsing margins so add/remove padding when 
    // calculating height
    const elementHeight = this._outerHeight(headerContainer);

    const height = `calc(100% - ${elementHeight}px)`;
    if (this._previousHeight && this._previousHeight === height) {
      return;
    }
    this._previousHeight = height;
    viewParentContainer.style.height = height;
  }
  private _outerHeight(el) {
    var height = el.offsetHeight;
    //todo we need to get the proper height here its nested 
    var style = getComputedStyle(el);;
    height += parseInt(style.marginTop) + parseInt(style.marginBottom);
    return height;
  }
  _renderCustomHeader() {
    const { theme } = this.config;
    const sharedThemeStyles = this._getSharedThemeStyles();
    return (
      <div style={sharedThemeStyles} key="custom-header" class={this.classes(CSS.header, theme)} afterCreate={this._attachToNode} bind={this._customHeaderNode}></div>)
  }
  private _renderDefaultHeader() {
    const { theme } = this.config;
    const sharedThemeStyles = this._getSharedThemeStyles();
    const logo = this._renderSharedThemeLogo();
    const appTitle = this._getTitle();

    return (
      <div
        key="default-header"
        style={sharedThemeStyles}
        class={this.classes("default-header", theme)}>
        {logo}
        <h1>{appTitle}</h1>
      </div>
    );
  }

  private _renderSharedThemeLogo(): VNode {
    const { applySharedTheme } = this.config;
    return applySharedTheme ? (
      this._sharedTheme?.logo ? (
        <div class={CSS.sharedThemeLogo}>
          {this._sharedTheme?.logoLink ? (
            <a
              class="esri-header__logo-link"
              href={this._sharedTheme?.logoLink}
              target="_blank"
            >
              <img key="shared-theme-logo" src={this._sharedTheme?.logo} />
            </a>
          ) : (
              <img key="shared-theme-logo" src={this._sharedTheme?.logo} />
            )}
        </div>
      ) : null
    ) : null;
  }

  private _getTitle(): string {
    let { title } = this.config;
    if (!title) {
      title = document.title;
    }

    return document.body.clientWidth < 830 && title.length > 40
      ? `${title
        .split("")
        .slice(0, 35)
        .join("")}...`
      : document.body.clientWidth > 830 && title.length > 100
        ? `${title
          .split("")
          .slice(0, 95)
          .join("")}...`
        : title;
  }

  private _getSharedThemeStyles(): any {
    const { applySharedTheme } = this.config
    let theme = null;
    if (applySharedTheme && this._sharedTheme?.background && this._sharedTheme.text) {
      theme = `background:${this._sharedTheme.background}; color:${this._sharedTheme.text}`
    }
    return theme;
  }
  private _attachToNode(node) {
    var content = this;
    node.appendChild(content);
  }
  private _createSharedTheme(): SharedThemeStyles {
    const { applySharedTheme } = this.config;

    let sharedTheme: any = null;
    if (this?.portal?.portalProperties?.sharedTheme && applySharedTheme) {
      const theme = this?.portal?.portalProperties?.sharedTheme;
      sharedTheme = {
        background: theme?.header?.background,
        text: theme?.header?.text,
        logo: theme?.logo?.small,
        logoLink: theme?.logo?.link
      };
    }
    return sharedTheme;
  }

  private _handleCustomHeaderContent(): void {
    const content = document.createElement("div") as any;
    // add 1px margin here to avoid margin collapse
    content.classList.add("custom-inner-header");
    content.innerHTML = this.config.customHeaderHTML;
    this._customHeaderNode = content;
    this.scheduleRender();
  }
}

export = Header;
