"use strict";

module.exports = function (_ref) {
  var types = _ref.types;
  return {
    visitor: {
      Function: function Function(path) {
        var functionName = '';

        if (path.node.id) {
          functionName = path.node.id.name;
        }

        if (!functionName && path.node && path.node.key && path.node.key.name) {
          functionName = path.node.key.name;
        }

        (path.get('params') || []).slice().forEach(function (param) {
          var name = param.node.name;
          var resultantDecorator;
          (param.node.decorators || []).slice().forEach(function (decorator) {
            var classDeclaration = path.findParent(function (p) {
              return p.node.type === 'VariableDeclaration';
            });
            var classDeclarator = path.findParent(function (p) {
              return p.node.type === 'VariableDeclarator';
            });
            var className = classDeclarator.node.id.name;
            resultantDecorator = types.callExpression(decorator.expression, [types.Identifier("".concat(className, ".prototype")), types.StringLiteral(functionName), types.NumericLiteral(param.key)]);
            var expression = types.expressionStatement(resultantDecorator);
            classDeclaration.insertAfter(expression);
          });

          if (resultantDecorator) {
            if (name === undefined) {
              if (param.node.decorators) {
                var newNode = JSON.parse(JSON.stringify(param.node));
                delete newNode.decorators;
                param.replaceWith(newNode);
              }
            } else {
              param.replaceWith(types.Identifier(name));
            }
          }
        });
      }
    }
  };
};
