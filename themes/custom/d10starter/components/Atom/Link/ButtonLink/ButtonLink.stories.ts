import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import ButtonLinkTemplate from './ButtonLink.twig';
import {
  themeOptions,
  ButtonStory,
} from '@components/Atom/Button/Button.stories';

const ButtonLinkPureComponent = (twigContext: ButtonLinkTwigContext) =>
  ButtonLinkTemplate(twigContext);

export type ButtonLinkTwigContext = {
  link: { url: string; title: string };
  /** If `true`, will use `display: block` instead of `display: inline-block`. */
  block?: boolean;
  ghost?: boolean;
};

const meta: Meta = {
  title: 'Atom/Link/Button Link',
  excludeStories: ['ButtonLink', 'defaultButtonLink'],
};

export default meta;

export const defaultButtonLink: ButtonLinkTwigContext = {
  link: { url: '#', title: 'This is a button link' },
};

const defaultLinkTitle =
  'This is a long link title so that we can easily see wrapping behavior.';

export const ButtonLinkStory: Story<ButtonLinkArgs> = {
  name: 'Button Link',

  parameters: {
    render: ({ link, title, block, ghost }) => {
      link = link || { url: '#', title: title || defaultLinkTitle };

      return ButtonLinkPureComponent({
        link,
        block,
        ghost,
      });
    },
  },

  args: {
    theme: themeOptions[0],
    ghost: false,
    title: defaultLinkTitle,
  },

  argTypes: {
    theme: {
      options: themeOptions,
      control: {
        type: 'select',
      },
    },
  },

  decorators: [...(ButtonStory.decorators || [])],
};

type ButtonLinkArgs = Partial<ButtonLinkTwigContext> & {
  /** Determines what link-title to use (if no `link` was passed in). */
  title?: string;
  /** Only affects story-decorator (just for demo). */
  theme?: (typeof themeOptions)[number];
};

export const ButtonLink = makeComponentInjector({
  pureComponent: ButtonLinkPureComponent,
  storyRenderFn: ButtonLinkStory.parameters.render,
  defaultArgs: ButtonLinkStory.args,
});
