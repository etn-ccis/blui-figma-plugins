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
/*! no static exports found */
/***/ (function(module, exports) {

figma.showUI(__html__);
const delimiter = ', ';
function traverse(node, propertyName, fromVariant, toVariant) {
    // find an instance instance
    if (node.type == 'INSTANCE') {
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


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNELGFBQWEsR0FBRyxZQUFZO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEZBQTBGLGFBQWE7QUFDdkc7QUFDQTtBQUNBLCtDQUErQyxhQUFhLEdBQUcsVUFBVTtBQUN6RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkhBQTZILGFBQWEsR0FBRyxVQUFVO0FBQ3ZKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiY29kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2NvZGUudHNcIik7XG4iLCJmaWdtYS5zaG93VUkoX19odG1sX18pO1xuY29uc3QgZGVsaW1pdGVyID0gJywgJztcbmZ1bmN0aW9uIHRyYXZlcnNlKG5vZGUsIHByb3BlcnR5TmFtZSwgZnJvbVZhcmlhbnQsIHRvVmFyaWFudCkge1xuICAgIC8vIGZpbmQgYW4gaW5zdGFuY2UgaW5zdGFuY2VcbiAgICBpZiAobm9kZS50eXBlID09ICdJTlNUQU5DRScpIHtcbiAgICAgICAgbGV0IG5vZGVQcm9wZXJ0aWVzID0gbm9kZS5tYWluQ29tcG9uZW50Lm5hbWUuc3BsaXQoZGVsaW1pdGVyKTtcbiAgICAgICAgLy8gdGhlIGluc3RhbmNlIGNvbWVzIGZyb20gYSBjb21wb25lbnQgd2l0aCB2YXJpYW5jZXMgc2V0IGluIHRoZW1cbiAgICAgICAgLy8gYW5kIHRoZXJlIGlzIHRoZSB2YXJpYW50IHdlIGFyZSBsb29raW5nIGZvclxuICAgICAgICBsZXQgcHJvcGVydHlJbmRleCA9IC0xO1xuICAgICAgICBpZiAoZnJvbVZhcmlhbnQgIT09ICcnKSB7XG4gICAgICAgICAgICBwcm9wZXJ0eUluZGV4ID0gbm9kZVByb3BlcnRpZXMuaW5kZXhPZihgJHtwcm9wZXJ0eU5hbWV9PSR7ZnJvbVZhcmlhbnR9YCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyB0aGUgdXNlciBkaWRuJ3QgcHJvdmlkZSBhbnkgZnJvbVZhcmlhbnRcbiAgICAgICAgICAgIC8vIGNoYW5naW5nIGFsbCBpbnN0YW5jZXMgd2l0aCB0aGUgXCJwcm9wZXJ0eU5hbWVcIiBwcm9wZXJ0eSB0byBcInRvVmFyaWFudFwiXG4gICAgICAgICAgICBwcm9wZXJ0eUluZGV4ID0gbm9kZVByb3BlcnRpZXMuZmluZEluZGV4KChwcm9wZXJ0eSkgPT4gcHJvcGVydHkuc3RhcnRzV2l0aChgJHtwcm9wZXJ0eU5hbWV9PWApKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS5tYWluQ29tcG9uZW50LnBhcmVudC50eXBlID09PSAnQ09NUE9ORU5UX1NFVCcgJiYgcHJvcGVydHlJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIG5vZGVQcm9wZXJ0aWVzW3Byb3BlcnR5SW5kZXhdID0gYCR7cHJvcGVydHlOYW1lfT0ke3RvVmFyaWFudH1gO1xuICAgICAgICAgICAgbGV0IGNoYW5nZVRvU2libGluZyA9IG5vZGUubWFpbkNvbXBvbmVudC5wYXJlbnQuZmluZENoaWxkKChzaWJsaW5nKSA9PiBzaWJsaW5nLm5hbWUgPT09IG5vZGVQcm9wZXJ0aWVzLmpvaW4oZGVsaW1pdGVyKSk7XG4gICAgICAgICAgICAvLyB3ZSBmb3VuZCBhIHNpYmxpbmcgd2l0aCB0aGUgcHJvcGVydHkgc3dhcHBlZCBvdXRcbiAgICAgICAgICAgIGlmIChjaGFuZ2VUb1NpYmxpbmcpIHtcbiAgICAgICAgICAgICAgICBub2RlLnN3YXBDb21wb25lbnQoY2hhbmdlVG9TaWJsaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHdlIGNvdWxkbid0IGZpbmQgYSBnb29kIHNpYmxpbmcgd2l0aCB0aGUgZXhhY3QgcHJvcGVydHksXG4gICAgICAgICAgICAvLyBidXQgdHJ5IGFnYWluIHRvIGZpbmQgYXQgbGVhc3Qgb25lIHdpdGggdGhlIHByb3BlcnR5IHdlIGNhcmUgYWJvdXRcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNoYW5nZVRvU2libGluZyA9IG5vZGUubWFpbkNvbXBvbmVudC5wYXJlbnQuZmluZENoaWxkKChzaWJsaW5nKSA9PiBzaWJsaW5nLm5hbWUuc3BsaXQoZGVsaW1pdGVyKS5pbmNsdWRlcyhgJHtwcm9wZXJ0eU5hbWV9PSR7dG9WYXJpYW50fWApKTtcbiAgICAgICAgICAgICAgICBpZiAoY2hhbmdlVG9TaWJsaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUuc3dhcENvbXBvbmVudChjaGFuZ2VUb1NpYmxpbmcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBub3cgdGhhdCB3ZSBhcmUgZG9uZSBzd2FwcGluZywgbG9vayB0byBzZWUgaWYgYW55IGNoaWxkIGNvbXBvbmVudCBpcyBzd2FwcGFibGVcbiAgICBpZiAoJ2NoaWxkcmVuJyBpbiBub2RlKSB7XG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICAgICAgdHJhdmVyc2UoY2hpbGQsIHByb3BlcnR5TmFtZSwgZnJvbVZhcmlhbnQsIHRvVmFyaWFudCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5maWdtYS51aS5vbm1lc3NhZ2UgPSAobXNnKSA9PiB7XG4gICAgLy8gaWYgdXNlciBzZWxlY3RlZCBzb21ldGhpbmcsIHRoZW4gd2UgbG9vayBhdCB0aGUgc2VsZWN0aW9uXG4gICAgaWYgKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbi5sZW5ndGgpIHtcbiAgICAgICAgZm9yIChjb25zdCBub2RlIG9mIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbikge1xuICAgICAgICAgICAgdHJhdmVyc2Uobm9kZSwgbXNnLnByb3BlcnR5TmFtZSwgbXNnLmZyb21WYXJpYW50LCBtc2cudG9WYXJpYW50KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyB0aGUgdXNlciBkaWRuJ3Qgc2VsZWN0IGFueXRoaW5nLCB0aGVuIGxldCdzIGNoYW5nZSB0aGUgZW50aXJlIHBhZ2VcbiAgICBlbHNlIHtcbiAgICAgICAgdHJhdmVyc2UoZmlnbWEuY3VycmVudFBhZ2UsIG1zZy5wcm9wZXJ0eU5hbWUsIG1zZy5mcm9tVmFyaWFudCwgbXNnLnRvVmFyaWFudCk7XG4gICAgfVxuICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==