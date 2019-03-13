import { IFieldDecorator } from './typescript-babel-decorators';
import * as t from '@babel/types';
import { typeForAnnotation } from './type-for-annotation';

export function metadataCall(key: string, arg) {
  const metadataCallArgs = [
    t.stringLiteral(key),
    arg
  ];

  return t.callExpression(t.identifier('akessrfljlrgqgd_metadata'), metadataCallArgs);
}

export function applyFieldDecorators(decorators: IFieldDecorator[]) {
  const metadataCallArgs = [
    t.stringLiteral('design:type'),
    typeForAnnotation(decorators[0].field.typeAnnotation),
  ];
  const metadataCall = t.callExpression(t.identifier('akessrfljlrgqgd_metadata'), metadataCallArgs);

  const classPrototype = t.memberExpression(decorators[0].classDeclaration.id!, t.identifier('prototype'));

  const args = t.arrayExpression([
    ...decorators.map(decorator => decorator.decorator.expression),
    metadataCall,
  ]);

  const decorateExpression = t.callExpression(t.identifier('akessrfljlrgqgd_decorate'), [
    args,
    classPrototype,
    t.stringLiteral(decorators[0].field.key.name),
    t.identifier('void 0'),
  ]);

  return decorateExpression;
}
