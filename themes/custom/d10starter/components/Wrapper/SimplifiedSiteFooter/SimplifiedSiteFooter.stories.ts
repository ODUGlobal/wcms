import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import SimplifiedSiteFooterTemplate from './SimplifiedSiteFooter.twig';

const SimplifiedSiteFooterPureComponent = (
  twigContext: SimplifiedSiteFooterTwigContext
) => SimplifiedSiteFooterTemplate(twigContext);

export type SimplifiedSiteFooterTwigContext = {
  phoneLink: { url: string; title: string };
  privacyPolicyLink: { url: string; title: string };
};

const meta: Meta = {
  title: 'Wrapper/Simplified Site Footer',
  excludeStories: ['SimplifiedSiteFooter'],
};

export default meta;

export const SimplifiedSiteFooterStory: Story<SimplifiedSiteFooterArgs> = {
  name: 'Simplified Site Footer',

  parameters: {
    render: ({ phoneLink, privacyPolicyLink }) => {
      phoneLink = phoneLink || {
        url: 'tel:+01-800-968-2638',
        title: '1-800-968-2638',
      };

      privacyPolicyLink = privacyPolicyLink || {
        url: '#',
        title: 'Privacy Policy',
      };
      return SimplifiedSiteFooterPureComponent({
        phoneLink,
        privacyPolicyLink,
      });
    },
  },

  args: {},
};

type SimplifiedSiteFooterArgs = Partial<SimplifiedSiteFooterTwigContext> & {
  foo?: never;
};

export const SimplifiedSiteFooter = makeComponentInjector({
  pureComponent: SimplifiedSiteFooterPureComponent,
  storyRenderFn: SimplifiedSiteFooterStory.parameters.render,
  defaultArgs: SimplifiedSiteFooterStory.args,
});
