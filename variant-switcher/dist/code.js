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

figma.showUI(__html__, { visible: false });
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
// show the UI when we finish initializing clientStorage
setTimeout(() => {
    figma.ui.show();
}, 150);
function traverse(node, propertyName, fromVariant, toVariant) {
    // find an instance
    // the instance need to come from some kind of component set (i.e., has a parent)
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
        if (node.mainComponent.parent.type === 'COMPONENT_SET' && propertyIndex !== -1) {
            nodeProperties[propertyIndex] = `${propertyName}=${toVariant}`;
            let changeToSibling = node.mainComponent.parent.findChild((sibling) => sibling.name === nodeProperties.join(delimiter));
            // we found a sibling with the property swapped out
            if (changeToSibling) {
                node.swapComponent(changeToSibling);
            }
            // we couldn't find a good sibling with the exact property,
            // but try again to find at least one with the property we care about
            else {
                changeToSibling = node.mainComponent.parent.findChild((sibling) => sibling.name.split(delimiter).includes(`${propertyName}=${toVariant}`));
                if (changeToSibling) {
                    node.swapComponent(changeToSibling);
                }
            }
        }
    }
    // now that we are done swapping, look to see if any child component is swappable
    if ('children' in node) {
        for (const child of node.children) {
            traverse(child, propertyName, fromVariant, toVariant);
        }
    }
}
figma.ui.onmessage = (msg) => {
    // remember these params and save to client storage
    figma.clientStorage.setAsync(_shared__WEBPACK_IMPORTED_MODULE_0__["KEYS"].PROPERTY_NAME, msg.propertyName);
    figma.clientStorage.setAsync(_shared__WEBPACK_IMPORTED_MODULE_0__["KEYS"].FROM_VARIANT, msg.fromVariant);
    figma.clientStorage.setAsync(_shared__WEBPACK_IMPORTED_MODULE_0__["KEYS"].TO_VARIANT, msg.toVariant);
    // if user selected something, then we look at the selection
    if (figma.currentPage.selection.length) {
        for (const node of figma.currentPage.selection) {
            traverse(node, msg.propertyName, msg.fromVariant, msg.toVariant);
        }
    }
    // the user didn't select anything, then let's change the entire page
    else {
        traverse(figma.currentPage, msg.propertyName, msg.fromVariant, msg.toVariant);
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
};


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvZGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NoYXJlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBZ0M7QUFDaEMsd0JBQXdCLGlCQUFpQjtBQUN6QztBQUNBLDZCQUE2Qiw0Q0FBSTtBQUNqQztBQUNBLDhCQUE4QixRQUFRLDRDQUFJLHFCQUFxQjtBQUMvRCxDQUFDO0FBQ0QsNkJBQTZCLDRDQUFJO0FBQ2pDO0FBQ0EsOEJBQThCLFFBQVEsNENBQUksb0JBQW9CO0FBQzlELENBQUM7QUFDRCw2QkFBNkIsNENBQUk7QUFDakM7QUFDQSw4QkFBOEIsUUFBUSw0Q0FBSSxrQkFBa0I7QUFDNUQsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0QsYUFBYSxHQUFHLFlBQVk7QUFDbEY7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwRkFBMEYsYUFBYTtBQUN2RztBQUNBO0FBQ0EsK0NBQStDLGFBQWEsR0FBRyxVQUFVO0FBQ3pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2SEFBNkgsYUFBYSxHQUFHLFVBQVU7QUFDdko7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLDRDQUFJO0FBQ3JDLGlDQUFpQyw0Q0FBSTtBQUNyQyxpQ0FBaUMsNENBQUk7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDM0VBO0FBQUE7QUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImNvZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9jb2RlLnRzXCIpO1xuIiwiaW1wb3J0IHsgS0VZUyB9IGZyb20gJy4vc2hhcmVkJztcbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB2aXNpYmxlOiBmYWxzZSB9KTtcbmNvbnN0IGRlbGltaXRlciA9ICcsICc7XG5maWdtYS5jbGllbnRTdG9yYWdlLmdldEFzeW5jKEtFWVMuUFJPUEVSVFlfTkFNRSkudGhlbigodmFsKSA9PiB7XG4gICAgaWYgKHZhbClcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyBwYXJhbTogS0VZUy5QUk9QRVJUWV9OQU1FLCB2YWwgfSk7XG59KTtcbmZpZ21hLmNsaWVudFN0b3JhZ2UuZ2V0QXN5bmMoS0VZUy5GUk9NX1ZBUklBTlQpLnRoZW4oKHZhbCkgPT4ge1xuICAgIGlmICh2YWwgIT09IHVuZGVmaW5lZClcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyBwYXJhbTogS0VZUy5GUk9NX1ZBUklBTlQsIHZhbCB9KTtcbn0pO1xuZmlnbWEuY2xpZW50U3RvcmFnZS5nZXRBc3luYyhLRVlTLlRPX1ZBUklBTlQpLnRoZW4oKHZhbCkgPT4ge1xuICAgIGlmICh2YWwpXG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgcGFyYW06IEtFWVMuVE9fVkFSSUFOVCwgdmFsIH0pO1xufSk7XG4vLyBzaG93IHRoZSBVSSB3aGVuIHdlIGZpbmlzaCBpbml0aWFsaXppbmcgY2xpZW50U3RvcmFnZVxuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgZmlnbWEudWkuc2hvdygpO1xufSwgMTUwKTtcbmZ1bmN0aW9uIHRyYXZlcnNlKG5vZGUsIHByb3BlcnR5TmFtZSwgZnJvbVZhcmlhbnQsIHRvVmFyaWFudCkge1xuICAgIC8vIGZpbmQgYW4gaW5zdGFuY2VcbiAgICAvLyB0aGUgaW5zdGFuY2UgbmVlZCB0byBjb21lIGZyb20gc29tZSBraW5kIG9mIGNvbXBvbmVudCBzZXQgKGkuZS4sIGhhcyBhIHBhcmVudClcbiAgICBpZiAobm9kZSAmJiBub2RlLnR5cGUgPT0gJ0lOU1RBTkNFJyAmJiBub2RlLm1haW5Db21wb25lbnQucGFyZW50KSB7XG4gICAgICAgIGxldCBub2RlUHJvcGVydGllcyA9IG5vZGUubWFpbkNvbXBvbmVudC5uYW1lLnNwbGl0KGRlbGltaXRlcik7XG4gICAgICAgIC8vIHRoZSBpbnN0YW5jZSBjb21lcyBmcm9tIGEgY29tcG9uZW50IHdpdGggdmFyaWFuY2VzIHNldCBpbiB0aGVtXG4gICAgICAgIC8vIGFuZCB0aGVyZSBpcyB0aGUgdmFyaWFudCB3ZSBhcmUgbG9va2luZyBmb3JcbiAgICAgICAgbGV0IHByb3BlcnR5SW5kZXggPSAtMTtcbiAgICAgICAgaWYgKGZyb21WYXJpYW50ICE9PSAnJykge1xuICAgICAgICAgICAgcHJvcGVydHlJbmRleCA9IG5vZGVQcm9wZXJ0aWVzLmluZGV4T2YoYCR7cHJvcGVydHlOYW1lfT0ke2Zyb21WYXJpYW50fWApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gdGhlIHVzZXIgZGlkbid0IHByb3ZpZGUgYW55IGZyb21WYXJpYW50XG4gICAgICAgICAgICAvLyBjaGFuZ2luZyBhbGwgaW5zdGFuY2VzIHdpdGggdGhlIFwicHJvcGVydHlOYW1lXCIgcHJvcGVydHkgdG8gXCJ0b1ZhcmlhbnRcIlxuICAgICAgICAgICAgcHJvcGVydHlJbmRleCA9IG5vZGVQcm9wZXJ0aWVzLmZpbmRJbmRleCgocHJvcGVydHkpID0+IHByb3BlcnR5LnN0YXJ0c1dpdGgoYCR7cHJvcGVydHlOYW1lfT1gKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUubWFpbkNvbXBvbmVudC5wYXJlbnQudHlwZSA9PT0gJ0NPTVBPTkVOVF9TRVQnICYmIHByb3BlcnR5SW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICBub2RlUHJvcGVydGllc1twcm9wZXJ0eUluZGV4XSA9IGAke3Byb3BlcnR5TmFtZX09JHt0b1ZhcmlhbnR9YDtcbiAgICAgICAgICAgIGxldCBjaGFuZ2VUb1NpYmxpbmcgPSBub2RlLm1haW5Db21wb25lbnQucGFyZW50LmZpbmRDaGlsZCgoc2libGluZykgPT4gc2libGluZy5uYW1lID09PSBub2RlUHJvcGVydGllcy5qb2luKGRlbGltaXRlcikpO1xuICAgICAgICAgICAgLy8gd2UgZm91bmQgYSBzaWJsaW5nIHdpdGggdGhlIHByb3BlcnR5IHN3YXBwZWQgb3V0XG4gICAgICAgICAgICBpZiAoY2hhbmdlVG9TaWJsaW5nKSB7XG4gICAgICAgICAgICAgICAgbm9kZS5zd2FwQ29tcG9uZW50KGNoYW5nZVRvU2libGluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB3ZSBjb3VsZG4ndCBmaW5kIGEgZ29vZCBzaWJsaW5nIHdpdGggdGhlIGV4YWN0IHByb3BlcnR5LFxuICAgICAgICAgICAgLy8gYnV0IHRyeSBhZ2FpbiB0byBmaW5kIGF0IGxlYXN0IG9uZSB3aXRoIHRoZSBwcm9wZXJ0eSB3ZSBjYXJlIGFib3V0XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjaGFuZ2VUb1NpYmxpbmcgPSBub2RlLm1haW5Db21wb25lbnQucGFyZW50LmZpbmRDaGlsZCgoc2libGluZykgPT4gc2libGluZy5uYW1lLnNwbGl0KGRlbGltaXRlcikuaW5jbHVkZXMoYCR7cHJvcGVydHlOYW1lfT0ke3RvVmFyaWFudH1gKSk7XG4gICAgICAgICAgICAgICAgaWYgKGNoYW5nZVRvU2libGluZykge1xuICAgICAgICAgICAgICAgICAgICBub2RlLnN3YXBDb21wb25lbnQoY2hhbmdlVG9TaWJsaW5nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gbm93IHRoYXQgd2UgYXJlIGRvbmUgc3dhcHBpbmcsIGxvb2sgdG8gc2VlIGlmIGFueSBjaGlsZCBjb21wb25lbnQgaXMgc3dhcHBhYmxlXG4gICAgaWYgKCdjaGlsZHJlbicgaW4gbm9kZSkge1xuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIHRyYXZlcnNlKGNoaWxkLCBwcm9wZXJ0eU5hbWUsIGZyb21WYXJpYW50LCB0b1ZhcmlhbnQpO1xuICAgICAgICB9XG4gICAgfVxufVxuZmlnbWEudWkub25tZXNzYWdlID0gKG1zZykgPT4ge1xuICAgIC8vIHJlbWVtYmVyIHRoZXNlIHBhcmFtcyBhbmQgc2F2ZSB0byBjbGllbnQgc3RvcmFnZVxuICAgIGZpZ21hLmNsaWVudFN0b3JhZ2Uuc2V0QXN5bmMoS0VZUy5QUk9QRVJUWV9OQU1FLCBtc2cucHJvcGVydHlOYW1lKTtcbiAgICBmaWdtYS5jbGllbnRTdG9yYWdlLnNldEFzeW5jKEtFWVMuRlJPTV9WQVJJQU5ULCBtc2cuZnJvbVZhcmlhbnQpO1xuICAgIGZpZ21hLmNsaWVudFN0b3JhZ2Uuc2V0QXN5bmMoS0VZUy5UT19WQVJJQU5ULCBtc2cudG9WYXJpYW50KTtcbiAgICAvLyBpZiB1c2VyIHNlbGVjdGVkIHNvbWV0aGluZywgdGhlbiB3ZSBsb29rIGF0IHRoZSBzZWxlY3Rpb25cbiAgICBpZiAoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLmxlbmd0aCkge1xuICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2YgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uKSB7XG4gICAgICAgICAgICB0cmF2ZXJzZShub2RlLCBtc2cucHJvcGVydHlOYW1lLCBtc2cuZnJvbVZhcmlhbnQsIG1zZy50b1ZhcmlhbnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIHRoZSB1c2VyIGRpZG4ndCBzZWxlY3QgYW55dGhpbmcsIHRoZW4gbGV0J3MgY2hhbmdlIHRoZSBlbnRpcmUgcGFnZVxuICAgIGVsc2Uge1xuICAgICAgICB0cmF2ZXJzZShmaWdtYS5jdXJyZW50UGFnZSwgbXNnLnByb3BlcnR5TmFtZSwgbXNnLmZyb21WYXJpYW50LCBtc2cudG9WYXJpYW50KTtcbiAgICB9XG4gICAgZmlnbWEuY2xvc2VQbHVnaW4oKTtcbn07XG4iLCJleHBvcnQgY29uc3QgS0VZUyA9IHtcbiAgICBQUk9QRVJUWV9OQU1FOiAncHJvcGVydHktbmFtZScsXG4gICAgRlJPTV9WQVJJQU5UOiAnZnJvbS12YXJpYW50JyxcbiAgICBUT19WQVJJQU5UOiAndG8tdmFyaWFudCcsXG59O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==