"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helperPluginUtils = require("@babel/helper-plugin-utils");

var _pluginSyntaxTypescript = _interopRequireDefault(require("@babel/plugin-syntax-typescript"));

var _core = require("@babel/core");

var _enum = _interopRequireDefault(require("./enum"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isInType(path) {
  switch (path.parent.type) {
    case "TSTypeReference":
    case "TSQualifiedName":
    case "TSExpressionWithTypeArguments":
    case "TSTypeQuery":
      return true;

    default:
      return false;
  }
}

const PARSED_PARAMS = new WeakSet();

var _default = (0, _helperPluginUtils.declare)((api, {
  jsxPragma = "React"
}) => {
  api.assertVersion(7);
  const JSX_ANNOTATION_REGEX = /\*?\s*@jsx\s+([^\s]+)/;
  return {
    name: "transform-typescript",
    inherits: _pluginSyntaxTypescript.default,
    visitor: {
      //"Pattern" alias doesn't include Identifier or RestElement.
      Pattern: visitPattern,
      Identifier: visitPattern,
      RestElement: visitPattern,

      Program(path, state) {
        state.programPath = path;
        const file = state.file;

        if (file.ast.comments) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = file.ast.comments[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              const comment = _step.value;
              const jsxMatches = JSX_ANNOTATION_REGEX.exec(comment.value);

              if (jsxMatches) {
                jsxPragma = jsxMatches[1];
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        } // remove type imports


        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = path.get("body")[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            const stmt = _step2.value;

            if (_core.types.isImportDeclaration(stmt)) {
              // Note: this will allow both `import { } from "m"` and `import "m";`.
              // In TypeScript, the former would be elided.
              if (stmt.node.specifiers.length === 0) {
                continue;
              }

              let allElided = true;
              const importsToRemove = [];
              var _iteratorNormalCompletion3 = true;
              var _didIteratorError3 = false;
              var _iteratorError3 = undefined;

              try {
                for (var _iterator3 = stmt.node.specifiers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                  const specifier = _step3.value;
                  const binding = stmt.scope.getBinding(specifier.local.name); // The binding may not exist if the import node was explicitly
                  // injected by another plugin. Currently core does not do a good job
                  // of keeping scope bindings synchronized with the AST. For now we
                  // just bail if there is no binding, since chances are good that if
                  // the import statement was injected then it wasn't a typescript type
                  // import anyway.

                  if (binding && isImportTypeOnly(binding, state.programPath)) {
                    importsToRemove.push(binding.path);
                  } else {
                    allElided = false;
                  }
                }
              } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                    _iterator3.return();
                  }
                } finally {
                  if (_didIteratorError3) {
                    throw _iteratorError3;
                  }
                }
              }

              if (allElided) {
                stmt.remove();
              } else {
                for (var _i = 0; _i < importsToRemove.length; _i++) {
                  const importPath = importsToRemove[_i];
                  importPath.remove();
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      },

      TSDeclareFunction(path) {
        path.remove();
      },

      TSDeclareMethod(path) {
        path.remove();
      },

      VariableDeclaration(path) {
        if (path.node.declare) path.remove();
      },

      VariableDeclarator({
        node
      }) {
        if (node.definite) node.definite = null;
      },

      ClassMethod(path) {
        const node = path.node;
        if (node.accessibility) node.accessibility = null;
        if (node.abstract) node.abstract = null;
        if (node.optional) node.optional = null; // Rest handled by Function visitor
      },

      ClassProperty(path) {
        const node = path.node;
        if (node.accessibility) node.accessibility = null;
        if (node.abstract) node.abstract = null;
        if (node.readonly) node.readonly = null;
        if (node.optional) node.optional = null;
        if (node.definite) node.definite = null;
        if (node.typeAnnotation) node.typeAnnotation = null;
      },

      TSIndexSignature(path) {
        path.remove();
      },

      ClassDeclaration(path) {
        const node = path.node;

        if (node.declare) {
          path.remove();
          return;
        }
      },

      Class(path) {
        const node = path.node;
        if (node.typeParameters) node.typeParameters = null;
        if (node.superTypeParameters) node.superTypeParameters = null;
        if (node.implements) node.implements = null;
        if (node.abstract) node.abstract = null; // Similar to the logic in `transform-flow-strip-types`, we need to
        // handle `TSParameterProperty` and `ClassProperty` here because the
        // class transform would transform the class, causing more specific
        // visitors to not run.

        path.get("body.body").forEach(child => {
          const childNode = child.node;

          if (_core.types.isClassMethod(childNode, {
            kind: "constructor"
          })) {
            // Collects parameter properties so that we can add an assignment
            // for each of them in the constructor body
            //
            // We use a WeakSet to ensure an assignment for a parameter
            // property is only added once. This is necessary for cases like
            // using `transform-classes`, which causes this visitor to run
            // twice.
            const parameterProperties = [];
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (var _iterator4 = childNode.params[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                const param = _step4.value;

                if (param.type === "TSParameterProperty" && !PARSED_PARAMS.has(param.parameter)) {
                  PARSED_PARAMS.add(param.parameter);
                  parameterProperties.push(param.parameter);
                }
              }
            } catch (err) {
              _didIteratorError4 = true;
              _iteratorError4 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                  _iterator4.return();
                }
              } finally {
                if (_didIteratorError4) {
                  throw _iteratorError4;
                }
              }
            }

            if (parameterProperties.length) {
              const assigns = parameterProperties.map(p => {
                let name;

                if (_core.types.isIdentifier(p)) {
                  name = p.name;
                } else if (_core.types.isAssignmentPattern(p) && _core.types.isIdentifier(p.left)) {
                  name = p.left.name;
                } else {
                  throw path.buildCodeFrameError("Parameter properties can not be destructuring patterns.");
                }

                const assign = _core.types.assignmentExpression("=", _core.types.memberExpression(_core.types.thisExpression(), _core.types.identifier(name)), _core.types.identifier(name));

                return _core.types.expressionStatement(assign);
              });
              const statements = childNode.body.body;
              const first = statements[0];

              const startsWithSuperCall = first !== undefined && _core.types.isExpressionStatement(first) && _core.types.isCallExpression(first.expression) && _core.types.isSuper(first.expression.callee); // Make sure to put parameter properties *after* the `super`
              // call. TypeScript will enforce that a 'super()' call is the
              // first statement when there are parameter properties.


              childNode.body.body = startsWithSuperCall ? [first, ...assigns, ...statements.slice(1)] : [...assigns, ...statements];
            }
          } else if (child.isClassProperty()) {
            childNode.typeAnnotation = null;

            if (!childNode.value && !childNode.decorators) {
              child.remove();
            }
          }
        });
      },

      Function({
        node
      }) {
        if (node.typeParameters) node.typeParameters = null;
        if (node.returnType) node.returnType = null;
        const p0 = node.params[0];

        if (p0 && _core.types.isIdentifier(p0) && p0.name === "this") {
          node.params.shift();
        } // We replace `TSParameterProperty` here so that transforms that
        // rely on a `Function` visitor to deal with arguments, like
        // `transform-parameters`, work properly.


        node.params = node.params.map(p => {
          return p.type === "TSParameterProperty" ? p.parameter : p;
        });
      },

      TSModuleDeclaration(path) {
        if (!path.node.declare && path.node.id.type !== "StringLiteral") {
          throw path.buildCodeFrameError("Namespaces are not supported.");
        }

        path.remove();
      },

      TSInterfaceDeclaration(path) {
        path.remove();
      },

      TSTypeAliasDeclaration(path) {
        path.remove();
      },

      TSEnumDeclaration(path) {
        (0, _enum.default)(path, _core.types);
      },

      TSImportEqualsDeclaration(path) {
        throw path.buildCodeFrameError("`import =` is not supported by @babel/plugin-transform-typescript\n" + "Please consider using " + "`import <moduleName> from '<moduleName>';` alongside " + "Typescript's --allowSyntheticDefaultImports option.");
      },

      TSExportAssignment(path) {
        throw path.buildCodeFrameError("`export =` is not supported by @babel/plugin-transform-typescript\n" + "Please consider using `export <value>;`.");
      },

      TSTypeAssertion(path) {
        path.replaceWith(path.node.expression);
      },

      TSAsExpression(path) {
        let node = path.node;

        do {
          node = node.expression;
        } while (_core.types.isTSAsExpression(node));

        path.replaceWith(node);
      },

      TSNonNullExpression(path) {
        path.replaceWith(path.node.expression);
      },

      CallExpression(path) {
        path.node.typeParameters = null;
      },

      NewExpression(path) {
        path.node.typeParameters = null;
      },

      JSXOpeningElement(path) {
        path.node.typeParameters = null;
      },

      TaggedTemplateExpression(path) {
        path.node.typeParameters = null;
      }

    }
  };

  function visitPattern({
    node
  }) {
    if (node.typeAnnotation) node.typeAnnotation = null;
    if (_core.types.isIdentifier(node) && node.optional) node.optional = null; // 'access' and 'readonly' are only for parameter properties, so constructor visitor will handle them.
  }

  function isImportTypeOnly(binding, programPath) {
    return false; // for (const path of binding.referencePaths) {
    //   if (!isInType(path)) {
    //     return false;
    //   }
    // }
    //
    // if (binding.identifier.name !== jsxPragma) {
    //   return true;
    // }
    //
    // // "React" or the JSX pragma is referenced as a value if there are any JSX elements in the code.
    // let sourceFileHasJsx = false;
    // programPath.traverse({
    //   JSXElement() {
    //     sourceFileHasJsx = true;
    //   },
    //   JSXFragment() {
    //     sourceFileHasJsx = true;
    //   },
    // });
    // return !sourceFileHasJsx;
  }
});

exports.default = _default;