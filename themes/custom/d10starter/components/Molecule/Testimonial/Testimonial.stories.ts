/*
  Note: this piece isn't demoed by itself in Storybook. Instead,
  the `TestimonialSlab` organism is demoed. I abstracted this
  out into its own molecule-component because it needed to be
  available for use in the `Slider` *without* the `GenericSlab`
  wrapper that it gets in the `TestimonialSlab`.
*/

import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import TestimonialTemplate from './Testimonial.twig';
import { Picture } from '@components/Atom/Media/Picture/Picture.stories';
import { themeOptions as testimonialThemeOptions } from '@components/Organism/TestimonialSlab/TestimonialSlab.stories';

const TestimonialPureComponent = (twigContext: TestimonialTwigContext) =>
  TestimonialTemplate(twigContext);

export type TestimonialTwigContext = {
  /**
   * Optional picture, should have square-dimensions (gets rendered as a circle).
   * Minimum width of 96px.
   */
  picture?: InjectedComponent<typeof Picture>;
  /**
   * WYSIWYG markup, but note that everything will get the same font-size here, so avoid h-tags.
   * Probably just stick with p-tags if possible. Lists are okay too.
   */
  quotation: string;
  attributionName?: string;
  attributionDescription?: string;
  /** Should be `true` when the testimonial is a slide in `Slider`. */
  isSlide?: boolean;
  /** Only relevant if `isSlide: true`. */
  theme?: (typeof testimonialThemeOptions)[number];
};

const meta: Meta = {
  title: 'Molecule/Testimonial',
  excludeStories: [
    'Testimonial',
    'defaultQuotation',
    'TestimonialStory',
    'defaultTestimonial',
  ],
};

export default meta;

export const defaultQuotation = /* html */ `
  <p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lacus neque, luctus sit amet erat quis, vestibulum tempor ligula. Etiam varius turpis aliquam purus pharetra tincidunt. In ac odio semper, volutpat metus in, mattis ante. Sed a dignissim urna. Nullam ac sapien magna.</p>
  <p>Use only <code>&lt;p&gt;</code> tags here, please (with <em>italic</em>, <strong>bold</strong>, and <a href="#">links</a> if needed). The quotation marks are <em>not</em> applied automatically.”</p>
`;

export const defaultTestimonial = ({
  picture,
  withPicture,
  quotation,
  attributionName,
  attributionDescription,
  theme,
  isSlide,
}: TestimonialArgs): TestimonialTwigContext => {
  quotation = quotation || defaultQuotation;

  picture =
    picture ||
    (withPicture ? Picture({ ...Picture.args, w: 1200, h: 1200 }) : undefined);

  return {
    picture,
    quotation,
    attributionName,
    attributionDescription,
    theme,
    isSlide,
  };
};

export const TestimonialStory: Story<TestimonialArgs> = {
  name: 'Testimonial',

  parameters: {
    render: (args) => TestimonialPureComponent(defaultTestimonial(args)),
  },

  args: {
    withPicture: true,
    attributionName: 'Dr. William Smith Jr.',
    attributionDescription: 'Professor of Awesome Things',
  },

  decorators: [
    (story) => /* html */ `
    <div class="vertical-rhythm-standard">
      <div class="container">
        <div class="max-w-3xl mx-auto">
          ${story()}
        </div>
      </div>
    </div>
  `,
  ],
};

type TestimonialArgs = Partial<TestimonialTwigContext> & {
  withPicture?: boolean;
};

export const Testimonial = makeComponentInjector({
  pureComponent: TestimonialPureComponent,
  storyRenderFn: TestimonialStory.parameters.render,
  defaultArgs: TestimonialStory.args,
});
