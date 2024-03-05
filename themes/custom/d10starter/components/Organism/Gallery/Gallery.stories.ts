import { Story, Meta } from '@components/_ts-helpers/types';

import GalleryTemplate from './Gallery.twig';
import {
  Picture,
  PictureTwigContext,
  defaultPicture,
} from '@components/Atom/Media/Picture/Picture.stories';
import { stockSrc } from '@components/Atom/Media/Image/Image.stories';
import itemsFromCount from '@components/_ts-helpers/items-from-count';
import {
  Heading,
  HeadingTwigContext,
  defaultHeading,
} from '@components/Atom/Heading/Heading.stories';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';
import {
  defaultFancyLinks,
  FancyLinkListTwigContext,
} from '@components/Molecule/LinkList/FancyLinkList/FancyLinkList.stories';
import {
  Editorial,
  EditorialTwigContext,
  defaultEditorial,
} from '@components/Organism/Editorial/Editorial.stories';
import Theme from '@components/_ts-helpers/theme';

const themeOptions = [null, Theme.Default] as const;

const GalleryPureComponent = (twigContext: GalleryTwigContext) =>
  GalleryTemplate(twigContext);

export type GalleryTwigContext = {
  id?: string;
  theme?: (typeof themeOptions)[number];
  heading?: HeadingTwigContext;
  fancyLinkList?: FancyLinkListTwigContext;
  editorial?: EditorialTwigContext;
  items: {
    /** Should be at least 720px wide. */
    picture: InjectedComponent<typeof Picture>;
    /** Should be same as the `src` attribute of the `img` (in `picture`) */
    src: string;
    caption?: string;
  }[];
  /** To override default vertical-rhythm classes (outermost vertical-margins). */
  verticalRhythm?: string;
};

const meta: Meta = {
  title: 'Organism/Gallery',
  excludeStories: ['Gallery', 'defaultGallery'],
};

export default meta;

const defaultItems: GalleryTwigContext['items'] = [
  { w: 800, h: 450 },
  { w: 450, h: 800 },
  { w: 600, h: 600 },
].map(({ w, h }) => {
  const src = stockSrc({ w, h });
  return {
    picture: Picture({ ...Picture.args, src }),
    src,
    caption:
      'Test caption. Close this modal before switching stories or the modal will be stuck and you will have to reload the page.',
  };
});

export const defaultGallery = ({
  id,
  theme,
  items,
  itemCount,
  heading,
  headline,
  fancyLinkList,
  withFancyLinks,
  editorial,
  withEditorial,
  verticalRhythm,
}: GalleryArgs): GalleryTwigContext => {
  items = items || itemsFromCount(defaultItems, itemCount);

  heading =
    heading ||
    (headline
      ? defaultHeading({
          headline,
        })
      : undefined);

  fancyLinkList =
    fancyLinkList ||
    (withFancyLinks
      ? {
          fancyLinks: defaultFancyLinks({ arrowPosition: 'after' }),
        }
      : undefined);

  editorial = editorial || (withEditorial ? defaultEditorial : undefined);

  return {
    id,
    theme,
    items,
    heading,
    fancyLinkList,
    editorial,
    verticalRhythm,
  };
};

export const GalleryStory: Story<GalleryArgs> = {
  name: 'Gallery',

  parameters: {
    render: async (args) => GalleryPureComponent(defaultGallery(args)),
  },

  args: {
    theme: themeOptions[0],
    itemCount: 7,
    headline: 'Gallery',
    withEditorial: true,
    withFancyLinks: true,
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

type GalleryArgs = Partial<GalleryTwigContext> & {
  /** Determines the number of default teaser-items to use (if no `teasers` is supplied). */
  itemCount?: number;
  /** Determines the content of the `heading` (if no `heading` is supplied). */
  headline?: string;
  withFancyLinks?: boolean;
  withEditorial?: boolean;
};

export const Gallery = makeComponentInjector({
  pureComponent: GalleryPureComponent,
  storyRenderFn: GalleryStory.parameters.render,
  defaultArgs: GalleryStory.args,
});
