import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import SiteFooterTemplate from './SiteFooter.twig';
import {
  ButtonLink,
  ButtonLinkTwigContext,
} from '@components/Atom/Link/ButtonLink/ButtonLink.stories';

const socialTitleOptions = [
  'Facebook',
  'Instagram',
  'Twitter',
  'YouTube',
  'TikTok',
  'LinkedIn',
  'Pinterest',
] as const;

const SiteFooterPureComponent = (twigContext: SiteFooterTwigContext) =>
  SiteFooterTemplate(twigContext);

type SiteFooterTwigContext = {
  /** Each entry gets its own line, and first line is bigger and bold ("Old Dominion University"). */
  address: string[];
  mainLinks: { url: string; title: string }[];
  socialLinks: {
    url: string;
    /** For now, must be from this list (see note below about `service` and icons). */
    title: (typeof socialTitleOptions)[number];
    /**
     * Determines icon. For now, must be from this list. If any others are required, will need
     * some additional setup in the Tailwind config (we're using `mask-` utilities defined there).
     */
    service: Lowercase<(typeof socialTitleOptions)[number]>;
  }[];
  phoneLink: { url: string; title: string };
  buttonLink: ButtonLinkTwigContext;
  privacyPolicyLink: { url: string; title: string };
};

const meta: Meta = {
  title: 'Wrapper/Site Footer',
  excludeStories: ['SiteFooter', 'defaultSiteFooter'],
};

export default meta;

export const defaultSiteFooter = ({
  address,
  mainLinks,
  socialLinks,
  phoneLink,
  buttonLink,
  privacyPolicyLink,
}: SiteFooterArgs): SiteFooterTwigContext => {
  address = address || [
    'Old Dominion University',
    'Gornto Hall, Norfolk, VA 23529',
  ];

  mainLinks =
    mainLinks ||
    [
      'About ODUGlobal',
      'Education Partnerships',
      'Employee Development',
      'Recent News',
      'Helpful Resources',
      'Staff Directory',
    ].map((title) => ({ title, url: '#' }));

  socialLinks =
    socialLinks ||
    (['Facebook', 'Twitter', 'YouTube'] as const).map((title) => ({
      title,
      url: '#',
      service: title.toLowerCase() as Lowercase<typeof title>,
    }));

  phoneLink = phoneLink || {
    url: 'tel:+01-800-968-2638',
    title: '1-800-968-2638',
  };

  buttonLink = buttonLink || {
    link: { title: 'Send us an email', url: '#' },
  };

  privacyPolicyLink = privacyPolicyLink || {
    url: '#',
    title: 'Privacy Policy',
  };

  return {
    address,
    mainLinks,
    socialLinks,
    phoneLink,
    buttonLink,
    privacyPolicyLink,
  };
};

export const SiteFooterStory: Story<SiteFooterArgs> = {
  name: 'Site Footer',

  parameters: {
    render: (args) => SiteFooterPureComponent(defaultSiteFooter(args)),
  },

  args: {},
};

type SiteFooterArgs = Partial<SiteFooterTwigContext> & {
  foo?: never;
};

export const SiteFooter = makeComponentInjector({
  pureComponent: SiteFooterPureComponent,
  storyRenderFn: SiteFooterStory.parameters.render,
  defaultArgs: SiteFooterStory.args,
});
