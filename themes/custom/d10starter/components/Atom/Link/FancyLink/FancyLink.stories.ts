import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import FancyLinkTemplate from './FancyLink.twig';
import Theme from '@components/_ts-helpers/theme';

/*
  For demo-purposes, all theme-options should be available.
  At the moment, there are no color "options" -- it's just based on the theme.
*/
const themeOptions = [null, ...Object.values(Theme)] as const;

const FancyLinkPureComponent = (twigContext: FancyLinkTwigContext) =>
  FancyLinkTemplate(twigContext);

export type FancyLinkTwigContext = {
  link: {
    url: string;
    /**
     * Make sure this gets "trimmed," because if a space is accidentally left at the end
     * of this string, the after-icon can get "orphaned" on its own line.
     */
    title: string;
  };
  /** Optional `aria-current` value. */
  ariaCurrent?: 'page' | 'true';
  /**
   * In case there's need for some screen-reader-only text (to go with a custom
   * icon that has some more-than-decorative significance). Placed in parentheses
   * in a `span` after the link's main text.
   */
  srOnlySuffix?: string;
  /** Defaults to fancy-arrow if true (unless a `customBeforeSvgMarkup` or `customBeforeSvgPath` is also provided). */
  withBeforeIcon?: boolean;
  /** Defaults to fancy-arrow if true (unless a `customAfterSvgMarkup` or `customAfterSvgPath` is also provided). */
  withAfterIcon?: boolean;
  /**
   * Requires `withBeforeIcon` to be set to `true`.
   * If provided, must be SVG-markup, preferably with square dimensions.
   * One way or another, needs to be URL-escaped (in Storybook, we do that in the Twig).
   * Mutually exclusive with `customBeforeSvgPath` option.
   */
  customBeforeSvgMarkup?: string;
  /**
   * Requires `withBeforeIcon` to be set to `true`.
   * If provided, must be path to SVG-file (root-relative, absolute, or relative to CSS file).
   * Preferably, SVG-image has square dimensions.
   * Mutually exclusive with `customBeforeSvgMarkup` option.
   */
  customBeforeSvgPath?: string;
  /**
   * Requires `withAfterIcon` to be set to `true`.
   * If provided, must be SVG-markup, preferably with square dimensions.
   * One way or another, needs to be URL-escaped (in Storybook, we do that in the Twig).
   * Mutually exclusive with `customAfterSvgPath` option.
   */
  customAfterSvgMarkup?: string;
  /**
   * Requires `withAfterIcon` to be set to `true`.
   * If provided, must be path to SVG-file (root-relative, absolute, or relative to CSS file).
   * Preferably, SVG-image has square dimensions.
   * Mutually exclusive with `customAfterSvgMarkup` option.
   */
  customAfterSvgPath?: string;
  /** If `true`, the before-icon will not shift on hocus. */
  beforeIconStatic?: boolean;
  /** If `true`, the after-icon will not shift on hocus (it will be "shifted" from the get-go). */
  afterIconStatic?: boolean;
};

const meta: Meta = {
  title: 'Atom/Link/Fancy Link',
  excludeStories: ['FancyLink', 'defaultFancyLink'],
};

export default meta;

const defaultLinkTitle =
  'This is a long link title so that we can easily see wrapping behavior. Salagadoola mechicka boola, bibbidi-bobbidi-boo';

export const defaultFancyLink: FancyLinkTwigContext = {
  withAfterIcon: true,
  link: { url: '#', title: 'This is a fancy link' },
};

export const FancyLinkStory: Story<FancyLinkArgs> = {
  name: 'Fancy Link',

  parameters: {
    render: ({
      link,
      srOnlySuffix,
      title,
      withBeforeIcon,
      withAfterIcon,
      customBeforeSvgMarkup,
      customBeforeSvgPath,
      customAfterSvgMarkup,
      customAfterSvgPath,
      beforeIconStatic,
      afterIconStatic,
    }) => {
      link = link || { url: '#', title: title || defaultLinkTitle };

      return FancyLinkPureComponent({
        link,
        srOnlySuffix,
        withAfterIcon,
        withBeforeIcon,
        customBeforeSvgMarkup,
        customBeforeSvgPath,
        customAfterSvgMarkup,
        customAfterSvgPath,
        beforeIconStatic,
        afterIconStatic,
      });
    },
  },

  args: {
    theme: themeOptions[0],
    title: defaultLinkTitle,
    withBeforeIcon: false,
    withAfterIcon: true,
    beforeIconStatic: false,
    afterIconStatic: false,
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

type FancyLinkArgs = Partial<FancyLinkTwigContext> & {
  /** Determines what link-title to use (if no `link` was passed in). */
  title?: string;
  /** Only affects story-decorator (just for demo). */
  theme?: (typeof themeOptions)[number];
};

export const FancyLink = makeComponentInjector({
  pureComponent: FancyLinkPureComponent,
  storyRenderFn: FancyLinkStory.parameters.render,
  defaultArgs: FancyLinkStory.args,
});
