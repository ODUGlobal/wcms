import { SiteFooter } from '@components/Wrapper/SiteFooter/SiteFooter.stories';
import { SiteHeader } from '@components/Wrapper/SiteHeader/SiteHeader.stories';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';
import { Story, Meta } from '@components/_ts-helpers/types';

import WithConstrainedContentTemplate from './WithConstrainedContent.twig';

const WithConstrainedContentPureComponent = (
  twigContext: WithConstrainedContentTwigContext
) => WithConstrainedContentTemplate(twigContext);

type WithConstrainedContentTwigContext = {
  centered?: boolean;
  header: InjectedComponent<typeof SiteHeader>;
  footer: InjectedComponent<typeof SiteFooter>;
};

const meta: Meta = {
  title: 'Page Template/With Constrained Content',
  excludeStories: ['WithConstrainedContent'],
};

export default meta;

export const WithConstrainedContentStory: Story<WithConstrainedContentArgs> = {
  name: 'With Constrained Content',

  parameters: {
    render: async ({ centered }) => {
      const header = SiteHeader(SiteHeader.args);
      const footer = SiteFooter(SiteFooter.args);
      return WithConstrainedContentPureComponent({
        centered,
        header,
        footer,
      });
    },
  },

  args: {
    centered: false,
  },
};

type WithConstrainedContentArgs = Partial<WithConstrainedContentTwigContext> & {
  foo?: never;
};

export const WithConstrainedContent = makeComponentInjector({
  pureComponent: WithConstrainedContentPureComponent,
  storyRenderFn: WithConstrainedContentStory.parameters.render,
  defaultArgs: WithConstrainedContentStory.args,
});
