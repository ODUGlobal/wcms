import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import NewsStoryPageHeaderTemplate from './NewsStoryPageHeader.twig';
import {
  Heading,
  HeadingTwigContext,
  defaultHeading,
} from '@components/Atom/Heading/Heading.stories';
import {
  Figure,
  FigureTwigContext,
  defaultFigure,
} from '@components/Atom/Media/Figure/Figure.stories';
import { Picture } from '@components/Atom/Media/Picture/Picture.stories';

const NewsStoryPageHeaderPureComponent = (
  twigContext: NewsStoryPageHeaderTwigContext
) => NewsStoryPageHeaderTemplate(twigContext);

export type NewsStoryPageHeaderTwigContext = {
  heading: HeadingTwigContext;
  /** Whether picture or video, the image should be at least 768px wide. */
  figure?: InjectedComponent<typeof Figure>;
  verticalRhythm?: string;
  /** If `true`, will get a slightly wider max-width than usual (`max-w-4xl` instead of `max-w-3xl`). */
  wider?: boolean;
};

const injectHelper: {
  [K in keyof Required<NewsStoryPageHeaderTwigContext>]: K;
} = {
  heading: 'heading',
  figure: 'figure',
  verticalRhythm: 'verticalRhythm',
  wider: 'wider',
};

const meta: Meta = {
  title: 'Organism/Page Header/News Story Page Header',
  excludeStories: ['NewsStoryPageHeader'],
};

export default meta;

const defaultHeadline =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit';

export const NewsStoryPageHeaderStory: Story<NewsStoryPageHeaderArgs> = {
  name: 'News Story Page Header',

  parameters: {
    render: ({ heading, headline, withSubhead, figure, withFigure, wider }) => {
      heading =
        heading ||
        defaultHeading({
          ...Heading.args,
          headline: headline || defaultHeadline,
          subhead: withSubhead ? 'March 8, 2023' : undefined,
        });

      figure =
        figure ||
        (withFigure
          ? Figure({
              ...Figure.args,
              picture: Picture({ ...Picture.args, w: 1200, h: 900 }),
            })
          : undefined);

      return NewsStoryPageHeaderPureComponent({ heading, figure, wider });
    },
  },

  args: {
    headline: defaultHeadline,
    withFigure: true,
    withSubhead: true,
    wider: false,
  },
};

type NewsStoryPageHeaderArgs = Partial<NewsStoryPageHeaderTwigContext> & {
  headline?: string;
  withFigure?: boolean;
  withSubhead?: boolean;
};

export const NewsStoryPageHeader = makeComponentInjector({
  twigContextKeys: Object.values(injectHelper),
  pureComponent: NewsStoryPageHeaderPureComponent,
  storyRenderFn: NewsStoryPageHeaderStory.parameters.render,
  defaultArgs: NewsStoryPageHeaderStory.args,
});
