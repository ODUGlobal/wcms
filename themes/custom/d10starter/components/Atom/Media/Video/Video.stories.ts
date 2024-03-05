import { Story, Meta } from '@components/_ts-helpers/types';

import VideoTemplate from './Video.twig';
import {
  Picture,
  PictureTwigContext,
  defaultPicture,
} from '@components/Atom/Media/Picture/Picture.stories';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

const VideoPureComponent = (twigContext: VideoTwigContext) =>
  VideoTemplate(twigContext);

export type VideoTwigContext = {
  /**
   * Full url to YouTube or Vimeo video, in these formats:
   * - `https://vimeo.com/{id}`
   * - `https://www.youtube.com/watch?v={id}`
   */
  url: string;
  picture: InjectedComponent<typeof Picture>;
  title?: string;
};

const DEFAULT_VIDEO = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

const meta: Meta = {
  title: 'Atom/Media/Video',
  excludeStories: ['Video', 'defaultVideo'],
};

export default meta;

export const defaultVideo: VideoTwigContext = {
  picture: Picture(),
  url: DEFAULT_VIDEO,
};

export const VideoStory: Story<VideoArgs> = {
  name: 'Video',

  parameters: {
    render: async ({ picture, url, title }) => {
      picture = picture || Picture();
      url = url || DEFAULT_VIDEO;
      return VideoPureComponent({
        picture,
        url,
        title,
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

type VideoArgs = Partial<VideoTwigContext> & {
  /** for making a Picture if no `picture` is supplied */
  pictureArgs?: typeof Picture.args;
};

export const Video = makeComponentInjector({
  pureComponent: VideoPureComponent,
  storyRenderFn: VideoStory.parameters.render,
  defaultArgs: VideoStory.args,
});
