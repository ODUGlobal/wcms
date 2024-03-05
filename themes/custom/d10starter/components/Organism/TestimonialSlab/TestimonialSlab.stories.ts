import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import TestimonialSlabTemplate from './TestimonialSlab.twig';
import Theme from '@components/_ts-helpers/theme';
import {
  Testimonial,
  TestimonialTwigContext,
  defaultTestimonial,
} from '@components/Molecule/Testimonial/Testimonial.stories';
import {
  Heading,
  HeadingTwigContext,
  defaultHeading,
} from '@components/Atom/Heading/Heading.stories';
import {
  Editorial,
  EditorialTwigContext,
} from '../Editorial/Editorial.stories';
import {
  FancyLinkListTwigContext,
  defaultFancyLinks,
} from '@components/Molecule/LinkList/FancyLinkList/FancyLinkList.stories';

export const themeOptions = [
  null,
  Theme.Default,
  Theme.Neutral50,
  Theme.Navy500,
  Theme.MidBlue500,
] as const;

const TestimonialSlabPureComponent = (
  twigContext: TestimonialSlabTwigContext
) => TestimonialSlabTemplate(twigContext);

export type TestimonialSlabTwigContext = {
  heading?: HeadingTwigContext;
  editorial?: EditorialTwigContext;
  fancyLinkList?: FancyLinkListTwigContext;
  testimonial: TestimonialTwigContext;
  /** Defaults to `null`. */
  theme?: (typeof themeOptions)[number];
  id?: string;
  verticalRhythm?: string;
};

const meta: Meta = {
  title: 'Organism/Testimonial Slab',
  excludeStories: ['TestimonialSlab', 'themeOptions', 'defaultTestimonialSlab'],
};

export default meta;

export const defaultTestimonialSlab = ({
  heading,
  headline,
  editorial,
  withEditorial,
  fancyLinkList,
  withFancyLinks,
  testimonial,
  withPicture,
  attributionName,
  attributionDescription,
  theme,
  id,
  verticalRhythm,
}: TestimonialSlabArgs): TestimonialSlabTwigContext => {
  heading =
    heading ||
    (headline ? defaultHeading({ ...Heading.args, headline }) : undefined);

  editorial =
    editorial ||
    (withEditorial
      ? {
          wysiwyg: /* html */ `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lacus neque, luctus sit amet erat quis, vestibulum tempor ligula. Etiam varius turpis aliquam purus pharetra tincidunt. In ac odio semper, volutpat metus in, mattis ante. Sed a dignissim urna.</p>`,
        }
      : undefined);

  fancyLinkList =
    fancyLinkList ||
    (withFancyLinks
      ? { fancyLinks: defaultFancyLinks({ arrowPosition: 'after' }) }
      : undefined);

  testimonial =
    testimonial ||
    defaultTestimonial({
      ...Testimonial.args,
      withPicture,
      attributionName,
      attributionDescription,
    });

  return {
    testimonial,
    theme,
    id,
    verticalRhythm,
    heading,
    fancyLinkList,
    editorial,
  };
};

export const TestimonialSlabStory: Story<TestimonialSlabArgs> = {
  name: 'Testimonial Slab',

  parameters: {
    render: (args) =>
      TestimonialSlabPureComponent(defaultTestimonialSlab(args)),
  },

  args: {
    theme: themeOptions[0],
    headline: '',
    withEditorial: false,
    withFancyLinks: false,
    withPicture: true,
    attributionName: 'Dr. William Smith Jr.',
    attributionDescription: 'Professor of Awesome Things',
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

type TestimonialSlabArgs = Partial<TestimonialSlabTwigContext> & {
  withPicture?: boolean;
  attributionName?: string;
  attributionDescription?: string;
  headline?: string;
  withEditorial?: boolean;
  withFancyLinks?: boolean;
};

export const TestimonialSlab = makeComponentInjector({
  pureComponent: TestimonialSlabPureComponent,
  storyRenderFn: TestimonialSlabStory.parameters.render,
  defaultArgs: TestimonialSlabStory.args,
});
