/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/code.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/code.ts":
/*!*********************!*\
  !*** ./src/code.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shared */ "./src/shared.ts");

figma.showUI(__html__, { visible: false, height: 265 });
const delimiter = ', ';
figma.clientStorage.getAsync(_shared__WEBPACK_IMPORTED_MODULE_0__["KEYS"].PROPERTY_NAME).then((val) => {
    if (val)
        figma.ui.postMessage({ param: _shared__WEBPACK_IMPORTED_MODULE_0__["KEYS"].PROPERTY_NAME, val });
});
figma.clientStorage.getAsync(_shared__WEBPACK_IMPORTED_MODULE_0__["KEYS"].FROM_VARIANT).then((val) => {
    if (val !== undefined)
        figma.ui.postMessage({ param: _shared__WEBPACK_IMPORTED_MODULE_0__["KEYS"].FROM_VARIANT, val });
});
figma.clientStorage.getAsync(_shared__WEBPACK_IMPORTED_MODULE_0__["KEYS"].TO_VARIANT).then((val) => {
    if (val)
        figma.ui.postMessage({ param: _shared__WEBPACK_IMPORTED_MODULE_0__["KEYS"].TO_VARIANT, val });
});
figma.clientStorage.getAsync(_shared__WEBPACK_IMPORTED_MODULE_0__["KEYS"].DEEP_SWITCH).then((val) => {
    if (val)
        figma.ui.postMessage({ param: _shared__WEBPACK_IMPORTED_MODULE_0__["KEYS"].DEEP_SWITCH, val });
});
let switchCount = 0;
// show the UI when we finish initializing clientStorage
setTimeout(() => {
    figma.ui.show();
}, 250);
function traverse(node, propertyName, fromVariant, toVariant, deepSwitch) {
    // find an instance
    // the instance need to come from some kind of component set (i.e., has a parent)
    let parentSwapped = false;
    if (node && node.type == 'INSTANCE' && node.mainComponent.parent) {
        let nodeProperties = node.mainComponent.name.split(delimiter);
        // the instance comes from a component with variances set in them
        // and there is the variant we are looking for
        let propertyIndex = -1;
        if (fromVariant !== '') {
            propertyIndex = nodeProperties.indexOf(`${propertyName}=${fromVariant}`);
        }
        else {
            // the user didn't provide any fromVariant
            // changing all instances with the "propertyName" property to "toVariant"
            propertyIndex = nodeProperties.findIndex((property) => property.startsWith(`${propertyName}=`));
        }
        // do not swap if somehow the instance is already on the "toVariant"
        const isOnToVariant = nodeProperties.indexOf(`${propertyName}=${toVariant}`) !== -1;
        // do the swapping
        if (node.mainComponent.parent.type === 'COMPONENT_SET' && propertyIndex !== -1 && !isOnToVariant) {
            nodeProperties[propertyIndex] = `${propertyName}=${toVariant}`;
            let changeToSibling = node.mainComponent.parent.findChild((sibling) => sibling.name === nodeProperties.join(delimiter));
            // we found a sibling with the property swapped out
            if (changeToSibling) {
                node.swapComponent(changeToSibling);
                parentSwapped = true;
                switchCount++;
            }
            // we couldn't find a good sibling with the exact property,
            // but try again to find at least one with the property we care about
            else {
                changeToSibling = node.mainComponent.parent.findChild((sibling) => sibling.name.split(delimiter).includes(`${propertyName}=${toVariant}`));
                if (changeToSibling) {
                    node.swapComponent(changeToSibling);
                    parentSwapped = true;
                    switchCount++;
                }
            }
        }
    }
    // now that we are done swapping, look to see if any child component is swappable
    // if deepSwitch is checked and parent is swapped, we don't want to look further in this layer tree
    if ('children' in node && (deepSwitch || !parentSwapped)) {
        for (const child of node.children) {
            traverse(child, propertyName, fromVariant, toVariant, deepSwitch);
        }
    }
}
figma.ui.onmessage = (msg) => {
    // remember these params and save to client storage
    figma.clientStorage.setAsync(_shared__WEBPACK_IMPORTED_MODULE_0__["KEYS"].PROPERTY_NAME, msg.propertyName);
    figma.clientStorage.setAsync(_shared__WEBPACK_IMPORTED_MODULE_0__["KEYS"].FROM_VARIANT, msg.fromVariant);
    figma.clientStorage.setAsync(_shared__WEBPACK_IMPORTED_MODULE_0__["KEYS"].TO_VARIANT, msg.toVariant);
    figma.clientStorage.setAsync(_shared__WEBPACK_IMPORTED_MODULE_0__["KEYS"].DEEP_SWITCH, msg.deepSwitch);
    // if user selected something, then we look at the selection
    if (figma.currentPage.selection.length) {
        for (const node of figma.currentPage.selection) {
            traverse(node, msg.propertyName, msg.fromVariant, msg.toVariant, msg.deepSwitch === 'true');
        }
    }
    // the user didn't select anything, then let's change the entire page
    else {
        traverse(figma.currentPage, msg.propertyName, msg.fromVariant, msg.toVariant, msg.deepSwitch === 'true');
    }
    // snackbar feedback
    if (switchCount === 0) {
        figma.notify(`😕 Variant Switcher couldn't find anything to switch to "${msg.propertyName}=${msg.toVariant}".`);
    }
    else if (switchCount === 1) {
        figma.notify(`Changed 1 instance's "${msg.propertyName}" to "${msg.toVariant}".`);
    }
    else {
        figma.notify(`Changed ${switchCount} instances' "${msg.propertyName}" to "${msg.toVariant}".`);
    }
    figma.closePlugin();
};


