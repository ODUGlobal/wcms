import makeComponentInjector from '@components/_ts-helpers/make-component-injector';
import { Story, Meta } from '@components/_ts-helpers/types';

import FigureTemplate from './Figure.twig';
import {
  Picture,
  PictureTwigContext,
  defaultPicture,
} from '@components/Atom/Media/Picture/Picture.stories';
import {
  Video,
  VideoTwigContext,
  defaultVideo,
} from '@components/Atom/Media/Video/Video.stories';

const FigurePureComponent = (twigContext: FigureTwigContext) =>
  FigureTemplate(twigContext);

export type FigureTwigContext = {
  /** Mutually exclusive with `video`. */
  picture?: InjectedComponent<typeof Picture>;
  /** Mutually exclusive with `picture`. */
  video?: InjectedComponent<typeof Video>;
  caption?: string;
  credit?: string;
  figureClasses?: string;
};

const meta: Meta = {
  title: 'Atom/Media/Figure',
  excludeStories: ['Figure', 'defaultFigure'],
};

export default meta;

const mediaTypeOptions = ['picture', 'video'] as const;

const defaultCaption =
  'Optional caption for above media. Nullam quis risus eget urna mollis ornare vel eu leo. Nullam id dolor id nibh ultricies vehicula ut id elit.';

const defaultCredit = 'Optional courtesy and credit line.';

export const defaultFigure = (
  type?: (typeof mediaTypeOptions)[number]
): FigureTwigContext => ({
  caption: defaultCaption,
  credit: defaultCredit,
  ...(type === 'video' ? { video: Video() } : { picture: Picture() }),
});

export const FigureStory: Story<FigureArgs> = {
  name: 'Figure',

  parameters: {
    render: async ({
      type,
      picture,
      video,
      caption,
      credit,
      figureClasses,
    }) => {
      if (type === 'video') {
        picture = undefined;
        video = video || Video();
      } else {
        video = undefined;
        picture = picture || Picture();
      }
      return FigurePureComponent({
        picture,
        video,
        caption,
        credit,
        figureClasses,
      });
    },
  },

  args: {
    type: 'picture',
    caption: defaultCaption,
    credit: defaultCredit,
  },

  argTypes: {
    type: {
      options: mediaTypeOptions,
      control: {
        type: 'inline-radio',
      },
    },
  },

  decorators: [
    (story) => /* html */ `
      <div class="container py-10">${story()}</div>
    `,
  ],
};

type FigureArgs = Partial<FigureTwigContext> & {
  /** for determining what kind of `media` to make if no `media` is supplied */
  type?: (typeof mediaTypeOptions)[number];
};

export const Figure = makeComponentInjector({
  pureComponent: FigurePureComponent,
  storyRenderFn: FigureStory.parameters.render,
  defaultArgs: FigureStory.args,
});
