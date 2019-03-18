"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helperPluginUtils = require("@babel/helper-plugin-utils");

var _babelPluginTransformTypescript = _interopRequireDefault(require("./babel-plugin-transform-typescript/babel-plugin-transform-typescript"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _helperPluginUtils.declare)((api, {
  jsxPragma,
  allExtensions = false,
  isTSX = false
}) => {
  api.assertVersion(7);

  if (typeof allExtensions !== "boolean") {
    throw new Error(".allExtensions must be a boolean, or undefined");
  }

  if (typeof isTSX !== "boolean") {
    throw new Error(".isTSX must be a boolean, or undefined");
  }

  if (isTSX && !allExtensions) {
    throw new Error("isTSX:true requires allExtensions:true");
  }

  return {
    overrides: allExtensions ? [{
      plugins: [[_babelPluginTransformTypescript.default, {
        jsxPragma,
        isTSX
      }]]
    }] : [{
      // Only set 'test' if explicitly requested, since it requires that
      // Babel is being called`
      test: /\.ts$/,
      plugins: [[_babelPluginTransformTypescript.default, {
        jsxPragma
      }]]
    }, {
      // Only set 'test' if explicitly requested, since it requires that
      // Babel is being called`
      test: /\.tsx$/,
      plugins: [[_babelPluginTransformTypescript.default, {
        jsxPragma,
        isTSX: true
      }]]
    }]
  };
});

exports.default = _default;