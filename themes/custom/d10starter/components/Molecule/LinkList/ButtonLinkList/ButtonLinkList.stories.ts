import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import ButtonLinkListTemplate from './ButtonLinkList.twig';
import Theme from '@components/_ts-helpers/theme';
import { ButtonLinkTwigContext } from '@components/Atom/Link/ButtonLink/ButtonLink.stories';
import itemsFromCount from '@components/_ts-helpers/items-from-count';

/*
  For demo-purposes, all theme-options should be available.
  At the moment, there are no color "options" -- it's just based on the theme.
*/
const themeOptions = [null, ...Object.values(Theme)] as const;

const ButtonLinkListPureComponent = (twigContext: ButtonLinkListTwigContext) =>
  ButtonLinkListTemplate(twigContext);

export type ButtonLinkListTwigContext = {
  /** If `true`, gets special stacked-layout on very narrow viewports. */
  stackedOnMobile?: boolean;
  buttonLinks: ButtonLinkTwigContext[];
};

const meta: Meta = {
  title: 'Molecule/Link List/Button Link List',
  excludeStories: ['ButtonLinkList', 'defaultButtonLinkList'],
};

export default meta;

const defaultButtonLinks: ButtonLinkListTwigContext['buttonLinks'] = [
  'A button-link',
  'Another one',
  'This too is a button-link',
  'We are all button-links',
].map((title, i) => ({ link: { title, url: '#' }, ghost: !!(i % 2) }));

export const defaultButtonLinkList: ButtonLinkListTwigContext = {
  buttonLinks: defaultButtonLinks.slice(0, 2),
};

export const ButtonLinkListStory: Story<ButtonLinkListArgs> = {
  name: 'Button Link List',

  parameters: {
    render: ({ stackedOnMobile, buttonLinks, itemCount }) => {
      buttonLinks =
        buttonLinks || itemsFromCount(defaultButtonLinks, itemCount);

      return ButtonLinkListPureComponent({
        stackedOnMobile,
        buttonLinks,
      });
    },
  },

  args: {
    theme: themeOptions[0],
    itemCount: 2,
    stackedOnMobile: false,
  },

  argTypes: {
    theme: {
      options: themeOptions,
      control: {
        type: 'select',
      },
    },
    stackedOnMobile: {
      name: 'stackedOnMobile (special stacked layout for very narrow viewports only)',
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

type ButtonLinkListArgs = Partial<ButtonLinkListTwigContext> & {
  /** Determines how many default fancy-links to use (if no `FancyLinks` is provided). Defaults to 4. */
  itemCount?: number;
  /** Only affects story-decorator (just for demo). */
  theme?: (typeof themeOptions)[number];
};

export const ButtonLinkList = makeComponentInjector({
  pureComponent: ButtonLinkListPureComponent,
  storyRenderFn: ButtonLinkListStory.parameters.render,
  defaultArgs: ButtonLinkListStory.args,
});
