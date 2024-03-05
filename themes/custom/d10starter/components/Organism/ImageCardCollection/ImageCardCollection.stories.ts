import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import ImageCardCollectionTemplate from './ImageCardCollection.twig';
import Theme from '@components/_ts-helpers/theme';
import {
  Heading,
  HeadingTwigContext,
  defaultHeading,
} from '@components/Atom/Heading/Heading.stories';
import {
  FancyLinkListTwigContext,
  defaultFancyLinks,
} from '@components/Molecule/LinkList/FancyLinkList/FancyLinkList.stories';
import {
  EditorialTwigContext,
  defaultEditorial,
} from '../Editorial/Editorial.stories';
import { ImageCardTwigContext } from '@components/Molecule/ImageCard/ImageCard.stories';
import itemsFromCount from '@components/_ts-helpers/items-from-count';
import {
  Picture,
  defaultPicture,
} from '@components/Atom/Media/Picture/Picture.stories';

const themeOptions = [
  null,
  Theme.Default,
  Theme.Neutral50,
  Theme.LightBlue100,
] as const;

const ImageCardCollectionPureComponent = (
  twigContext: ImageCardCollectionTwigContext
) => ImageCardCollectionTemplate(twigContext);

export type ImageCardCollectionTwigContext = {
  heading?: HeadingTwigContext;
  fancyLinkList?: FancyLinkListTwigContext;
  editorial?: EditorialTwigContext;
  imageCards: ImageCardTwigContext[];
  /** Defaults to 3 if the collection has a `heading` and 2 otherwise, but override if needed. */
  cardHLevel?: 2 | 3 | 4;
  id?: string;
  verticalRhythm?: string;
  theme?: (typeof themeOptions)[number];
};

const meta: Meta = {
  title: 'Organism/Image Card Collection',
  excludeStories: ['ImageCardCollection', 'defaultImageCardCollection'],
};

export default meta;

const defaultImageCards: ImageCardCollectionTwigContext['imageCards'] = [
  {
    picture: Picture({ ...Picture.args, w: 900, h: 600 }),
    link: { url: '#', title: 'Transfer Students' },
    editorial: {
      wysiwyg: /* html */ `<p>We make it easy to get the most out of your credits, saving you time and money on completing your degree.</p>`,
    },
  },
  {
    picture: Picture({ ...Picture.args, w: 900, h: 600 }),
    link: { url: '#', title: 'Graduate Students' },
    editorial: {
      wysiwyg: /* html */ `<p>If you want to advance or change your career with a graduate degree or certificate, ODUGlobal has you covered.</p>`,
    },
  },
  {
    picture: Picture({ ...Picture.args, w: 900, h: 600 }),
    link: { url: '#', title: 'Military Students' },
    editorial: {
      wysiwyg: /* html */ `<p>For over 35 years, ODU has been providing service members with innovative and accessible education to support their military careers and beyond.</p>`,
    },
  },
  {
    picture: Picture({ ...Picture.args, w: 900, h: 600 }),
    link: { url: '#', title: 'Returning After Time Away' },
    editorial: {
      wysiwyg: /* html */ `<p>Was your path to a Bachelor’s degree interrupted? We can help you get back on track to complete your degree.</p>`,
    },
  },
];

export const defaultImageCardCollection = ({
  heading,
  headline,
  fancyLinkList,
  withFancyLinks,
  editorial,
  withEditorial,
  imageCards,
  cardHLevel,
  itemCount,
  id,
  verticalRhythm,
  theme,
}: ImageCardCollectionArgs): ImageCardCollectionTwigContext => {
  heading =
    heading ||
    (headline ? defaultHeading({ ...Heading.args, headline }) : undefined);

  fancyLinkList =
    fancyLinkList ||
    (withFancyLinks
      ? { fancyLinks: defaultFancyLinks({ arrowPosition: 'after' }) }
      : undefined);

  editorial = editorial || (withEditorial ? defaultEditorial : undefined);

  imageCards = imageCards || itemsFromCount(defaultImageCards, itemCount);

  return {
    heading,
    fancyLinkList,
    editorial,
    imageCards,
    cardHLevel,
    id,
    verticalRhythm,
    theme,
  };
};

export const ImageCardCollectionStory: Story<ImageCardCollectionArgs> = {
  name: 'Image Card Collection',

  parameters: {
    render: (args) =>
      ImageCardCollectionPureComponent(defaultImageCardCollection(args)),
  },

  args: {
    theme: themeOptions[0],
    itemCount: 4,
    headline: 'This Is an Image-Card Collection',
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

type ImageCardCollectionArgs = Partial<ImageCardCollectionTwigContext> & {
  itemCount?: number;
  headline?: string;
  withFancyLinks?: boolean;
  withEditorial?: boolean;
};

export const ImageCardCollection = makeComponentInjector({
  pureComponent: ImageCardCollectionPureComponent,
  storyRenderFn: ImageCardCollectionStory.parameters.render,
  defaultArgs: ImageCardCollectionStory.args,
});
