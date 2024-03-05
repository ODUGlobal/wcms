import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import OverlappingFeatureTemplate from './OverlappingFeature.twig';
import {
  Picture,
  defaultPicture,
} from '@components/Atom/Media/Picture/Picture.stories';
import {
  Heading,
  HeadingTwigContext,
  defaultHeading,
} from '@components/Atom/Heading/Heading.stories';
import { EditorialTwigContext } from '../Editorial/Editorial.stories';
import {
  defaultFancyLinks,
  FancyLinkListTwigContext,
} from '@components/Molecule/LinkList/FancyLinkList/FancyLinkList.stories';
import {
  ButtonLinkListTwigContext,
  defaultButtonLinkList,
} from '@components/Molecule/LinkList/ButtonLinkList/ButtonLinkList.stories';
import Theme from '@components/_ts-helpers/theme';
import { Video } from '@components/Atom/Media/Video/Video.stories';

const outerThemeOptions = [null, Theme.Default, Theme.Neutral50] as const;
const themeOptions = [
  null,
  Theme.MidBlue500,
  Theme.Navy500,
  Theme.Neutral900,
  Theme.LightBlue500,
  Theme.Gold300,
] as const;

const OverlappingFeaturePureComponent = (
  twigContext: OverlappingFeatureTwigContext
) => OverlappingFeatureTemplate(twigContext);

export type OverlappingFeatureTwigContext = {
  /**
   * Picture or video is required for this component.
   * Something like 3:2 aspect-ratio for the image.
   * Image should be at least 976px wide.
   * Note that if there's a `theme`, then the image will get cropped as needed
   * by the CSS to fit the space (but only at the `xl` breakpoint and above).
   */
  media: InjectedComponent<typeof Picture | typeof Video>;
  heading?: HeadingTwigContext;
  editorial?: EditorialTwigContext;
  fancyLinkList?: FancyLinkListTwigContext;
  buttonLinkList?: ButtonLinkListTwigContext;
  flipped?: boolean;
  /** Defaults to `null` */
  outerTheme?: (typeof outerThemeOptions)[number];
  /** Defaults to `null` */
  theme?: (typeof themeOptions)[number];
  id?: string;
  verticalRhythm?: string;
};

const meta: Meta = {
  title: 'Organism/Overlapping Feature',
  excludeStories: ['OverlappingFeature', 'defaultOverlappingFeature'],
};

export default meta;

export const defaultOverlappingFeature = ({
  media,
  video,
  heading,
  headline,
  superhead,
  editorial,
  withEditorial,
  fancyLinkList,
  withFancyLinks,
  buttonLinkList,
  withButtonLinks,
  flipped,
  theme,
  outerTheme,
  id,
  verticalRhythm,
}: OverlappingFeatureArgs): OverlappingFeatureTwigContext => {
  media =
    media ||
    (video
      ? Video({
          ...Video.args,
          picture: Picture({ ...Picture.args, w: 1800, h: 1200 }),
        })
      : Picture({ ...Picture.args, w: 1800, h: 1200 }));

  heading =
    heading ||
    (headline
      ? defaultHeading({ ...Heading.args, headline, superhead })
      : undefined);

  editorial =
    editorial ||
    (withEditorial
      ? {
          wysiwyg: /* html */ `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lacus neque, luctus sit amet erat quis, vestibulum tempor ligula. Etiam varius turpis aliquam purus pharetra tincidunt. In ac odio semper, volutpat metus in, mattis ante. Sed a dignissim urna.</p>`,
        }
      : undefined);

  fancyLinkList =
    fancyLinkList ||
    (withFancyLinks
      ? { fancyLinks: defaultFancyLinks({ arrowPosition: 'after' }) }
      : undefined);

  buttonLinkList =
    buttonLinkList || (withButtonLinks ? defaultButtonLinkList : undefined);

  return {
    media,
    heading,
    editorial,
    fancyLinkList,
    buttonLinkList,
    flipped,
    theme,
    outerTheme,
    id,
    verticalRhythm,
  };
};

export const OverlappingFeatureStory: Story<OverlappingFeatureArgs> = {
  name: 'Overlapping Feature',

  parameters: {
    render: (args) =>
      OverlappingFeaturePureComponent(defaultOverlappingFeature(args)),
  },

  args: {
    theme: themeOptions[0],
    outerTheme: outerThemeOptions[0],
    video: false,
    flipped: false,
    headline: 'Overlapping Feature',
    superhead: 'Optional Superhead',
    withEditorial: true,
    withFancyLinks: true,
    withButtonLinks: true,
  },

  argTypes: {
    theme: {
      options: themeOptions,
      control: {
        type: 'select',
      },
    },
    outerTheme: {
      options: outerThemeOptions,
      control: {
        type: 'select',
      },
    },
  },
};

type OverlappingFeatureArgs = Partial<OverlappingFeatureTwigContext> & {
  video?: boolean;
  headline?: string;
  superhead?: string;
  withEditorial?: boolean;
  withFancyLinks?: boolean;
  withButtonLinks?: boolean;
};

export const OverlappingFeature = makeComponentInjector({
  pureComponent: OverlappingFeaturePureComponent,
  storyRenderFn: OverlappingFeatureStory.parameters.render,
  defaultArgs: OverlappingFeatureStory.args,
});
