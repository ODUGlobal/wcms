import makeComponentInjector from '@components/_ts-helpers/make-component-injector';
import { Story, Meta } from '@components/_ts-helpers/types';

import ImageTemplate from './Image.twig';

const ImagePureComponent = (twigContext: ImageTwigContext) =>
  ImageTemplate(twigContext);

export type ImageTwigContext = {
  src: string;
  alt?: string;
};

const meta: Meta = {
  title: 'Atom/Media/Image',
  excludeStories: ['stockSrc', 'Image', 'defaultImage'],
};

export default meta;

export const stockSrc = ({ w = 800, h = 600 }) =>
  `https://placehold.co/${w}x${h}`;

export const defaultImage: ImageTwigContext = {
  src: stockSrc({}),
  alt: 'Images should have alt text',
};

export const ImageStory: Story<ImageArgs> = {
  name: 'Image',

  parameters: {
    render: ({ src, w, h, alt }) =>
      ImagePureComponent({
        src: src || stockSrc({ w, h }),
        alt,
      }),
  },

  args: {
    src: stockSrc({}),
  },

  decorators: [
    (story) => /* html */ `
      <div class="container py-10">${story()}</div>
    `,
  ],
};

export type ImageArgs = Partial<ImageTwigContext> & {
  /** width for placeholder image (if `src` is not supplied) */
  w?: number;
  /** height for placeholder image (if `src` is not supplied) */
  h?: number;
};

export const Image = makeComponentInjector({
  pureComponent: ImagePureComponent,
  storyRenderFn: ImageStory.parameters.render,
  defaultArgs: ImageStory.args,
});