/***/ }),

/***/ "./src/shared.ts":
/*!***********************!*\
  !*** ./src/shared.ts ***!
  \***********************/
/*! exports provided: KEYS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEYS", function() { return KEYS; });
const KEYS = {
    PROPERTY_NAME: 'property-name',
    FROM_VARIANT: 'from-variant',
    TO_VARIANT: 'to-variant',
    DEEP_SWITCH: 'deep-switch',
};


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvZGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NoYXJlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBZ0M7QUFDaEMsd0JBQXdCLDhCQUE4QjtBQUN0RDtBQUNBLDZCQUE2Qiw0Q0FBSTtBQUNqQztBQUNBLDhCQUE4QixRQUFRLDRDQUFJLHFCQUFxQjtBQUMvRCxDQUFDO0FBQ0QsNkJBQTZCLDRDQUFJO0FBQ2pDO0FBQ0EsOEJBQThCLFFBQVEsNENBQUksb0JBQW9CO0FBQzlELENBQUM7QUFDRCw2QkFBNkIsNENBQUk7QUFDakM7QUFDQSw4QkFBOEIsUUFBUSw0Q0FBSSxrQkFBa0I7QUFDNUQsQ0FBQztBQUNELDZCQUE2Qiw0Q0FBSTtBQUNqQztBQUNBLDhCQUE4QixRQUFRLDRDQUFJLG1CQUFtQjtBQUM3RCxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0QsYUFBYSxHQUFHLFlBQVk7QUFDbEY7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwRkFBMEYsYUFBYTtBQUN2RztBQUNBO0FBQ0Esd0RBQXdELGFBQWEsR0FBRyxVQUFVO0FBQ2xGO0FBQ0E7QUFDQSwrQ0FBK0MsYUFBYSxHQUFHLFVBQVU7QUFDekU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2SEFBNkgsYUFBYSxHQUFHLFVBQVU7QUFDdko7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLDRDQUFJO0FBQ3JDLGlDQUFpQyw0Q0FBSTtBQUNyQyxpQ0FBaUMsNENBQUk7QUFDckMsaUNBQWlDLDRDQUFJO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlGQUFpRixpQkFBaUIsR0FBRyxjQUFjO0FBQ25IO0FBQ0E7QUFDQSw4Q0FBOEMsaUJBQWlCLFFBQVEsY0FBYztBQUNyRjtBQUNBO0FBQ0EsZ0NBQWdDLFlBQVksZUFBZSxpQkFBaUIsUUFBUSxjQUFjO0FBQ2xHO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3BHQTtBQUFBO0FBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImNvZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9jb2RlLnRzXCIpO1xuIiwiaW1wb3J0IHsgS0VZUyB9IGZyb20gJy4vc2hhcmVkJztcbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB2aXNpYmxlOiBmYWxzZSwgaGVpZ2h0OiAyNjUgfSk7XG5jb25zdCBkZWxpbWl0ZXIgPSAnLCAnO1xuZmlnbWEuY2xpZW50U3RvcmFnZS5nZXRBc3luYyhLRVlTLlBST1BFUlRZX05BTUUpLnRoZW4oKHZhbCkgPT4ge1xuICAgIGlmICh2YWwpXG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgcGFyYW06IEtFWVMuUFJPUEVSVFlfTkFNRSwgdmFsIH0pO1xufSk7XG5maWdtYS5jbGllbnRTdG9yYWdlLmdldEFzeW5jKEtFWVMuRlJPTV9WQVJJQU5UKS50aGVuKCh2YWwpID0+IHtcbiAgICBpZiAodmFsICE9PSB1bmRlZmluZWQpXG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgcGFyYW06IEtFWVMuRlJPTV9WQVJJQU5ULCB2YWwgfSk7XG59KTtcbmZpZ21hLmNsaWVudFN0b3JhZ2UuZ2V0QXN5bmMoS0VZUy5UT19WQVJJQU5UKS50aGVuKCh2YWwpID0+IHtcbiAgICBpZiAodmFsKVxuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHBhcmFtOiBLRVlTLlRPX1ZBUklBTlQsIHZhbCB9KTtcbn0pO1xuZmlnbWEuY2xpZW50U3RvcmFnZS5nZXRBc3luYyhLRVlTLkRFRVBfU1dJVENIKS50aGVuKCh2YWwpID0+IHtcbiAgICBpZiAodmFsKVxuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHBhcmFtOiBLRVlTLkRFRVBfU1dJVENILCB2YWwgfSk7XG59KTtcbmxldCBzd2l0Y2hDb3VudCA9IDA7XG4vLyBzaG93IHRoZSBVSSB3aGVuIHdlIGZpbmlzaCBpbml0aWFsaXppbmcgY2xpZW50U3RvcmFnZVxuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgZmlnbWEudWkuc2hvdygpO1xufSwgMjUwKTtcbmZ1bmN0aW9uIHRyYXZlcnNlKG5vZGUsIHByb3BlcnR5TmFtZSwgZnJvbVZhcmlhbnQsIHRvVmFyaWFudCwgZGVlcFN3aXRjaCkge1xuICAgIC8vIGZpbmQgYW4gaW5zdGFuY2VcbiAgICAvLyB0aGUgaW5zdGFuY2UgbmVlZCB0byBjb21lIGZyb20gc29tZSBraW5kIG9mIGNvbXBvbmVudCBzZXQgKGkuZS4sIGhhcyBhIHBhcmVudClcbiAgICBsZXQgcGFyZW50U3dhcHBlZCA9IGZhbHNlO1xuICAgIGlmIChub2RlICYmIG5vZGUudHlwZSA9PSAnSU5TVEFOQ0UnICYmIG5vZGUubWFpbkNvbXBvbmVudC5wYXJlbnQpIHtcbiAgICAgICAgbGV0IG5vZGVQcm9wZXJ0aWVzID0gbm9kZS5tYWluQ29tcG9uZW50Lm5hbWUuc3BsaXQoZGVsaW1pdGVyKTtcbiAgICAgICAgLy8gdGhlIGluc3RhbmNlIGNvbWVzIGZyb20gYSBjb21wb25lbnQgd2l0aCB2YXJpYW5jZXMgc2V0IGluIHRoZW1cbiAgICAgICAgLy8gYW5kIHRoZXJlIGlzIHRoZSB2YXJpYW50IHdlIGFyZSBsb29raW5nIGZvclxuICAgICAgICBsZXQgcHJvcGVydHlJbmRleCA9IC0xO1xuICAgICAgICBpZiAoZnJvbVZhcmlhbnQgIT09ICcnKSB7XG4gICAgICAgICAgICBwcm9wZXJ0eUluZGV4ID0gbm9kZVByb3BlcnRpZXMuaW5kZXhPZihgJHtwcm9wZXJ0eU5hbWV9PSR7ZnJvbVZhcmlhbnR9YCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyB0aGUgdXNlciBkaWRuJ3QgcHJvdmlkZSBhbnkgZnJvbVZhcmlhbnRcbiAgICAgICAgICAgIC8vIGNoYW5naW5nIGFsbCBpbnN0YW5jZXMgd2l0aCB0aGUgXCJwcm9wZXJ0eU5hbWVcIiBwcm9wZXJ0eSB0byBcInRvVmFyaWFudFwiXG4gICAgICAgICAgICBwcm9wZXJ0eUluZGV4ID0gbm9kZVByb3BlcnRpZXMuZmluZEluZGV4KChwcm9wZXJ0eSkgPT4gcHJvcGVydHkuc3RhcnRzV2l0aChgJHtwcm9wZXJ0eU5hbWV9PWApKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBkbyBub3Qgc3dhcCBpZiBzb21laG93IHRoZSBpbnN0YW5jZSBpcyBhbHJlYWR5IG9uIHRoZSBcInRvVmFyaWFudFwiXG4gICAgICAgIGNvbnN0IGlzT25Ub1ZhcmlhbnQgPSBub2RlUHJvcGVydGllcy5pbmRleE9mKGAke3Byb3BlcnR5TmFtZX09JHt0b1ZhcmlhbnR9YCkgIT09IC0xO1xuICAgICAgICAvLyBkbyB0aGUgc3dhcHBpbmdcbiAgICAgICAgaWYgKG5vZGUubWFpbkNvbXBvbmVudC5wYXJlbnQudHlwZSA9PT0gJ0NPTVBPTkVOVF9TRVQnICYmIHByb3BlcnR5SW5kZXggIT09IC0xICYmICFpc09uVG9WYXJpYW50KSB7XG4gICAgICAgICAgICBub2RlUHJvcGVydGllc1twcm9wZXJ0eUluZGV4XSA9IGAke3Byb3BlcnR5TmFtZX09JHt0b1ZhcmlhbnR9YDtcbiAgICAgICAgICAgIGxldCBjaGFuZ2VUb1NpYmxpbmcgPSBub2RlLm1haW5Db21wb25lbnQucGFyZW50LmZpbmRDaGlsZCgoc2libGluZykgPT4gc2libGluZy5uYW1lID09PSBub2RlUHJvcGVydGllcy5qb2luKGRlbGltaXRlcikpO1xuICAgICAgICAgICAgLy8gd2UgZm91bmQgYSBzaWJsaW5nIHdpdGggdGhlIHByb3BlcnR5IHN3YXBwZWQgb3V0XG4gICAgICAgICAgICBpZiAoY2hhbmdlVG9TaWJsaW5nKSB7XG4gICAgICAgICAgICAgICAgbm9kZS5zd2FwQ29tcG9uZW50KGNoYW5nZVRvU2libGluZyk7XG4gICAgICAgICAgICAgICAgcGFyZW50U3dhcHBlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgc3dpdGNoQ291bnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHdlIGNvdWxkbid0IGZpbmQgYSBnb29kIHNpYmxpbmcgd2l0aCB0aGUgZXhhY3QgcHJvcGVydHksXG4gICAgICAgICAgICAvLyBidXQgdHJ5IGFnYWluIHRvIGZpbmQgYXQgbGVhc3Qgb25lIHdpdGggdGhlIHByb3BlcnR5IHdlIGNhcmUgYWJvdXRcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNoYW5nZVRvU2libGluZyA9IG5vZGUubWFpbkNvbXBvbmVudC5wYXJlbnQuZmluZENoaWxkKChzaWJsaW5nKSA9PiBzaWJsaW5nLm5hbWUuc3BsaXQoZGVsaW1pdGVyKS5pbmNsdWRlcyhgJHtwcm9wZXJ0eU5hbWV9PSR7dG9WYXJpYW50fWApKTtcbiAgICAgICAgICAgICAgICBpZiAoY2hhbmdlVG9TaWJsaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUuc3dhcENvbXBvbmVudChjaGFuZ2VUb1NpYmxpbmcpO1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnRTd2FwcGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoQ291bnQrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gbm93IHRoYXQgd2UgYXJlIGRvbmUgc3dhcHBpbmcsIGxvb2sgdG8gc2VlIGlmIGFueSBjaGlsZCBjb21wb25lbnQgaXMgc3dhcHBhYmxlXG4gICAgLy8gaWYgZGVlcFN3aXRjaCBpcyBjaGVja2VkIGFuZCBwYXJlbnQgaXMgc3dhcHBlZCwgd2UgZG9uJ3Qgd2FudCB0byBsb29rIGZ1cnRoZXIgaW4gdGhpcyBsYXllciB0cmVlXG4gICAgaWYgKCdjaGlsZHJlbicgaW4gbm9kZSAmJiAoZGVlcFN3aXRjaCB8fCAhcGFyZW50U3dhcHBlZCkpIHtcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICB0cmF2ZXJzZShjaGlsZCwgcHJvcGVydHlOYW1lLCBmcm9tVmFyaWFudCwgdG9WYXJpYW50LCBkZWVwU3dpdGNoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZpZ21hLnVpLm9ubWVzc2FnZSA9IChtc2cpID0+IHtcbiAgICAvLyByZW1lbWJlciB0aGVzZSBwYXJhbXMgYW5kIHNhdmUgdG8gY2xpZW50IHN0b3JhZ2VcbiAgICBmaWdtYS5jbGllbnRTdG9yYWdlLnNldEFzeW5jKEtFWVMuUFJPUEVSVFlfTkFNRSwgbXNnLnByb3BlcnR5TmFtZSk7XG4gICAgZmlnbWEuY2xpZW50U3RvcmFnZS5zZXRBc3luYyhLRVlTLkZST01fVkFSSUFOVCwgbXNnLmZyb21WYXJpYW50KTtcbiAgICBmaWdtYS5jbGllbnRTdG9yYWdlLnNldEFzeW5jKEtFWVMuVE9fVkFSSUFOVCwgbXNnLnRvVmFyaWFudCk7XG4gICAgZmlnbWEuY2xpZW50U3RvcmFnZS5zZXRBc3luYyhLRVlTLkRFRVBfU1dJVENILCBtc2cuZGVlcFN3aXRjaCk7XG4gICAgLy8gaWYgdXNlciBzZWxlY3RlZCBzb21ldGhpbmcsIHRoZW4gd2UgbG9vayBhdCB0aGUgc2VsZWN0aW9uXG4gICAgaWYgKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbi5sZW5ndGgpIHtcbiAgICAgICAgZm9yIChjb25zdCBub2RlIG9mIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbikge1xuICAgICAgICAgICAgdHJhdmVyc2Uobm9kZSwgbXNnLnByb3BlcnR5TmFtZSwgbXNnLmZyb21WYXJpYW50LCBtc2cudG9WYXJpYW50LCBtc2cuZGVlcFN3aXRjaCA9PT0gJ3RydWUnKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyB0aGUgdXNlciBkaWRuJ3Qgc2VsZWN0IGFueXRoaW5nLCB0aGVuIGxldCdzIGNoYW5nZSB0aGUgZW50aXJlIHBhZ2VcbiAgICBlbHNlIHtcbiAgICAgICAgdHJhdmVyc2UoZmlnbWEuY3VycmVudFBhZ2UsIG1zZy5wcm9wZXJ0eU5hbWUsIG1zZy5mcm9tVmFyaWFudCwgbXNnLnRvVmFyaWFudCwgbXNnLmRlZXBTd2l0Y2ggPT09ICd0cnVlJyk7XG4gICAgfVxuICAgIC8vIHNuYWNrYmFyIGZlZWRiYWNrXG4gICAgaWYgKHN3aXRjaENvdW50ID09PSAwKSB7XG4gICAgICAgIGZpZ21hLm5vdGlmeShg8J+YlSBWYXJpYW50IFN3aXRjaGVyIGNvdWxkbid0IGZpbmQgYW55dGhpbmcgdG8gc3dpdGNoIHRvIFwiJHttc2cucHJvcGVydHlOYW1lfT0ke21zZy50b1ZhcmlhbnR9XCIuYCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHN3aXRjaENvdW50ID09PSAxKSB7XG4gICAgICAgIGZpZ21hLm5vdGlmeShgQ2hhbmdlZCAxIGluc3RhbmNlJ3MgXCIke21zZy5wcm9wZXJ0eU5hbWV9XCIgdG8gXCIke21zZy50b1ZhcmlhbnR9XCIuYCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmaWdtYS5ub3RpZnkoYENoYW5nZWQgJHtzd2l0Y2hDb3VudH0gaW5zdGFuY2VzJyBcIiR7bXNnLnByb3BlcnR5TmFtZX1cIiB0byBcIiR7bXNnLnRvVmFyaWFudH1cIi5gKTtcbiAgICB9XG4gICAgZmlnbWEuY2xvc2VQbHVnaW4oKTtcbn07XG4iLCJleHBvcnQgY29uc3QgS0VZUyA9IHtcbiAgICBQUk9QRVJUWV9OQU1FOiAncHJvcGVydHktbmFtZScsXG4gICAgRlJPTV9WQVJJQU5UOiAnZnJvbS12YXJpYW50JyxcbiAgICBUT19WQVJJQU5UOiAndG8tdmFyaWFudCcsXG4gICAgREVFUF9TV0lUQ0g6ICdkZWVwLXN3aXRjaCcsXG59O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==