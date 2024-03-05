import { Story, Meta } from '@components/_ts-helpers/types';

import ThemeDemoTemplate from './ThemeDemo.twig';

import Theme from '@components/_ts-helpers/theme';
import {
  Heading,
  HeadingTwigContext,
  defaultHeading,
} from '@components/Atom/Heading/Heading.stories';
import {
  Editorial,
  EditorialTwigContext,
} from '@components/Organism/Editorial/Editorial.stories';
import { ButtonLink } from '@components/Atom/Link/ButtonLink/ButtonLink.stories';
import { FancyLink } from '@components/Atom/Link/FancyLink/FancyLink.stories';

const ThemeDemoPureComponent = (twigContext: ThemeDemoTwigContext) =>
  ThemeDemoTemplate(twigContext);

type ThemeDemoTwigContext = {
  theme: Theme | null;
  heading: HeadingTwigContext;
  editorial: EditorialTwigContext;
  fancyLink: InjectedComponent<typeof FancyLink>;
  buttonLink: InjectedComponent<typeof ButtonLink>;
  buttonLinkGhost: InjectedComponent<typeof ButtonLink>;
};

const meta: Meta = {
  title: 'Color Scheme (Theme) Demo',
};

export default meta;

const heading = defaultHeading({
  ...Heading.args,
  superhead: 'Superhead',
  subhead: 'Subhead',
});

const buttonLink = ButtonLink({ ...ButtonLink.args, title: 'Button Link' });

const buttonLinkGhost = ButtonLink({
  ...ButtonLink.args,
  title: 'Button Link, "Ghost" Variant',
  ghost: true,
});

const editorial = {
  wysiwyg: /* html */ `
    <p>Some sample WYSIWYG content. Lorem <em>ipsum</em> <strong>dolor</strong> <a href="#">sit amet</a>, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.</p>
    <ul>
      <li>Aliquam tincidunt mauris eu risus. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.</li>
      <li>Vestibulum auctor dapibus neque.</li>
    </ul>
    <ol>
      <li>Aliquam tincidunt mauris eu risus. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.</li>
      <li>Vestibulum auctor dapibus neque.</li>
    </ol>
  `,
};

const fancyLink = FancyLink({ ...FancyLink.args, title: 'Fancy Link' });

export const Default: Story<ThemeDemoTwigContext> = {
  name: '(Default)',
  parameters: { render: ThemeDemoPureComponent },
  args: {
    theme: null,
    heading,
    editorial,
    fancyLink,
    buttonLink,
    buttonLinkGhost,
  },
  argTypes: {
    theme: { table: { disable: true } },
    heading: { table: { disable: true } },
    editorial: { table: { disable: true } },
    fancyLink: { table: { disable: true } },
    buttonLink: { table: { disable: true } },
    buttonLinkGhost: { table: { disable: true } },
  },
};

const makeThemeStory = (theme: Theme): Story<ThemeDemoTwigContext> => ({
  ...Default,
  args: { ...Default.args, theme },
});

// unfortunately, these all have to be done manually, so just try to include all the themes!

export const Neutral50 = makeThemeStory(Theme.Neutral50);
export const MidBlue500 = makeThemeStory(Theme.MidBlue500);
export const Navy500 = makeThemeStory(Theme.Navy500);
export const LightBlue500 = makeThemeStory(Theme.LightBlue500);
export const Gold300 = makeThemeStory(Theme.Gold300);
export const Neutral900 = makeThemeStory(Theme.Neutral900);
export const LightTeal300 = makeThemeStory(Theme.LightTeal300);
export const Yellow500 = makeThemeStory(Theme.Yellow500);
export const Navy700 = makeThemeStory(Theme.Navy700);
export const LightBlue300 = makeThemeStory(Theme.LightBlue300);
export const LightBlue100 = makeThemeStory(Theme.LightBlue100);
