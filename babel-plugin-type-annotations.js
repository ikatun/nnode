'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var t = _ref.types;

  return {
    visitor: {
      ClassDeclaration: function ClassDeclaration(path) {
        var node = path.node;
        var classRef = node.id;
        var classBody = node.body.body;

        // Create additional statements for parameter decorators and type annotations.
        var decorators = [];
        var types = [];
        classBody.forEach(function (bodyNode) {
          if (bodyNode.type === 'ClassMethod') {
            var name = bodyNode.key.name;
            decorators = parameterDecorators(bodyNode.params, classRef, name);
            types = bodyNode.params.decorators ? parameterTypes(bodyNode.params, classRef, name) : [];
          } else if (bodyNode.type === 'ClassProperty' && bodyNode.value === null && !bodyNode.static) {
            // Handle class property without initializer.
            // https://github.com/jeffmo/es-class-fields-and-static-properties
            bodyNode.value = t.memberExpression(t.thisExpression(), bodyNode.key);
          }

          var additionalStatements = [].concat(_toConsumableArray(types), _toConsumableArray(decorators)).filter(Boolean);

          // If not found, do nothing.
          if (additionalStatements.length === 0) {
            return undefined;
          }

          // Append additional statements to program.
          var parent = path.parent;
          if (parent.type === 'ExportNamedDeclaration' || parent.type === 'ExportDefaultDeclaration') {
            // The class declaration is wrapped by an export declaration.
            path.parentPath.insertAfter(additionalStatements);
          } else {
            path.insertAfter(additionalStatements);
          }
        });
      }
    }
  };

  // Returns an array of parameter decorator call statements for a class.
  function parameterDecorators(params, classRef, name) {
    var decoratorLists = params.map(function (param, i) {
      var decorators = param.decorators;
      if (!decorators) {
        return [];
      }
      param.decorators = null;

      return decorators.map(function (decorator) {
        var className = classRef.name;
        var call = decorator.expression;
        var args = [t.identifier(className+'.prototype'), t.identifier("'"+name+"'"), t.identifier(i.toString())];
        return t.expressionStatement(t.callExpression(call, args));
      });
    });
    // Flatten.
    return Array.prototype.concat.apply([], decoratorLists);
  }

  // Returns an array of define 'parameters' metadata statements for a class.
  // The array may contain zero or one statements.
  function parameterTypes(params, classRef, name) {
    var types = params.map(function (param) {
      var annotation = param.typeAnnotation && param.typeAnnotation.typeAnnotation;
      return typeForAnnotation(annotation);
    });
    if (!types.some(Boolean)) {
      return [];
    }
    return [defineMetadata('design:paramtypes', t.arrayExpression(types), classRef, name)];
  }

  // Returns an AST for define metadata statement.
  function defineMetadata(key, value, target, name) {
    var targetName = target.name;
    return t.expressionStatement(t.callExpression(t.memberExpression(t.identifier('Reflect'), t.identifier('defineMetadata')), [t.stringLiteral(key), value, t.identifier(targetName+'.prototype'), t.stringLiteral(name)]));
  }

  function typeForAnnotation(annotation) {
    if (!annotation) {
      return null;
    }
    switch (annotation.type) {
      case 'TSStringKeyword':
        return t.identifier('String');
      case 'TSNumberKeyword':
        return t.identifier('Number');
      case 'TSBooleanKeyword':
        return t.identifier('Boolean');
      case 'VoidTypeAnnotation':
        return t.unaryExpression('void', t.numericLiteral(0));
      case 'GenericTypeAnnotation':
        if (annotation.typeParameters) {
          var genericCode = (0, _babelGenerator2.default)(annotation).code;
          var plainCode = (0, _babelGenerator2.default)(annotation.id).code;
          console.warn(TAG + ' Generic type is not supported: ' + genericCode + ' Just use: ' + plainCode);
        }
        return annotation.id;
      case 'TSTypeReference':
        try {
          var undefinedComparison = t.binaryExpression(
            '===',
            t.unaryExpression('typeof', annotation.typeName, true),
            t.identifier('"undefined"')
          );
          return t.conditionalExpression(undefinedComparison,
            t.identifier('undefined'),
            annotation.typeName
          );
        } catch (e) {
          console.log('e', annotation.typeName);
          throw e;
        }
      case 'TSFunctionKeyword':
        return t.identifier('Function');
      case 'TSUnionType':
        return typeForAnnotation(annotation.types[0]);
      case 'TSLiteralType':
        return typeForAnnotation(annotation.literal);
      case 'StringLiteral':
        return t.identifier('String');
      case 'TSArrayType':
        return t.identifier('undefined');
      default:
        return t.identifier('undefined');
    }
  }
};

var _babelGenerator = require('babel-generator');

var _babelGenerator2 = _interopRequireDefault(_babelGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var TAG = '[babel-plugin-angular2-annotations]';
