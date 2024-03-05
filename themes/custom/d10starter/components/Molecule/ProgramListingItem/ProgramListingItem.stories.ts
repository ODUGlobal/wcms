import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import ProgramListingItemTemplate from './ProgramListingItem.twig';
import {
  Heading,
  HeadingTwigContext,
  defaultHeading,
} from '@components/Atom/Heading/Heading.stories';

const ProgramListingItemPureComponent = (
  twigContext: ProgramListingItemTwigContext
) => ProgramListingItemTemplate(twigContext);

export type ProgramListingItemTwigContext = {
  heading: HeadingTwigContext;
  /**
   * Defaults to `2`, but the `ProgramListing` should really set it based
   * on whether it has its own `h2` or not.
   */
  hLevel?: 2 | 3 | 4;
  linkGroup: {
    link: { url: string; title: string };
    description?: string;
  }[];
};

const injectHelper: {
  [K in keyof Required<ProgramListingItemTwigContext>]: K;
} = {
  heading: 'heading',
  hLevel: 'hLevel',
  linkGroup: 'linkGroup',
};

const meta: Meta = {
  title: 'Molecule/Program Listing Item',
  excludeStories: ['ProgramListingItem', 'ProgramListingItemStory'],
};

export default meta;

export const ProgramListingItemStory: Story<ProgramListingItemArgs> = {
  name: 'Program Listing Item',

  parameters: {
    render: ({ heading, hLevel, linkGroup }) => {
      heading = heading || defaultHeading({ ...Heading.args, headline: 'A' });

      linkGroup = linkGroup || [
        {
          link: { url: '#', title: 'Accounting' },
          description: 'Bachelor of Science in Business Administration',
        },
        {
          link: { url: '#', title: 'Accounting' },
          description: 'Minor',
        },
        {
          link: { url: '#', title: 'Addiction Prevention and Treatment' },
          description: 'Certificate',
        },
        {
          link: { url: '#', title: 'Addiction Prevention and Treatment' },
          description: 'Minor',
        },
        {
          link: { url: '#', title: 'Adult-Gerontology CNS Post-Professional' },
          description: 'Graduate Certificate',
        },
        {
          link: { url: '#', title: 'Aerospace Engineering' },
          description: 'Master of Science or Master of Engineering',
        },
        {
          link: { url: '#', title: 'Autism Spectrum Disorders' },
          description: 'Graduate Certificate',
        },
      ];

      return ProgramListingItemPureComponent({ heading, hLevel, linkGroup });
    },
  },

  args: {},
};

type ProgramListingItemArgs = Partial<ProgramListingItemTwigContext> & {
  foo?: never;
};

export const ProgramListingItem = makeComponentInjector({
  twigContextKeys: Object.values(injectHelper),
  pureComponent: ProgramListingItemPureComponent,
  storyRenderFn: ProgramListingItemStory.parameters.render,
  defaultArgs: ProgramListingItemStory.args,
});
