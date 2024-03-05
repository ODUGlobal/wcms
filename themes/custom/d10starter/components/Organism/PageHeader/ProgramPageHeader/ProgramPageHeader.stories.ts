import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import ProgramPageHeaderTemplate from './ProgramPageHeader.twig';
import { HeadingTwigContext } from '@components/Atom/Heading/Heading.stories';
import {
  Picture,
  PictureTwigContext,
  defaultPicture,
} from '@components/Atom/Media/Picture/Picture.stories';
import { ButtonLinkTwigContext } from '@components/Atom/Link/ButtonLink/ButtonLink.stories';
import { FancyLinkTwigContext } from '@components/Atom/Link/FancyLink/FancyLink.stories';

const ProgramPageHeaderPureComponent = (
  twigContext: ProgramPageHeaderTwigContext
) => ProgramPageHeaderTemplate(twigContext);

export type ProgramPageHeaderTwigContext = {
  /** Optional "accreditation" picture to go above heading. */
  picture?: InjectedComponent<typeof Picture>;
  heading: HeadingTwigContext;
  /** Each item has a `title` and OPTIONALLY a `url` (i.e., it may or may not be a link). */
  list?: { title: string; url?: string }[];
  /** There can be 0, 1, or 2 items here. */
  programOptions?: [ProgramOption] | [ProgramOption, ProgramOption];
  buttonLink?: ButtonLinkTwigContext;
  fancyLink?: FancyLinkTwigContext;
};

type ProgramOption = { headline?: string; list?: string[] };

const meta: Meta = {
  title: 'Organism/Page Header/Program Page Header',
  excludeStories: ['ProgramPageHeader', 'defaultProgramPageHeader'],
};

export default meta;

const programOptionCountOptions = [0, 1, 2] as const;

const defaultHeadline = 'Accounting Program Online';

export const defaultProgramPageHeader = ({
  picture,
  withPicture,
  heading,
  headline,
  list,
  withList,
  programOptions,
  programOptionCount,
  buttonLink,
  withButtonLink,
  fancyLink,
  withFancyLink,
}: ProgramPageHeaderArgs): ProgramPageHeaderTwigContext => {
  heading = heading || { headline: headline || defaultHeadline };

  picture =
    picture ||
    (withPicture
      ? Picture({
          ...Picture.args,
          src: `${window.IMAGES}/sample-accreditation.png`,
        })
      : undefined);

  list =
    list ||
    (withList
      ? [
          'Bachelor of Science in Business Administration',
          'Strome College of Business',
          'School of Accountancy',
        ].map((title, i) => ({ title, ...(i ? { url: '#' } : {}) }))
      : undefined);

  programOptionCount =
    programOptionCount === undefined ? 2 : programOptionCount;

  programOptions =
    programOptions ||
    (() => {
      switch (programOptionCount) {
        case 0:
          return undefined;
        case 1:
          return [
            {
              headline: 'Degree Completion',
              list: [
                'For students with some college credits',
                'Complete at least 30 credits online from ODU',
              ],
            },
          ];
        case 2:
          return [
            {
              headline: 'Degree Completion',
              list: [
                'For students with some college credits',
                'Complete at least 30 credits online from ODU',
              ],
            },
            {
              headline: 'Full Program',
              list: [
                'A start-to-finish curriculum for students to earn a degree online from ODU',
                '30 credit hours minimum',
              ],
            },
          ];
      }
    })();

  buttonLink =
    buttonLink ||
    (withButtonLink
      ? { link: { title: 'Request Information', url: '#' } }
      : undefined);

  fancyLink =
    fancyLink ||
    (withFancyLink
      ? { link: { title: 'I’m ready to apply', url: '#' }, withAfterIcon: true }
      : undefined);

  return {
    picture,
    heading,
    list,
    programOptions,
    buttonLink,
    fancyLink,
  };
};

export const ProgramPageHeaderStory: Story<ProgramPageHeaderArgs> = {
  name: 'Program Page Header',

  parameters: {
    render: (args) =>
      ProgramPageHeaderPureComponent(defaultProgramPageHeader(args)),
  },

  args: {
    headline: defaultHeadline,
    withPicture: true,
    withList: true,
    programOptionCount: programOptionCountOptions[2],
    withButtonLink: true,
    withFancyLink: true,
  },

  argTypes: {
    programOptionCount: {
      options: programOptionCountOptions,
      control: {
        type: 'inline-radio',
      },
    },
  },
};

type ProgramPageHeaderArgs = Partial<ProgramPageHeaderTwigContext> & {
  headline?: string;
  withPicture?: boolean;
  withList?: boolean;
  programOptionCount?: (typeof programOptionCountOptions)[number];
  withButtonLink?: boolean;
  withFancyLink?: boolean;
};

export const ProgramPageHeader = makeComponentInjector({
  pureComponent: ProgramPageHeaderPureComponent,
  storyRenderFn: ProgramPageHeaderStory.parameters.render,
  defaultArgs: ProgramPageHeaderStory.args,
});
