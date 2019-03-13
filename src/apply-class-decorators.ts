import * as t from "@babel/types";

import { IClassDecorator } from './typescript-babel-decorators';

export function applyClassDecorators(decorators: IClassDecorator[]) {
  const args = t.arrayExpression(
    decorators.map(decorator => decorator.decorator.expression)
  );
  const className = decorators[0].classDeclaration.id!;
  const decorateExpression = t.callExpression(t.identifier('akessrfljlrgqgd_decorate'), [args, className]);

  return t.assignmentExpression('=', className, decorateExpression);
}
