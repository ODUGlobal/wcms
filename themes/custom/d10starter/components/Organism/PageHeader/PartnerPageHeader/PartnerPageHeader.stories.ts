import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import PartnerPageHeaderTemplate from './PartnerPageHeader.twig';
import { HeadingTwigContext } from '@components/Atom/Heading/Heading.stories';
import { TwingMarkup } from 'twing';
import { FancyLinkTwigContext } from '@components/Atom/Link/FancyLink/FancyLink.stories';

const PartnerPageHeaderPureComponent = (
  twigContext: PartnerPageHeaderTwigContext
) => PartnerPageHeaderTemplate(twigContext);

export type PartnerPageHeaderTwigContext = {
  heading: HeadingTwigContext;
  address?: string;
  /** For heading before email, phone, and/or fancyLink. The "Contact Us" text in the comp. */
  h2Headline?: string;
  emailLink?: { url: string; title: string };
  phoneLink?: { url: string; title: string };
  faxLink?: { url: string; title: string };
  fancyLink?: FancyLinkTwigContext;
  /**
   * In Storybook, will just be a "placeholder" for the map.
   * In Drupal, will be the actual embedded Leaflet / OpenStreetMap map
   * (has special JS and styling needs that for now we won't worry about in Storybook).
   */
  map?: string | TwingMarkup;
};

const meta: Meta = {
  title: 'Organism/Page Header/Partner Page Header',
  excludeStories: ['PartnerPageHeader', 'defaultPartnerPageHeader'],
};

export default meta;

const defaultHeadline = 'The Name of a Partner Goes Here';

export const defaultPartnerPageHeader = ({
  heading,
  headline,
  address,
  withAddress,
  h2Headline,
  withH2,
  emailLink,
  withEmailLink,
  phoneLink,
  withPhoneLink,
  faxLink,
  withFaxLink,
  fancyLink,
  withFancyLink,
  map,
  withMap,
}: PartnerPageHeaderArgs): PartnerPageHeaderTwigContext => {
  heading = heading || { headline: headline || defaultHeadline };

  address =
    address ||
    (withAddress ? '29300 Lankford Highway, Melfa, VA 23410' : undefined);

  h2Headline = h2Headline || (withH2 ? 'Contact Us' : undefined);

  emailLink =
    emailLink ||
    (withEmailLink
      ? {
          url: 'mailto:averylongemailaddresstotestthings@odu.edu',
          title: 'averylongemailaddresstotestthings@odu.edu',
        }
      : undefined);

  phoneLink =
    phoneLink ||
    (withPhoneLink
      ? { url: 'tel:+01-123-456-7890', title: '123-456-7890' }
      : undefined);

  faxLink =
    faxLink ||
    (withFaxLink
      ? { url: 'tel:+01-987-654-3210', title: '987-654-3210' }
      : undefined);

  fancyLink =
    fancyLink ||
    (withFancyLink
      ? {
          link: { title: 'Optional Fancy Link Here', url: '#' },
          withAfterIcon: true,
        }
      : undefined);

  map = map || (withMap ? '[[ map placeholder here ]]' : undefined);

  return {
    heading,
    address,
    h2Headline,
    emailLink,
    phoneLink,
    faxLink,
    fancyLink,
    map,
  };
};

export const PartnerPageHeaderStory: Story<PartnerPageHeaderArgs> = {
  name: 'Partner Page Header',

  parameters: {
    render: (args) =>
      PartnerPageHeaderPureComponent(defaultPartnerPageHeader(args)),
  },

  args: {
    withMap: true,
    headline: defaultHeadline,
    withAddress: true,
    withH2: true,
    withEmailLink: true,
    withPhoneLink: true,
    withFaxLink: true,
    withFancyLink: true,
  },
};

type PartnerPageHeaderArgs = Partial<PartnerPageHeaderTwigContext> & {
  withMap?: boolean;
  headline?: string;
  withAddress?: boolean;
  withH2?: boolean;
  withEmailLink?: boolean;
  withPhoneLink?: boolean;
  withFaxLink?: boolean;
  withFancyLink?: boolean;
};

export const PartnerPageHeader = makeComponentInjector({
  pureComponent: PartnerPageHeaderPureComponent,
  storyRenderFn: PartnerPageHeaderStory.parameters.render,
  defaultArgs: PartnerPageHeaderStory.args,
});
