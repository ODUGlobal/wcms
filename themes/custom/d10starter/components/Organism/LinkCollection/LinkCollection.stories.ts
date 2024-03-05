import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import LinkCollectionTemplate from './LinkCollection.twig';
import Theme from '@components/_ts-helpers/theme';
import {
  Heading,
  HeadingTwigContext,
  defaultHeading,
} from '@components/Atom/Heading/Heading.stories';
import {
  FancyLinkList,
  FancyLinkListTwigContext,
  defaultFancyLinkList,
  defaultFancyLinks,
} from '@components/Molecule/LinkList/FancyLinkList/FancyLinkList.stories';
import {
  EditorialTwigContext,
  defaultEditorial,
} from '../Editorial/Editorial.stories';
import itemsFromCount from '@components/_ts-helpers/items-from-count';
import { LinkGroup } from '@components/Molecule/LinkGroup/LinkGroup.stories';

const themeOptions = [null, Theme.Default, Theme.Neutral50] as const;

const LinkCollectionPureComponent = (twigContext: LinkCollectionTwigContext) =>
  LinkCollectionTemplate(twigContext);

export type LinkCollectionTwigContext = {
  noGenericSlab?: boolean;
  heading?: HeadingTwigContext;
  fancyLinkList?: FancyLinkListTwigContext;
  editorial?: EditorialTwigContext;
  /**
   * For optional headings of the individual link-groups.
   * Should default to 3 if the whole collection has a `heading`, and 2 otherwise.
   */
  hLevel?: 2 | 3 | 4;
  /**
   * For licensure page in Drupal, will instead be `LinkGroupTwigContext[]` (for now, anyway).
   * Everywhere else (in SB and Drupal), should be injected-component as below.
   */
  linkGroups: InjectedComponent<typeof LinkGroup>[];
  id?: string;
  verticalRhythm?: string;
  theme?: (typeof themeOptions)[number];
};

const meta: Meta = {
  title: 'Organism/Link Collection',
  excludeStories: ['LinkCollection', 'defaultLinkCollection'],
};

export default meta;

const defaultLinkGroups: LinkCollectionTwigContext['linkGroups'] = [
  {
    heading: {
      headline: 'Strongly Recommended Headline, Longer for Testing Purposes',
    },
    fancyLinkList: defaultFancyLinkList(FancyLinkList.args),
  },
  {
    heading: { headline: 'Optional Headline' },
    fancyLinkList: defaultFancyLinkList({
      ...FancyLinkList.args,
      itemCount: 9,
    }),
  },
  {
    heading: { headline: 'Optional Headline' },
    fancyLinkList: defaultFancyLinkList({
      ...FancyLinkList.args,
      itemCount: 6,
    }),
  },
  {
    heading: { headline: 'Optional Headline' },
    fancyLinkList: defaultFancyLinkList({
      ...FancyLinkList.args,
      itemCount: 7,
    }),
  },
].map((args: typeof LinkGroup.args) => LinkGroup(args));

export const defaultLinkCollection = ({
  noGenericSlab,
  heading,
  headline,
  fancyLinkList,
  withFancyLinkList,
  editorial,
  withEditorial,
  hLevel,
  linkGroups,
  itemCount,
  id,
  verticalRhythm,
  theme,
}: LinkCollectionArgs): LinkCollectionTwigContext => {
  heading =
    heading ||
    (headline ? defaultHeading({ ...Heading.args, headline }) : undefined);

  fancyLinkList =
    fancyLinkList ||
    (withFancyLinkList
      ? { fancyLinks: defaultFancyLinks({ arrowPosition: 'after' }) }
      : undefined);

  editorial = editorial || (withEditorial ? defaultEditorial : undefined);

  linkGroups = linkGroups || itemsFromCount(defaultLinkGroups, itemCount);

  return {
    noGenericSlab,
    heading,
    fancyLinkList,
    editorial,
    hLevel,
    linkGroups,
    id,
    verticalRhythm,
    theme,
  };
};

export const LinkCollectionStory: Story<LinkCollectionArgs> = {
  name: 'Link Collection',

  parameters: {
    render: (args) => LinkCollectionPureComponent(defaultLinkCollection(args)),
  },

  args: {
    theme: themeOptions[0],
    headline: 'Link Collection',
    itemCount: 3,
    withFancyLinkList: true,
    withEditorial: true,
  },

  argTypes: {
    theme: {
      options: themeOptions,
      control: {
        type: 'select',
      },
    },
  },
};

type LinkCollectionArgs = Partial<LinkCollectionTwigContext> & {
  headline?: string;
  itemCount?: number;
  withFancyLinkList?: boolean;
  withEditorial?: boolean;
};

export const LinkCollection = makeComponentInjector({
  pureComponent: LinkCollectionPureComponent,
  storyRenderFn: LinkCollectionStory.parameters.render,
  defaultArgs: LinkCollectionStory.args,
});
