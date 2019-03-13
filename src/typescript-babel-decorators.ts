import {
  ClassDeclaration,
  ClassMethod,
  ClassPrivateMethod,
  ClassProperty,
  Decorator, LVal,
  Node,
  TraversalAncestors
} from '@babel/types';
import * as t from '@babel/types';

import { NodePath } from '@babel/traverse';
import { applyClassDecorators } from './apply-class-decorators';
import { applyFieldDecorators } from './apply-field-decorators';
import { applyParamDecoratorExpression, IParamDecorator } from './apply-param-decorator-expression';
import { decoratingHelpersTemplate } from './decorating-helpers-template';

function mapMergeAndEmpty<K, V>(ys: V[], xs: K[] | null | undefined, f: (K) => V): V[] {
  if (xs === null || xs === undefined) {
    return [];
  }

  const returnValue = xs.map(f);
  xs.length = 0;

  ys.push(...returnValue);
  return returnValue
}

export interface IClassDecorator {
  classDeclaration: ClassDeclaration;
  decorator: Decorator;
}

const toClassDecorator = (classDeclaration: ClassDeclaration) => (decorator: Decorator): IClassDecorator => {
  return { classDeclaration, decorator };
}

export interface IMethodDecorator extends IClassDecorator {
  method: ClassMethod | ClassPrivateMethod;
}

const toMethodDecorator = (classDeclaration: ClassDeclaration, method: ClassMethod | ClassPrivateMethod) => (decorator: Decorator): IMethodDecorator => {
  return { classDeclaration, decorator, method };
}

export interface IFieldDecorator extends IClassDecorator {
  field: ClassProperty;
}

const toFieldDecorator = (classDeclaration: ClassDeclaration, field: ClassProperty) => (decorator: Decorator): IFieldDecorator => {
  return { classDeclaration, decorator, field };
}

export interface IArgDecorator extends IClassDecorator, IMethodDecorator {
  param: LVal;
}

const toArgsDecorator = (classDeclaration: ClassDeclaration, method: ClassMethod | ClassPrivateMethod, param: LVal) => (decorator: Decorator): IArgDecorator => {
  return { classDeclaration, decorator, method, param };
}

export default function() {
  return {
    visitor: {
      ClassDeclaration(path: NodePath<ClassDeclaration>) {
        const classDeclaration = path.node;

        const classDecorators = mapMergeAndEmpty([], path.node.decorators, toClassDecorator(classDeclaration));
        const argsDecorators: IArgDecorator[] = [];
        const fieldDecorators: IFieldDecorator[] = [];

        const fieldDecoratorExpressions: any[] = [];
        const paramDecoratorExpressions: any[] = [];

        path.node.body.body.map(bodyElement => {
          if ((bodyElement.type === 'ClassMethod' || bodyElement.type === 'ClassPrivateMethod')) {
            const methodDecorators = mapMergeAndEmpty([], bodyElement.decorators, toMethodDecorator(classDeclaration, bodyElement));

            const paramDecorators: Array<IParamDecorator> = [];
            bodyElement.params.map((param, index) => {
              if (param.type !== 'MemberExpression' && param.type !== 'TSParameterProperty') {
                paramDecorators.push(...mapMergeAndEmpty([], param.decorators, decorator => ({ decorator, index })));
              }
            });
            if (paramDecorators.length > 0) {
              paramDecoratorExpressions.push(applyParamDecoratorExpression(methodDecorators, paramDecorators, classDeclaration, bodyElement))
            }
          }
          if (bodyElement.type === 'ClassProperty' && bodyElement.decorators) {
            const fieldDecorators = mapMergeAndEmpty([], bodyElement.decorators, toFieldDecorator(classDeclaration, bodyElement));
            if (fieldDecorators.length > 0) {
              fieldDecoratorExpressions.push(applyFieldDecorators(fieldDecorators));
            }
          }
        });

        path.insertBefore(t.identifier(decoratingHelpersTemplate));

        const decoratorsExpressions = [
          ...fieldDecoratorExpressions,
          ...paramDecoratorExpressions,
          ...(classDecorators.length > 0 ? [applyClassDecorators(classDecorators)] : []),
        ];
        path.insertAfter(decoratorsExpressions);
      },
      ClassExpression(path, state) {
      },
      ObjectExpression(path, state) {
      },
      AssignmentExpression(path, state) {
      },
    },
  };
};
