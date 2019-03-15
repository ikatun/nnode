"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeForAnnotation = typeForAnnotation;
exports.typeForTSType = typeForTSType;

var t = _interopRequireWildcard(require("@babel/types"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function typeForAnnotation(annotation) {
  if (!annotation || annotation.type !== 'TSTypeAnnotation') {
    return t.tsUndefinedKeyword();
  }

  return typeForTSType(annotation.typeAnnotation);
}

function typeForTSType(annotation) {
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

    case 'TSVoidKeyword':
      return t.unaryExpression('void', t.numericLiteral(0));

    case 'TSExpressionWithTypeArguments':
      if (annotation.typeParameters) {
        console.warn('Generic type is not supported');
      }

      return t.identifier('Object');

    case 'TSTypeReference':
      const typeName = annotation.typeName;
      const typeNameCopy = JSON.parse(JSON.stringify(typeName));

      if (annotation.typeName.name.includes('EntityID')) {
        return t.identifier('Number');
      }

      const undefinedComparison = t.binaryExpression('===', t.unaryExpression('typeof', typeName), t.identifier('"undefined"'));
      return t.conditionalExpression(undefinedComparison, t.identifier('Object'), typeNameCopy);

    case 'TSFunctionType':
      return t.identifier('Function');

    case 'TSUnionType':
      return typeForTSType(annotation.types[0]);

    case 'TSLiteralType':
      return annotation.literal;

    case 'TSArrayType':
      return t.identifier('Array');

    case 'TSTypeLiteral':
      return t.identifier('Object');

    default:
      return t.identifier('undefined');
  }
}
