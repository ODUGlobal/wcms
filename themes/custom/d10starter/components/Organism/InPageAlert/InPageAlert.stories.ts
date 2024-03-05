import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import InPageAlertTemplate from './InPageAlert.twig';
import Theme from '@components/_ts-helpers/theme';
import { HeadingTwigContext } from '@components/Atom/Heading/Heading.stories';
import { EditorialTwigContext } from '../Editorial/Editorial.stories';
import { FancyLinkTwigContext } from '@components/Atom/Link/FancyLink/FancyLink.stories';
import {
  Picture,
  PictureTwigContext,
  defaultPicture,
} from '@components/Atom/Media/Picture/Picture.stories';

/**
 * For demo purposes, some sample icon-names (but actual template
 * requires the icon as an image).
 */
const sampleIconNames = ['alarm', 'info', 'warning'] as const;

const themeOptions = [
  Theme.Yellow500,
  Theme.LightBlue500,
  Theme.LightTeal300,
] as const;

const InPageAlertPureComponent = (twigContext: InPageAlertTwigContext) =>
  InPageAlertTemplate(twigContext);

export type InPageAlertTwigContext = {
  id?: string;
  /** Defaults to `'yellow-500'`. */
  theme?: (typeof themeOptions)[number];
  /** Icon. The image src should be a square SVG. */
  picture: InjectedComponent<typeof Picture>;
  /** Optional. The headline can be plain text or link-markup (an `<a>` tag). */
  heading?: HeadingTwigContext;
  editorial?: EditorialTwigContext;
  fancyLink?: FancyLinkTwigContext;
  /** To override default vertical-rhythm classes (outermost vertical-margins). */
  verticalRhythm?: string;
};

const meta: Meta = {
  title: 'Organism/In Page Alert',
  excludeStories: ['InPageAlert', 'defaultInPageAlert'],
};

export default meta;

export const defaultInPageAlert = ({
  id,
  theme,
  picture,
  iconName,
  heading,
  headline,
  headingIsLink,
  editorial,
  withEditorial,
  fancyLink,
  withFancyLink,
  verticalRhythm,
}: InPageAlertArgs): InPageAlertTwigContext => {
  heading =
    heading ||
    (headline
      ? {
          headline: headingIsLink
            ? /* html */ `<a href="#">${headline}</a>`
            : headline,
        }
      : undefined);

  editorial =
    editorial ||
    (withEditorial
      ? {
          wysiwyg: /* html */ `<p>Predeconstructivist narratives, constructive depatriarchialism, <a href="#">semantic narratives</a>. Donec vitae pretium odio. Sed non ante locus.</p>`,
        }
      : undefined);

  fancyLink =
    fancyLink ||
    (withFancyLink
      ? {
          link: { title: 'Optional fancy link', url: '#' },
          withAfterIcon: true,
        }
      : undefined);

  picture =
    picture ||
    Picture({
      ...Picture.args,
      src: `${window.IMAGES}/icons/alert-${iconName || 'alarm'}.svg`,
    });

  return {
    id,
    theme,
    picture,
    heading,
    editorial,
    fancyLink,
    verticalRhythm,
  };
};

export const InPageAlertStory: Story<InPageAlertArgs> = {
  name: 'In Page Alert',

  parameters: {
    render: (args) => InPageAlertPureComponent(defaultInPageAlert(args)),
  },

  args: {
    theme: themeOptions[0],
    iconName: sampleIconNames[0],
    headline: 'This is a Title for an in-page alert',
    headingIsLink: false,
    withEditorial: true,
    withFancyLink: false,
  },

  argTypes: {
    theme: {
      name: 'theme (choose wisely based on urgency and icon)',
      options: themeOptions,
      control: {
        type: 'select',
      },
    },
    iconName: {
      name: 'iconName (these are just samples; can be any square-SVG on real site)',
      options: sampleIconNames,
      control: {
        type: 'select',
      },
    },
  },
};

type InPageAlertArgs = Partial<InPageAlertTwigContext> & {
  /** If no `picture` is provided, determines which (sample) SVG to use. */
  iconName?: (typeof sampleIconNames)[number];
  headline?: string;
  headingIsLink?: boolean;
  withEditorial?: boolean;
  withFancyLink?: boolean;
};

export const InPageAlert = makeComponentInjector({
  pureComponent: InPageAlertPureComponent,
  storyRenderFn: InPageAlertStory.parameters.render,
  defaultArgs: InPageAlertStory.args,
});
