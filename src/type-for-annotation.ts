import * as t from '@babel/types';
import { TypeAnnotation } from '@babel/types';
import { TSTypeAnnotation } from '@babel/types';
import { Noop } from '@babel/types';

export function typeForAnnotation(annotation: TypeAnnotation | TSTypeAnnotation | Noop | null) {
  if (!annotation || annotation.type !== 'TSTypeAnnotation') {
    return t.identifier('"undefined"');
  }

  return typeForTSType(annotation.typeAnnotation);
}

export function typeForTSType(annotation: t.TSType) {
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
      const undefinedComparison = t.binaryExpression(
        '===',
        t.unaryExpression('typeof', typeName),
        t.identifier('"undefined"')
      );
      const args = [t.conditionalExpression(undefinedComparison, t.identifier('undefined'), typeNameCopy)];
      return t.callExpression(t.identifier('akessrfljlrgqgd_determineType'), args);
    case 'TSFunctionType':
      return t.identifier('Function');
    case 'TSUnionType':
      return typeForTSType(annotation.types[0]);
    case 'TSLiteralType':
      switch(annotation.literal.type) {
        case 'BooleanLiteral':
          return t.identifier('Boolean');
        case 'NumericLiteral':
          return t.identifier('Number');
        case 'StringLiteral':
          return t.identifier('String');
        default:
          return t.identifier('Object');
      }
    case 'TSArrayType':
      return t.identifier('Array');
    case 'TSTypeLiteral':
      return t.identifier('Object');
    default:
      return t.identifier('undefined');
  }
}
