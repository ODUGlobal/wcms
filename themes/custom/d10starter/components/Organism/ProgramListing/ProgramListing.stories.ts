import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import ProgramListingTemplate from './ProgramListing.twig';
import {
  Heading,
  HeadingTwigContext,
  defaultHeading,
} from '@components/Atom/Heading/Heading.stories';
import { ProgramListingItemTwigContext } from '@components/Molecule/ProgramListingItem/ProgramListingItem.stories';

const ProgramListingPureComponent = (twigContext: ProgramListingTwigContext) =>
  ProgramListingTemplate(twigContext);

export type ProgramListingTwigContext = {
  heading?: HeadingTwigContext;
  /**
   * For the headings in the individual items.
   * If none is provided, will default to 3 if there's a `heading` for the whole component,
   * and otherwise will default to 2.
   */
  itemHLevel?: 2 | 3 | 4;
  items: ProgramListingItemTwigContext[];
  id?: string;
  verticalRhythm?: string;
};

const meta: Meta = {
  title: 'Organism/Program Listing',
  excludeStories: ['ProgramListing'],
};

export default meta;

const defaultItems: ProgramListingTwigContext['items'] = [
  {
    heading: defaultHeading({ ...Heading.args, headline: 'A' }),
    linkGroup: [
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
    ],
  },
  {
    heading: defaultHeading({ ...Heading.args, headline: 'B' }),
    linkGroup: [
      {
        link: { url: '#', title: 'Biology' },
        description: 'Minor',
      },
      {
        link: { url: '#', title: 'Business Administration' },
        description: 'Bachelor of Science in Business Administration',
      },
      {
        link: { url: '#', title: 'Business Administration' },
        description: 'Master of Business Administration',
      },
      {
        link: { url: '#', title: 'Business Administration' },
        description: 'Minor',
      },
      {
        link: { url: '#', title: 'Business Analytics' },
        description: 'Bachelor of Science in Business Administration',
      },
      {
        link: { url: '#', title: 'Business Analytics' },
        description: 'Minor',
      },
      {
        link: { url: '#', title: 'Business Analytics and Big Data' },
        description: 'Graduate Certificate',
      },
    ],
  },
];

export const ProgramListingStory: Story<ProgramListingArgs> = {
  name: 'Program Listing',

  parameters: {
    render: ({ id, verticalRhythm, headline, heading, items, itemHLevel }) => {
      heading =
        heading ||
        (headline ? defaultHeading({ ...Heading.args, headline }) : undefined);

      items = items || defaultItems;

      return ProgramListingPureComponent({
        id,
        verticalRhythm,
        items,
        itemHLevel,
        heading,
      });
    },
  },

  args: {
    headline: '',
  },
};

type ProgramListingArgs = Partial<ProgramListingTwigContext> & {
  headline?: string;
};

export const ProgramListing = makeComponentInjector({
  pureComponent: ProgramListingPureComponent,
  storyRenderFn: ProgramListingStory.parameters.render,
  defaultArgs: ProgramListingStory.args,
});
