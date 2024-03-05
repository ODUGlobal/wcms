import { Story, Meta } from '@components/_ts-helpers/types';

import PictureTemplate from './Picture.twig';
import {
  Image,
  ImageArgs,
  ImageTwigContext,
  defaultImage,
  stockSrc,
} from '@components/Atom/Media/Image/Image.stories';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

const PicturePureComponent = (twigContext: PictureTwigContext) =>
  PictureTemplate(twigContext);

export type PictureTwigContext = {
  image: InjectedComponent<typeof Image>;
  sources: {
    srcsetPath: string;
    otherAttributes: string;
  }[];
};

const meta: Meta = {
  title: 'Atom/Media/Picture',
  excludeStories: ['Picture', 'defaultPicture'],
};

export default meta;

export const defaultPicture = ({
  image,
  src,
  w,
  h,
}: ImageArgs & {
  image?: PictureTwigContext['image'];
} = {}): PictureTwigContext => {
  src = src || stockSrc({ w, h });

  return {
    image: image || Image({ ...Image.args, src, alt: Image.args.alt }),

    sources: [
      {
        srcsetPath: src,
        otherAttributes: 'media="(min-width: 640px)"',
      },
      {
        srcsetPath: src,
        otherAttributes: 'media="(min-width: 768px)"',
      },
    ],
  };
};

export const PictureStory: Story<ImageArgs> = {
  name: 'Picture',

  parameters: {
    render: async (args) => {
      const src = args.src || stockSrc({ w: args.w, h: args.h });

      const image = Image({
        ...Image.args,
        src,
        alt: args.alt || defaultImage.alt,
      });

      // mock srcset data for Picture
      const sources = [
        {
          srcsetPath: src,
          otherAttributes: 'media="(min-width: 640px)"',
        },
        {
          srcsetPath: src,
          otherAttributes: 'media="(min-width: 768px)"',
        },
      ];

      return PicturePureComponent({
        image,
        sources,
      });
    },
  },

  args: {},

  decorators: [
    (story) => /* html */ `
      <div class="container py-10">${story()}</div>
    `,
  ],
};

export const Picture = makeComponentInjector({
  pureComponent: PicturePureComponent,
  storyRenderFn: PictureStory.parameters.render,
  defaultArgs: PictureStory.args,
});
