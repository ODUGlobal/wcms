import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import ImageCardTemplate from './ImageCard.twig';
import {
  Picture,
  PictureTwigContext,
  defaultPicture,
} from '@components/Atom/Media/Picture/Picture.stories';
import {
  EditorialTwigContext,
  defaultEditorial,
} from '@components/Organism/Editorial/Editorial.stories';
import Theme from '@components/_ts-helpers/theme';

const themeOptions = [Theme.Neutral50, Theme.Default] as const;

const ImageCardPureComponent = (twigContext: ImageCardTwigContext) =>
  ImageCardTemplate(twigContext);

export type ImageCardTwigContext = {
  /**
   * Defaults to `'neutral-50'` (b/c collection defaults to no-theme).
   * Note: `null` (no theme) is not an option here.
   */
  theme?: (typeof themeOptions)[number];
  link: { url: string; title: string };
  /** Defaults to 3 (b/c usually it's part of a collection with an h2), but adjust as needed based on context. */
  hLevel?: 2 | 3 | 4 | 5;
  /**
   * Required. Comps have 3:2 aspect-ratio.
   * (All images in a single image-card-collection should have the same aspect-ratio.)
   * Note that the image is hidden on mobile (this was a UX decision that I don't agree with).
   * Minimum width: 720px.
   */
  picture: InjectedComponent<typeof Picture>;
  editorial?: EditorialTwigContext;
};

const meta: Meta = {
  title: 'Molecule/Image Card',
  excludeStories: ['ImageCard'],
};

export default meta;

const defaultLinkTitle = 'This is the Title for an Image Card';

export const ImageCardStory: Story<ImageCardArgs> = {
  name: 'Image Card',

  parameters: {
    render: ({
      theme,
      hLevel,
      picture,
      link,
      linkTitle,
      editorial,
      withEditorial,
    }) => {
      picture = picture || Picture({ ...Picture.args, w: 900, h: 600 });

      link = link || { url: '#', title: linkTitle || defaultLinkTitle };

      editorial = editorial || (withEditorial ? defaultEditorial : undefined);

      return ImageCardPureComponent({
        theme,
        hLevel,
        picture,
        link,
        editorial,
      });
    },
  },

  args: {
    theme: themeOptions[0],
    linkTitle: defaultLinkTitle,
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

  decorators: [
    (story, { args: { theme } }) => /* html */ `
      <div ${
        theme === Theme.Default ? /* html */ `data-tw-theme="neutral-50"` : ''
      }>
        <div class="py-vertical-space bg-theme-bg-color text-theme-text-color">
          <div class="container">
            <div class="max-w-sm">
              ${story()}
            </div>
          </div>
        </div>
      </div>
    `,
  ],
};

type ImageCardArgs = Partial<ImageCardTwigContext> & {
  linkTitle?: string;
  withEditorial?: boolean;
};

export const ImageCard = makeComponentInjector({
  pureComponent: ImageCardPureComponent,
  storyRenderFn: ImageCardStory.parameters.render,
  defaultArgs: ImageCardStory.args,
});
