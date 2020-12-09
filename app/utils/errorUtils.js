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
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.displayError = void 0;
    function displayError(error) {
        document.body.classList.remove("configurable-application--loading");
        document.body.classList.add("app-error");
        document.getElementById("appMain").innerHTML = "<h1>" + error.title + "</h1><p class='app-error-content'>" + error.message + "</p>";
    }
    exports.displayError = displayError;
});
//# sourceMappingURL=errorUtils.js.map