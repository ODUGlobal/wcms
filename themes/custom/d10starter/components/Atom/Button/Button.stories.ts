import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import ButtonTemplate from './Button.twig';
import Theme from '@components/_ts-helpers/theme';

/*
  For demo-purposes, all theme-options should be available.
  At the moment, there are no color "options" -- it's just based on the theme.
*/
export const themeOptions = [null, ...Object.values(Theme)] as const;

const ButtonPureComponent = (twigContext: ButtonTwigContext) =>
  ButtonTemplate(twigContext);

export type ButtonTwigContext = {
  title: string;
  /** Optional `type` attribute for `<button>` */
  type?: string;
  /** If `true`, will use `display: block` instead of `display: inline-block`. */
  block?: boolean;
  ghost?: boolean;
};

const meta: Meta = {
  title: 'Atom/Button',
  excludeStories: ['Button', 'themeOptions'],
};

export default meta;

const defaultTitle =
  'This is a long button title so that we can easily see wrapping behavior.';

export const ButtonStory: Story<ButtonArgs> = {
  name: 'Button',

  parameters: {
    render: ({ title, type, block, ghost }) => {
      title = title || defaultTitle;

      return ButtonPureComponent({
        title,
        type,
        block,
        ghost,
      });
    },
  },

  args: {
    theme: themeOptions[0],
    ghost: false,
    title: defaultTitle,
  },

  argTypes: {
    theme: {
      options: themeOptions,
      control: {
        type: 'select',
      },
    },
  },

  decorators: [
    (story, { args }) => /* html */ `
      <div ${(() => (args.theme ? `data-tw-theme="${args.theme}"` : ''))()}>
        <div class="py-10 bg-theme-bg-color">
          <div class="container">
            ${story()}
          </div>
        </div>
      </div>
    `,
  ],
};

type ButtonArgs = Partial<ButtonTwigContext> & {
  /** Determines what title to use (if no `title` was passed in). */
  title?: string;
  /** Only affects story-decorator (just for demo). */
  theme?: (typeof themeOptions)[number];
};

export const Button = makeComponentInjector({
  pureComponent: ButtonPureComponent,
  storyRenderFn: ButtonStory.parameters.render,
  defaultArgs: ButtonStory.args,
});
