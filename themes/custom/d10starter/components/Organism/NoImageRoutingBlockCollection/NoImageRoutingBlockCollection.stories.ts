import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import NoImageRoutingBlockCollectionTemplate from './NoImageRoutingBlockCollection.twig';
import {
  Heading,
  HeadingTwigContext,
  defaultHeading,
} from '@components/Atom/Heading/Heading.stories';
import {
  defaultFancyLinks,
  FancyLinkListTwigContext,
} from '@components/Molecule/LinkList/FancyLinkList/FancyLinkList.stories';
import { EditorialTwigContext } from '../Editorial/Editorial.stories';
import {
  defaultRoutingBlockPicture,
  NoImageRoutingBlock,
  NoImageRoutingBlockTwigContext,
} from '@components/Molecule/NoImageRoutingBlock/NoImageRoutingBlock.stories';
import Theme from '@components/_ts-helpers/theme';
import itemsFromCount from '@components/_ts-helpers/items-from-count';
import { defaultButtonLinkList } from '@components/Molecule/LinkList/ButtonLinkList/ButtonLinkList.stories';
import {
  CostBlocks,
  defaultCostBlocks,
} from '@components/Molecule/CostBlocks/CostBlocks.stories';

const themeOptions = [
  null,
  Theme.Default,
  Theme.Neutral50,
  Theme.MidBlue500,
] as const;

const NoImageRoutingBlockCollectionPureComponent = (
  twigContext: NoImageRoutingBlockCollectionTwigContext
) => NoImageRoutingBlockCollectionTemplate(twigContext);

export type NoImageRoutingBlockCollectionTwigContext = {
  heading?: HeadingTwigContext;
  fancyLinkList?: FancyLinkListTwigContext;
  editorial?: EditorialTwigContext;
  routingBlocks: InjectedComponent<typeof NoImageRoutingBlock>[];
  /** Defaults to 3 if the collection has a `heading` and 2 otherwise, but override if needed. */
  routingBlockHLevel?: 2 | 3 | 4;
  /**
   * If `true`, will split into two columns no matter what.
   * Otherwise, default behavior is: split into two columns only if there are at least 4 items.
   */
  withColumns?: boolean;
  id?: string;
  /** To override default vertical-rhythm classes (outermost vertical-margins). */
  verticalRhythm?: string;
  theme?: (typeof themeOptions)[number];
};

const meta: Meta = {
  title: 'Organism/No Image Routing Block Collection',
  excludeStories: [
    'NoImageRoutingBlockCollection',
    'defaultRoutingBlocks',
    'defaultNoImageRoutingBlockCollection',
  ],
};

export default meta;

const defaultRoutingBlockData: (typeof NoImageRoutingBlock.args)[] = [
  {
    headline: 'Lorem ipsum dolor sit amet',
    superhead: 'Superhead',
    subhead: 'Subhead',
    editorial: {
      wysiwyg: /* html */ `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lacus neque, luctus sit amet erat quis, vestibulum tempor ligula. Etiam varius turpis aliquam purus pharetra tincidunt. In ac odio semper, volutpat metus in, mattis ante. Sed a dignissim urna.</p>`,
    },
  },
  {
    headline:
      'This headline is a bit longer than the others, because we need to see various lengths and wrapping behavior. No picture this time.',
    superhead: 'Superhead',
    subhead: 'Subhead',
    editorial: {
      wysiwyg: /* html */ `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.  In ac odio semper, volutpat metus in, mattis ante. Sed a dignissim urna.</p>`,
    },
  },
  {
    headline: 'Short one',
    superhead: 'A longer superhead on this one for the sake of variety',
    subhead: 'Subhead',
    editorial: {
      wysiwyg: /* html */ `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lacus neque, luctus sit amet erat quis, vestibulum tempor ligula. Etiam varius turpis aliquam purus pharetra tincidunt. In ac odio semper, volutpat metus in, mattis ante.</p>`,
    },
  },
  {
    headline: 'Another no image routing block here',
    superhead: 'Superhead',
    subhead:
      'This subhead is longer than the others because variety is the spice of life',
    editorial: {
      wysiwyg: /* html */ `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lacus neque, luctus sit amet erat quis, vestibulum tempor ligula. Etiam varius turpis aliquam purus pharetra tincidunt. </p>`,
    },
  },
];

