import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import FastFactsTemplate from './FastFacts.twig';
import Theme from '@components/_ts-helpers/theme';
import { Picture } from '@components/Atom/Media/Picture/Picture.stories';
import {
  EditorialTwigContext,
  defaultEditorial,
} from '../Editorial/Editorial.stories';
import {
  Heading,
  HeadingTwigContext,
  defaultHeading,
} from '@components/Atom/Heading/Heading.stories';
import {
  FancyLinkListTwigContext,
  defaultFancyLinks,
} from '@components/Molecule/LinkList/FancyLinkList/FancyLinkList.stories';
import itemsFromCount from '@components/_ts-helpers/items-from-count';

const themeOptions = [
  null,
  Theme.Default,
  Theme.Navy500,
  Theme.LightBlue500,
] as const;

const innerThemeOptions = [Theme.Navy700, Theme.LightBlue300] as const;

const FastFactsPureComponent = (twigContext: FastFactsTwigContext) =>
  FastFactsTemplate(twigContext);

export type FastFactsTwigContext = {
  /** Defaults to `null`. */
  theme?: (typeof themeOptions)[number];
  /**
   * Determines theme for individual fact-items, but only if the
   * main `theme` for the whole component is `null` or `'default'`
   * (i.e., white background).
   * Defaults to `'navy-700'`.
   */
  innerTheme?: (typeof innerThemeOptions)[number];
  id?: string;
  verticalRhythm?: string;
  heading?: HeadingTwigContext;
  editorial?: EditorialTwigContext;
  fancyLinkList?: FancyLinkListTwigContext;
  facts: {
    /**
     * Optional decorative icon.
     * Should be square-dimensions if possible (definitely don't use a TALL aspect-ratio).
     */
    picture?: InjectedComponent<typeof Picture>;
    /** Required "number"/stat (very big text, so should be limited to just a few characters!). */
    number: string;
    /** Optional big description text between `number` and optional smaller `editorial`. */
    bigText?: string;
    /** Optional normal-sized copy for longer descriptions. */
    editorial?: EditorialTwigContext;
  }[];
};

const meta: Meta = {
  title: 'Organism/Fast Facts',
  excludeStories: ['FastFacts', 'defaultFastFacts'],
};

export default meta;

const defaultFacts = ({
  theme,
  innerTheme,
}: {
  theme?: FastFactsTwigContext['theme'];
  innerTheme?: FastFactsTwigContext['innerTheme'];
}): FastFactsTwigContext['facts'] => [
  {
    picture: Picture({
      ...Picture.args,
      src: `${window.IMAGES}/icons/fast-fact-1${
        theme === Theme.LightBlue500 ||
        (theme !== Theme.Navy500 && innerTheme === Theme.LightBlue300)
          ? '-alt'
          : ''
      }.svg`,
    }),
    number: '123456+',
    bigText: 'Online Academic Program Offerings',
    editorial: {
      wysiwyg: /* html */ `<p>That is the most of any state school in the Commonwealth of Virginia. Take a look at our Academic Programs to find the right fit for you.</p>`,
    },
  },
  {
    picture: Picture({
      ...Picture.args,
      src: `${window.IMAGES}/icons/fast-fact-1${
        theme === Theme.LightBlue500 ||
        (theme !== Theme.Navy500 && innerTheme === Theme.LightBlue300)
          ? '-alt'
          : ''
      }.svg`,
    }),
    number: 'Ranked #88',
    bigText: 'Online Academic Program Offerings',
    editorial: {
      wysiwyg: /* html */ `<p>That is the most of any state school in the Commonwealth of Virginia. Take a look at our Academic Programs to find the right fit for you.</p>`,
    },
  },
  {
    picture: Picture({
      ...Picture.args,
      src: `${window.IMAGES}/icons/fast-fact-2${
        theme === Theme.LightBlue500 ||
        (theme !== Theme.Navy500 && innerTheme === Theme.LightBlue300)
          ? '-alt'
          : ''
      }.svg`,
    }),
    number: '35+',
    bigText: 'Years of Distance Learning Experience',
    editorial: {
      wysiwyg: /* html */ `<p>Our distance learning expertise predates the internet, starting in the mid-1980s with courses offered on U.S. Navy ships deployed around the globe.</p>`,
    },
  },
  {
    picture: Picture({
      ...Picture.args,
      src: `${window.IMAGES}/icons/fast-fact-3${
        theme === Theme.LightBlue500 ||
        (theme !== Theme.Navy500 && innerTheme === Theme.LightBlue300)
          ? '-alt'
          : ''
      }.svg`,
    }),
    number: '97%',
    bigText: 'Satisfaction Rating from Our Students',
    editorial: {
      wysiwyg: /* html */ `<p>We survey our online students about their experiences with ODU Global to constantly improve our offerings. Read their stories.</p>`,
    },
  },
];

export const defaultFastFacts = ({
  theme,
  innerTheme,
  id,
  verticalRhythm,
  heading,
  headline,
  editorial,
  withEditorial,
  fancyLinkList,
  withFancyLinkList,
  facts,
  itemCount,
}: FastFactsArgs): FastFactsTwigContext => {
  heading =
    heading ||
    (headline ? defaultHeading({ ...Heading.args, headline }) : undefined);

  editorial = editorial || (withEditorial ? defaultEditorial : undefined);

  fancyLinkList =
    fancyLinkList ||
    (withFancyLinkList
      ? { fancyLinks: defaultFancyLinks({ arrowPosition: 'after' }) }
      : undefined);

  facts =
    facts || itemsFromCount(defaultFacts({ theme, innerTheme }), itemCount);

  return {
    theme,
    innerTheme,
    id,
    verticalRhythm,
    heading,
    editorial,
    fancyLinkList,
    facts,
  };
};

export const FastFactsStory: Story<FastFactsArgs> = {
  name: 'Fast Facts',

  parameters: {
    render: (args) => FastFactsPureComponent(defaultFastFacts(args)),
  },

  args: {
    theme: themeOptions[0],
    innerTheme: innerThemeOptions[0],
    itemCount: 5,
    headline: '',
    withEditorial: false,
    withFancyLinkList: false,
  },

  argTypes: {
    theme: {
      options: themeOptions,
      control: {
        type: 'select',
      },
    },
    innerTheme: {
      options: innerThemeOptions,
      control: {
        type: 'select',
      },
      name: 'innerTheme (for individual fact-items; only applicable for null/default `theme`)',
    },
  },
};

type FastFactsArgs = Partial<FastFactsTwigContext> & {
  itemCount?: number;
  headline?: string;
  withEditorial?: boolean;
  withFancyLinkList?: boolean;
};

export const FastFacts = makeComponentInjector({
  pureComponent: FastFactsPureComponent,
  storyRenderFn: FastFactsStory.parameters.render,
  defaultArgs: FastFactsStory.args,
});
