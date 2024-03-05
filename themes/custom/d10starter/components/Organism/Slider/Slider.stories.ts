import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import SliderTemplate from './Slider.twig';
import Theme from '@components/_ts-helpers/theme';
import {
  Heading,
  HeadingTwigContext,
  defaultHeading,
} from '@components/Atom/Heading/Heading.stories';
import { EditorialTwigContext } from '../Editorial/Editorial.stories';
import {
  Figure,
  FigureTwigContext,
} from '@components/Atom/Media/Figure/Figure.stories';
import {
  Testimonial,
  TestimonialTwigContext,
  defaultTestimonial,
} from '@components/Molecule/Testimonial/Testimonial.stories';
import { themeOptions as testimonialThemeOptions } from '@components/Organism/TestimonialSlab/TestimonialSlab.stories';
import { TwingMarkup } from 'twing';
import {
  FancyLinkListTwigContext,
  defaultFancyLinks,
} from '@components/Molecule/LinkList/FancyLinkList/FancyLinkList.stories';
import {
  Picture,
  defaultPicture,
} from '@components/Atom/Media/Picture/Picture.stories';
import { defaultVideo } from '@components/Atom/Media/Video/Video.stories';

const themeOptions = [
  null,
  Theme.Default,
  Theme.Neutral50,
  Theme.Navy500,
  Theme.MidBlue500,
] as const;

const SliderPureComponent = (twigContext: SliderTwigContext) =>
  SliderTemplate(twigContext);

export type SliderTwigContext = {
  /** Defaults to `null`. */
  theme?: (typeof themeOptions)[number];
  id?: string;
  verticalRhythm?: string;
  heading?: HeadingTwigContext;
  editorial?: EditorialTwigContext;
  fancyLinkList?: FancyLinkListTwigContext;
  /**
   * Can be anything, really, but for now let's just say Testimonial, Figure,
   * or markup-string. Note: it's best if slides don't include any h-tags,
   * because then it gets difficult to make sure all the h-tag levels are correct.
   */
  slides: (
    | InjectedComponent<typeof Figure | typeof Testimonial>
    | string
    | TwingMarkup
  )[];
  /**
   * Optional but encouraged `aria-label` for the slider.
   * The JS gives the slider `aria-label="carousel"` (and a `role="group"`) by default,
   * but it's best to supply a more descriptive `aria-label`, especially if there's more
   * than one slider on the page (though since we're using `role="group"` instead of
   * `role="region"`, it's not an accessibility violation to have multiple carousels
   * with the same label).
   */
  sliderAriaLabel?: string;
};

const meta: Meta = {
  title: 'Organism/Slider',
  excludeStories: ['Slider'],
};

export default meta;

const defaultSlides: SliderTwigContext['slides'] = [
  ...testimonialThemeOptions.map((theme) =>
    Testimonial({
      ...Testimonial.args,
      theme,
      isSlide: true,
    })
  ),
  Figure({
    ...Figure.args,
    picture: Picture({ ...Picture.args, w: 400, h: 800 }),
  }),
  Figure({
    ...Figure.args,
    type: 'video',
  }),
  Figure(),
];

export const SliderStory: Story<SliderArgs> = {
  name: 'Slider',

  parameters: {
    render: ({
      theme,
      id,
      verticalRhythm,
      heading,
      headline,
      fancyLinkList,
      withFancyLinks,
      editorial,
      withEditorial,
      slides,
      sliderAriaLabel,
    }) => {
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
              wysiwyg: /* html */ `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lacus neque, luctus sit amet erat quis, vestibulum tempor ligula. Etiam varius turpis aliquam purus pharetra tincidunt.</p>`,
            }
          : undefined);

      slides = slides || defaultSlides;

      return SliderPureComponent({
        theme,
        id,
        verticalRhythm,
        heading,
        editorial,
        fancyLinkList,
        slides,
        sliderAriaLabel,
      });
    },
  },

  args: {
    theme: themeOptions[0],
    headline: 'Gallery Carousel',
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

type SliderArgs = Partial<SliderTwigContext> & {
  headline?: string;
  withFancyLinks?: boolean;
  withEditorial?: boolean;
};

export const Slider = makeComponentInjector({
  pureComponent: SliderPureComponent,
  storyRenderFn: SliderStory.parameters.render,
  defaultArgs: SliderStory.args,
});