export const defaultRoutingBlocks = ({
  withIcons,
  withSuperheads,
  withSubheads,
  withDescriptions,
  withFancyLinkList,
  withButtonLinks,
  withCostBlocks,
}: {
  withIcons?: boolean;
  withSuperheads?: boolean;
  withSubheads?: boolean;
  withDescriptions?: boolean;
  withFancyLinkList?: boolean;
  withButtonLinks?: boolean;
  withCostBlocks?: boolean;
}): NoImageRoutingBlockCollectionTwigContext['routingBlocks'] =>
  defaultRoutingBlockData.map((routingBlockProps) =>
    NoImageRoutingBlock({
      ...routingBlockProps,
      ...(withIcons ? { picture: defaultRoutingBlockPicture } : {}),
      ...(!withSuperheads ? { superhead: undefined } : {}),
      ...(!withSubheads ? { subhead: undefined } : {}),
      ...(!withDescriptions ? { editorial: undefined } : {}),
      ...(withFancyLinkList
        ? {
            fancyLinkList: {
              fancyLinks: defaultFancyLinks({ arrowPosition: 'after' }),
            },
          }
        : {}),
      ...(withButtonLinks
        ? {
            buttonLinkList: defaultButtonLinkList,
          }
        : {}),
      ...(withCostBlocks
        ? { costBlocks: defaultCostBlocks(CostBlocks.args) }
        : {}),
    })
  );

export const defaultNoImageRoutingBlockCollection = ({
  heading,
  headline,
  fancyLinkList,
  withFancyLinks,
  editorial,
  withEditorial,
  routingBlocks,
  routingBlockHLevel,
  withColumns,
  withIcons,
  withSuperheads,
  withSubheads,
  withDescriptions,
  withItemFancyLinks,
  withButtonLinks,
  withCostBlocks,
  itemCount,
  id,
  verticalRhythm,
  theme,
}: NoImageRoutingBlockCollectionArgs): NoImageRoutingBlockCollectionTwigContext => {
  heading =
    heading ||
    (headline ? defaultHeading({ ...Heading.args, headline }) : undefined);

  fancyLinkList =
    fancyLinkList ||
    (withFancyLinks
      ? { fancyLinks: defaultFancyLinks({ arrowPosition: 'after' }) }
      : undefined);

  editorial =
    editorial ||
    (withEditorial
      ? {
          wysiwyg: /* html */ `<p>Description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lacus neque, luctus sit amet erat quis, vestibulum tempor ligula. Etiam varius turpis aliquam purus pharetra tincidunt. In ac odio semper, volutpat metus in, mattis ante. Sed a dignissim urna. Nullam ac sapien magna.</p>`,
        }
      : undefined);

  routingBlocks =
    routingBlocks ||
    itemsFromCount(
      defaultRoutingBlocks({
        withIcons,
        withSuperheads,
        withSubheads,
        withDescriptions,
        withFancyLinkList: withItemFancyLinks,
        withButtonLinks,
        withCostBlocks,
      }),
      itemCount
    );

  return {
    heading,
    fancyLinkList,
    editorial,
    routingBlocks,
    routingBlockHLevel,
    withColumns,
    id,
    verticalRhythm,
    theme,
  };
};

export const NoImageRoutingBlockCollectionStory: Story<NoImageRoutingBlockCollectionArgs> =
  {
    name: 'No Image Routing Block Collection',

    parameters: {
      render: (args) =>
        NoImageRoutingBlockCollectionPureComponent(
          defaultNoImageRoutingBlockCollection(args)
        ),
    },

    args: {
      itemCount: 3,
      withColumns: false,
      theme: themeOptions[0],
      headline: '',
      withFancyLinks: false,
      withEditorial: false,
      withIcons: true,
      withSuperheads: true,
      withSubheads: true,
      withDescriptions: true,
      withItemFancyLinks: true,
      withButtonLinks: true,
      withCostBlocks: false,
    },

    argTypes: {
      withColumns: {
        name: 'withColumns (for 2-up layout)',
      },
      theme: {
        options: themeOptions,
        control: {
          type: 'select',
        },
      },
    },
  };

type NoImageRoutingBlockCollectionArgs =
  Partial<NoImageRoutingBlockCollectionTwigContext> & {
    itemCount?: number;
    headline?: string;
    withFancyLinks?: boolean;
    withEditorial?: boolean;
    withIcons?: boolean;
    withSuperheads?: boolean;
    withSubheads?: boolean;
    withDescriptions?: boolean;
    withItemFancyLinks?: boolean;
    withButtonLinks?: boolean;
    withCostBlocks?: boolean;
  };

export const NoImageRoutingBlockCollection = makeComponentInjector({
  pureComponent: NoImageRoutingBlockCollectionPureComponent,
  storyRenderFn: NoImageRoutingBlockCollectionStory.parameters.render,
  defaultArgs: NoImageRoutingBlockCollectionStory.args,
});
