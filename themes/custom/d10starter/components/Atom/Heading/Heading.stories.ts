import makeComponentInjector from '@components/_ts-helpers/make-component-injector';
import Theme from '@components/_ts-helpers/theme';
import { Story, Meta } from '@components/_ts-helpers/types';

import HeadingTemplate from './Heading.twig';

const hLevels = [1, 2, 3, 4, 5, 6] as const;

// for demo-purposes, all theme-options should be available.
const themeOptions = [null, ...Object.values(Theme)] as const;

const HeadingPureComponent = (twigContext: HeadingTwigContext) =>
  HeadingTemplate(twigContext);

export type HeadingTwigContext = {
  /** Heading title. Can be plain-text or a markup-string. */
  headline: string;
  /**
   * Used for actual tag and also for determining styles (unless a `styleLevel` is provided).
   * Defaults to `2`.
   */
  tagLevel?: (typeof hLevels)[number];
  /** Can be used to style an `h3` like an `h2`, say. */
  styleLevel?: (typeof hLevels)[number];
  /** If `true`, uses `font-sans font-bold` instead of `font-display font-extrabold`. */
  slim?: boolean;
  /** For main headline color. Prefer not to supply (instead let the theme do its thing). */
  colorClasses?: string;
  /** If supplied, will be used in addition to default styling classes. */
  extraClasses?: string;
  /** If supplied, will replace default *sizing* styling classes. */
  sizeClasses?: string;
  /** If supplied, will entirely replace all default styling classes. */
  overrideClasses?: string;
  superhead?: string;
  subhead?: string;
  /** To override default superhead-styles */
  superheadClasses?: string;
  /** To override default subhead-styles */
  subheadClasses?: string;
  /** To override default hgroup-styles (only applies if `superhead` or `subhead` is present). */
  hgroupClasses?: string;
  /** Optional DOM id */
  id?: string;
};

const meta: Meta = {
  title: 'Atom/Heading',
  excludeStories: ['Heading', 'HeadingStory', 'defaultHeading'],
};

export default meta;

export const defaultHeading = ({
  headline,
  superhead,
  subhead,
  tagLevel,
  slim,
}: HeadingArgs): HeadingTwigContext => {
  headline = headline || 'Heading Text';

  return {
    headline,
    superhead,
    subhead,
    tagLevel,
    slim,
  };
};

export const HeadingStory: Story<HeadingArgs> = {
  name: 'Heading',

  parameters: {
    render: ({ headline, superhead, subhead, tagLevel, slim }) => {
      const headingTwigContext = defaultHeading({
        headline,
        superhead,
        subhead,
        tagLevel,
        slim,
      });

      return HeadingPureComponent(headingTwigContext);
    },
  },

  args: {
    headline: 'Heading Text',
    superhead: '',
    subhead: '',
    tagLevel: 2,
    slim: false,
  },
};

type HeadingArgs = Partial<HeadingTwigContext> & {
  foo?: never;
};

export const H1: Story<
  HeadingArgs & {
    /** Only affects story-decorator (just for demo). */
    theme?: (typeof themeOptions)[number];
  }
> = {
  ...HeadingStory,
  name: 'h1',
  args: {
    theme: themeOptions[0],
    ...HeadingStory.args,
    tagLevel: 1,
    superhead: 'Optional Superhead',
    subhead: 'Optional Subhead',
  },
  argTypes: {
    tagLevel: { table: { disable: true } },
    theme: {
      options: themeOptions,
      control: {
        type: 'select',
      },
    },
  },
  decorators: [
    (story, { args }) => /* html */ `
      <div ${(() => (args.theme ? `data-tw-theme="${args.theme}"` : ''))()}>
        <div class="py-10 bg-theme-bg-color">
          <div class="container">
            ${story()}
          </div>
        </div>
      </div>
    `,
  ],
};

export const H2: typeof H1 = {
  ...H1,
  name: 'h2',
  args: { ...H1.args, tagLevel: 2 },
};

export const H3: typeof H1 = {
  ...H1,
  name: 'h3',
  args: { ...H1.args, tagLevel: 3 },
};

export const H4: typeof H1 = {
  ...H1,
  name: 'h4',
  args: { ...H1.args, tagLevel: 4 },
};

export const Heading = makeComponentInjector({
  pureComponent: HeadingPureComponent,
  storyRenderFn: HeadingStory.parameters.render,
  defaultArgs: HeadingStory.args,
});
