import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import MixedTeaserCollectionTemplate from './MixedTeaserCollection.twig';
import {
  Heading,
  HeadingTwigContext,
  defaultHeading,
} from '@components/Atom/Heading/Heading.stories';
import {
  Editorial,
  EditorialTwigContext,
} from '@components/Organism/Editorial/Editorial.stories';
import {
  FancyLinkListTwigContext,
  defaultFancyLinks,
} from '@components/Molecule/LinkList/FancyLinkList/FancyLinkList.stories';
import Theme from '@components/_ts-helpers/theme';
import {
  StandardTeaserTwigContext,
  defaultStandardTeaserPicture,
} from '@components/Molecule/Teaser/StandardTeaser/StandardTeaser.stories';
import { StackedTeaserCollectionTwigContext } from '../StackedTeaserCollection/StackedTeaserCollection.stories';
import itemsFromCount from '@components/_ts-helpers/items-from-count';
import {
  StackedTeaser,
  defaultStackedTeaserPicture,
} from '@components/Molecule/Teaser/StackedTeaser/StackedTeaser.stories';

const themeOptions = [
  null,
  Theme.Default,
  Theme.Neutral50,
  Theme.MidBlue500,
] as const;

const MixedTeaserCollectionPureComponent = (
  twigContext: MixedTeaserCollectionTwigContext
) => MixedTeaserCollectionTemplate(twigContext);

export type MixedTeaserCollectionTwigContext = {
  id?: string;
  verticalRhythm?: string;
  theme?: (typeof themeOptions)[number];
  heading?: HeadingTwigContext;
  editorial?: EditorialTwigContext;
  fancyLinkList?: FancyLinkListTwigContext;
  /** Required. */
  standardTeaser: StandardTeaserTwigContext;
  /**
   * Required.
   * Note that the `noGenericSlab` option is enforced via the Twig template.
   * This means that the following properties won't do anything here:
   * `heading`, `editorial`, `fancyLinkList`, `theme`, `id`, `verticalRhythm`
   */
  stackedTeaserCollection: Omit<
    StackedTeaserCollectionTwigContext,
    | 'heading'
    | 'editorial'
    | 'fancyLinkList'
    | 'theme'
    | 'id'
    | 'verticalRhythm'
  >;
};

const meta: Meta = {
  title: 'Organism/Teaser Collection/Mixed Teaser Collection',
  excludeStories: ['MixedTeaserCollection', 'defaultMixedTeaserCollection'],
};

export default meta;

export const defaultMixedTeaserCollection = ({
  id,
  verticalRhythm,
  theme,
  heading,
  headline,
  editorial,
  withEditorial,
  fancyLinkList,
  withFancyLinks,
  standardTeaser,
  stackedTeaserCollection,
  stackedTeaserCount,
}: MixedTeaserCollectionArgs): MixedTeaserCollectionTwigContext => {
  heading =
    heading ||
    (headline ? defaultHeading({ ...Heading.args, headline }) : undefined);

  editorial =
    editorial ||
    (withEditorial
      ? {
          wysiwyg: /* html */ `<p>Description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lacus neque, luctus sit amet erat quis, vestibulum tempor ligula. Etiam varius turpis aliquam purus pharetra tincidunt.</p>`,
        }
      : undefined);

  fancyLinkList =
    fancyLinkList ||
    (withFancyLinks
      ? { fancyLinks: defaultFancyLinks({ arrowPosition: 'after' }) }
      : undefined);

  standardTeaser = standardTeaser || {
    link: {
      url: '#',
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    },
    superhead: 'Superhead',
    subhead: 'Subhead',
    picture: defaultStandardTeaserPicture,
    editorial: {
      wysiwyg: /* html */ `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas at consectetur magna, eget auctor eros. Maecenas mollis metus risus, quis molestie nisi commodo congue.</p>`,
    },
  };

  stackedTeaserCollection = stackedTeaserCollection || {
    teasers: itemsFromCount(
      [
        {
          link: {
            url: '#',
            title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          },
          superhead: 'Superhead',
          subhead: 'Subhead',
          picture: defaultStackedTeaserPicture,
          editorial: {
            wysiwyg: /* html */ `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas at consectetur magna, eget auctor eros. Maecenas mollis metus risus, quis molestie nisi commodo congue.</p>`,
          },
        },
      ].map((args: typeof StackedTeaser.args) => StackedTeaser(args)),
      stackedTeaserCount
    ),
  };

  return {
    id,
    verticalRhythm,
    theme,
    heading,
    editorial,
    fancyLinkList,
    standardTeaser,
    stackedTeaserCollection,
  };
};

export const MixedTeaserCollectionStory: Story<MixedTeaserCollectionArgs> = {
  name: 'Mixed Teaser Collection',

  parameters: {
    render: (args) =>
      MixedTeaserCollectionPureComponent(defaultMixedTeaserCollection(args)),
  },

  args: {
    theme: themeOptions[0],
    stackedTeaserCount: 2,
    headline:
      'Mixed Teaser Collection (One Standard Teaser, Plus a Stacked Teaser Collection)',
    withFancyLinks: true,
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

type MixedTeaserCollectionArgs = Partial<MixedTeaserCollectionTwigContext> & {
  stackedTeaserCount?: number;
  headline?: string;
  withFancyLinks?: boolean;
  withEditorial?: boolean;
};

export const MixedTeaserCollection = makeComponentInjector({
  pureComponent: MixedTeaserCollectionPureComponent,
  storyRenderFn: MixedTeaserCollectionStory.parameters.render,
  defaultArgs: MixedTeaserCollectionStory.args,
});
