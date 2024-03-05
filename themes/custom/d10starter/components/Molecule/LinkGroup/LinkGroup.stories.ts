import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import LinkGroupTemplate from './LinkGroup.twig';
import { HeadingTwigContext } from '@components/Atom/Heading/Heading.stories';
import {
  FancyLinkListTwigContext,
  defaultFancyLinkList,
} from '@components/Molecule/LinkList/FancyLinkList/FancyLinkList.stories';

const LinkGroupPureComponent = (twigContext: LinkGroupTwigContext) =>
  LinkGroupTemplate(twigContext);

export type LinkGroupTwigContext = {
  heading?: HeadingTwigContext;
  /**
   * For optional `heading`.
   * Should default to 3 if part of a `LinkCollection` that has its own `heading`, and 2 otherwise.
   */
  hLevel?: 2 | 3 | 4;
  fancyLinkList: FancyLinkListTwigContext;
  /**
   * If `true`, will allow a column-break within this item.
   * (Default behavior is to always disallow column-breaks within individual link-groups,
   * but if one link-group is extremely long then this can be a good option. For example,
   * in the `partnerLocationsBlock`, we want to use this for the "Virginia" link-group.)
   */
  allowColumnBreak?: boolean;
};

const injectHelper: {
  [K in keyof Required<LinkGroupTwigContext>]: K;
} = {
  heading: 'heading',
  hLevel: 'hLevel',
  fancyLinkList: 'fancyLinkList',
  allowColumnBreak: 'allowColumnBreak',
};

const meta: Meta = {
  title: 'Molecule/Link Group',
  excludeStories: ['LinkGroup', 'LinkGroupStory'],
};

export default meta;

export const LinkGroupStory: Story<LinkGroupArgs> = {
  name: 'Link Group',

  parameters: {
    render: ({ heading, hLevel, fancyLinkList, allowColumnBreak }) => {
      fancyLinkList = fancyLinkList || defaultFancyLinkList({});

      return LinkGroupPureComponent({
        heading,
        hLevel,
        fancyLinkList,
        allowColumnBreak,
      });
    },
  },

  args: {},
};

type LinkGroupArgs = Partial<LinkGroupTwigContext> & {
  foo?: never;
};

export const LinkGroup = makeComponentInjector({
  twigContextKeys: Object.values(injectHelper),
  pureComponent: LinkGroupPureComponent,
  storyRenderFn: LinkGroupStory.parameters.render,
  defaultArgs: LinkGroupStory.args,
});
