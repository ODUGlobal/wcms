import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import ExploreProgramsRoutingBlockTemplate from './ExploreProgramsRoutingBlock.twig';
import {
  ButtonLink,
  ButtonLinkTwigContext,
} from '@components/Atom/Link/ButtonLink/ButtonLink.stories';
import {
  FancyLink,
  FancyLinkTwigContext,
} from '@components/Atom/Link/FancyLink/FancyLink.stories';
import {
  Heading,
  HeadingTwigContext,
  defaultHeading,
} from '@components/Atom/Heading/Heading.stories';
import {
  Editorial,
  EditorialTwigContext,
} from '../Editorial/Editorial.stories';
import itemsFromCount from '@components/_ts-helpers/items-from-count';

const ExploreProgramsRoutingBlockPureComponent = (
  twigContext: ExploreProgramsRoutingBlockTwigContext
) => ExploreProgramsRoutingBlockTemplate(twigContext);

export type ExploreProgramsRoutingBlockTwigContext = {
  heading?: HeadingTwigContext;
  editorial?: EditorialTwigContext;
  buttonLinks?: ButtonLinkTwigContext[];
  areasOfStudyHeadline?: string;
  areasOfStudyLinks?: { url: string; title: string }[];
  fancyLink?: FancyLinkTwigContext;
  id?: string;
  verticalRhythm?: string;
};

const meta: Meta = {
  title: 'Organism/Explore Programs Routing Block',
  excludeStories: [
    'ExploreProgramsRoutingBlock',
    'defaultExploreProgramsRoutingBlock',
  ],
};

export default meta;

const defaultButtonLinks: ExploreProgramsRoutingBlockTwigContext['buttonLinks'] =
  [
    'Bachelor’s Programs',
    'Master’s Programs',
    'Doctorate & Ed Specialist',
    'Certificates & Endorsements',
  ].map((title) => ({ ...ButtonLink.args, link: { title, url: '#' } }));

export const defaultExploreProgramsRoutingBlock = ({
  heading,
  headline,
  editorial,
  withEditorial,
  buttonLinks,
  buttonLinkCount,
  areasOfStudyLinks,
  areasOfStudyHeadline,
  withDropdown,
  fancyLink,
  withFancyLink,
  id,
  verticalRhythm,
}: ExploreProgramsRoutingBlockArgs): ExploreProgramsRoutingBlockTwigContext => {
  heading =
    heading ||
    (headline ? defaultHeading({ ...Heading.args, headline }) : undefined);

  editorial =
    editorial ||
    (withEditorial
      ? {
          wysiwyg: /* html */ `<p>Online by design - optimized for effective remote learning</p>`,
        }
      : undefined);

  buttonLinks =
    buttonLinks ||
    (Number(buttonLinkCount) > 0
      ? itemsFromCount(defaultButtonLinks, buttonLinkCount)
      : undefined);

  areasOfStudyLinks =
    areasOfStudyLinks ||
    (withDropdown
      ? [
          'Business & Management',
          'Communication & Writing',
          'Computer Science & Math',
          'Education',
          'Engineering',
          'Health Sciences & Nursing',
          'Social Sciences',
          'Military Related',
        ].map((title) => ({ title, url: '#' }))
      : undefined);

  areasOfStudyHeadline = areasOfStudyHeadline || 'Or view by Area of Study';

  fancyLink =
    fancyLink ||
    (withFancyLink
      ? { ...FancyLink.args, link: { title: 'See All Programs A–Z', url: '/academics/programs' } }
      : undefined);

  return {
    heading,
    editorial,
    buttonLinks,
    areasOfStudyLinks,
    areasOfStudyHeadline,
    fancyLink,
    id,
    verticalRhythm,
  };
};

export const ExploreProgramsRoutingBlockStory: Story<ExploreProgramsRoutingBlockArgs> =
  {
    name: 'Explore Programs Routing Block',

    parameters: {
      render: (args) =>
        ExploreProgramsRoutingBlockPureComponent(
          defaultExploreProgramsRoutingBlock(args)
        ),
    },

    args: {
      headline: 'Explore Online Programs',
      withEditorial: true,
      buttonLinkCount: 4,
      withDropdown: true,
      withFancyLink: true,
    },
  };

type ExploreProgramsRoutingBlockArgs =
  Partial<ExploreProgramsRoutingBlockTwigContext> & {
    headline?: string;
    withEditorial?: boolean;
    buttonLinkCount?: number;
    withDropdown?: boolean;
    withFancyLink?: boolean;
  };

export const ExploreProgramsRoutingBlock = makeComponentInjector({
  pureComponent: ExploreProgramsRoutingBlockPureComponent,
  storyRenderFn: ExploreProgramsRoutingBlockStory.parameters.render,
  defaultArgs: ExploreProgramsRoutingBlockStory.args,
});
