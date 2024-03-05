import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import SimplifiedSiteHeaderTemplate from './SimplifiedSiteHeader.twig';

const SimplifiedSiteHeaderPureComponent = (
  twigContext: SimplifiedSiteHeaderTwigContext
) => SimplifiedSiteHeaderTemplate(twigContext);

export type SimplifiedSiteHeaderTwigContext = {
  visuallyHiddenSiteTitle: string;
};

const meta: Meta = {
  title: 'Wrapper/Simplified Site Header',
  excludeStories: ['SimplifiedSiteHeader'],
};

export default meta;

export const SimplifiedSiteHeaderStory: Story<SimplifiedSiteHeaderArgs> = {
  name: 'Simplified Site Header',

  parameters: {
    render: ({ visuallyHiddenSiteTitle }) => {
      visuallyHiddenSiteTitle = visuallyHiddenSiteTitle || 'ODU Global';
      return SimplifiedSiteHeaderPureComponent({ visuallyHiddenSiteTitle });
    },
  },

  args: {},
};

type SimplifiedSiteHeaderArgs = Partial<SimplifiedSiteHeaderTwigContext> & {
  foo?: never;
};

export const SimplifiedSiteHeader = makeComponentInjector({
  pureComponent: SimplifiedSiteHeaderPureComponent,
  storyRenderFn: SimplifiedSiteHeaderStory.parameters.render,
  defaultArgs: SimplifiedSiteHeaderStory.args,
});
