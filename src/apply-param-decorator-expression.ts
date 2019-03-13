import * as t from '@babel/types';


import { IMethodDecorator } from './typescript-babel-decorators';
import { metadataCall } from './apply-field-decorators';
import { ClassDeclaration, ClassMethod, ClassPrivateMethod } from '@babel/types';
import { typeForAnnotation } from './type-for-annotation';

export interface IParamDecorator {
  decorator: t.Decorator;
  index: number;
}

const paramCall = (paramDecorator: IParamDecorator) =>
  t.callExpression(
    t.identifier('akessrfljlrgqgd_param'),
    [t.numericLiteral(paramDecorator.index), paramDecorator.decorator.expression
    ]
  );


export function applyParamDecoratorExpression(methodDecorators: IMethodDecorator[], paramDecorators: IParamDecorator[], classDeclaration: ClassDeclaration, method: ClassMethod | ClassPrivateMethod) {
  const methodDecoratorsExpression = methodDecorators.map(methodDeco => methodDeco.decorator.expression);
  const paramsDecoratorsExpressions = paramDecorators.map(paramCall);

  const paramCalls = t.arrayExpression([
    ...methodDecoratorsExpression,
    ...paramsDecoratorsExpressions,
    metadataCall('design:type', t.identifier('Function')),
    metadataCall('design:paramtypes',
      t.arrayExpression(method.params.map(param => typeForAnnotation(param.typeAnnotation)))
    ),
    metadataCall('design:returntype', typeForAnnotation(method.returnType)),
  ]);

  return t.callExpression(t.identifier('akessrfljlrgqgd_decorate'), [
    paramCalls,
    t.memberExpression(classDeclaration.id!, t.identifier('prototype')),
    t.stringLiteral(method.key.name),
    t.identifier('null'),
  ]);
}
