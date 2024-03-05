import {
  Meta as StoryMeta,
  StoryObj,
  Parameters as Params,
  HtmlRenderer,
  Args,
} from '@storybook/html';
import { DecoratorFunction } from '@storybook/types';

/**
 * Makes optional property `K` of object-type `T` required.
 * Supports multiple properties (`K` can be a union of string-literals).
 */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/**
 * Makes optional property `K` of object-type `T` forbidden.
 * Supports multiple properties (`K` can be a union of string-literals).
 */
type WithForbidden<T, K extends keyof T> = T & { [P in K]?: never };

/**
 * Storybook's `Meta` type but with `title` required, `component` and `render` forbidden,
 * and `decorators` set so that the `storyResult` is ALWAYS a string.
 */
export type Meta = Omit<
  WithForbidden<WithRequired<StoryMeta, 'title'>, 'component' | 'render'>,
  'decorators'
> & {
  decorators?: DecoratorFunction<
    Omit<HtmlRenderer, 'storyResult'> & { storyResult: string },
    Args
  >[];
};

/**
 * Like Storybook's `StoryObj` type, but read-only, with `render` forbidden,
 * and with a required `parameters.render()` method.
 * Also, it's a generic that accepts a story's args-type and creates new types
 * from it for `args`, `parameters`, and `decorators`. The `decorators`
 * is set so that `storyResult` is ALWAYS a string.
 */
export type Story<T> = Readonly<
  Omit<
    WithForbidden<StoryObj, 'render'>,
    'args' | 'parameters' | 'decorators'
  > & {
    args: Readonly<T>;
    parameters: Params & {
      readonly render: (this: void, args: Readonly<T>) => Promise<string>;
    };
    decorators?: DecoratorFunction<
      Omit<HtmlRenderer, 'storyResult'> & { storyResult: string },
      Readonly<T>
    >[];
  }
>;
