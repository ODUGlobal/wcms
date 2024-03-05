import {
  FancyLink,
  FancyLinkTwigContext,
} from '@components/Atom/Link/FancyLink/FancyLink.stories';
import itemsFromCount from '@components/_ts-helpers/items-from-count';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';
import { Story, Meta } from '@components/_ts-helpers/types';

import FancyLinkListTemplate from './FancyLinkList.twig';
import Theme from '@components/_ts-helpers/theme';

/*
  For demo-purposes, all theme-options should be available.
  At the moment, there are no color "options" -- it's just based on the theme.
*/
const themeOptions = [null, ...Object.values(Theme)] as const;

const FancyLinkListPureComponent = (twigContext: FancyLinkListTwigContext) =>
  FancyLinkListTemplate(twigContext);

export type FancyLinkListTwigContext = {
  /** If `true`, list will go left-to-right before wrapping. Defaults to `false`. */
  inline?: boolean;
  /** Only for `inline: true` */
  centered?: boolean;
  /** If `true` (and if not `inline`), then break into 2 columns when there are at least 4 links. */
  columns?: boolean;
  fancyLinks: FancyLinkTwigContext[];
  /** If `true` (and if not `inline`), will reduce the space between the fancy-links. */
  slim?: boolean;
};

const meta: Meta = {
  title: 'Molecule/Link List/Fancy Link List',
  excludeStories: [
    'FancyLinkList',
    'defaultFancyLinks',
    'defaultFancyLinkList',
  ],
};

export default meta;

const arrowPositionOptions = ['after', 'before', 'none'] as const;

export const defaultFancyLinks = ({
  arrowPosition,
}: {
  arrowPosition?: (typeof arrowPositionOptions)[number];
}): FancyLinkListTwigContext['fancyLinks'] =>
  [
    'This is a fancy link',
    'Another fancy link',
    'Yet another fancy link',
    'Short one',
  ].map((title) => ({
    link: { title, url: '#' },
    withAfterIcon: arrowPosition === 'after',
    withBeforeIcon: arrowPosition === 'before',
  }));

export const defaultFancyLinkList = ({
  inline,
  centered,
  fancyLinks,
  arrowPosition,
  itemCount,
  columns,
  slim,
}: FancyLinkListArgs): FancyLinkListTwigContext => {
  fancyLinks =
    fancyLinks ||
    itemsFromCount(defaultFancyLinks({ arrowPosition }), itemCount);

  return {
    inline,
    centered,
    fancyLinks,
    columns,
    slim,
  };
};

export const FancyLinkListStory: Story<FancyLinkListArgs> = {
  name: 'Fancy Link List',

  parameters: {
    render: (args) => FancyLinkListPureComponent(defaultFancyLinkList(args)),
  },

  args: {
    theme: themeOptions[0],
    arrowPosition: arrowPositionOptions[0],
    inline: false,
    centered: false,
    columns: false,
    itemCount: 4,
    slim: false,
  },

  argTypes: {
    theme: {
      options: themeOptions,
      control: {
        type: 'select',
      },
    },
    arrowPosition: {
      options: arrowPositionOptions,
      control: {
        type: 'select',
      },
    },
    centered: {
      name: 'centered (only for inline)',
    },
    columns: {
      name: 'columns (not inline; at least 4 items)',
    },
    slim: {
      name: 'slim (not inline)',
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

type FancyLinkListArgs = Partial<FancyLinkListTwigContext> & {
  /** Determines how many default fancy-links to use (if no `FancyLinks` is provided). Defaults to 4. */
  itemCount?: number;
  /** Only affects story-decorator (just for demo). */
  theme?: (typeof themeOptions)[number];
  arrowPosition?: (typeof arrowPositionOptions)[number];
};

export const FancyLinkList = makeComponentInjector({
  pureComponent: FancyLinkListPureComponent,
  storyRenderFn: FancyLinkListStory.parameters.render,
  defaultArgs: FancyLinkListStory.args,
});
