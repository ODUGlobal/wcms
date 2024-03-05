import { SiteFooter } from '@components/Wrapper/SiteFooter/SiteFooter.stories';
import { SiteHeader } from '@components/Wrapper/SiteHeader/SiteHeader.stories';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';
import { Story, Meta } from '@components/_ts-helpers/types';
import WithSidebarTemplate from './WithSidebar.twig';

const WithSidebarPureComponent = (twigContext: WithSidebarTwigContext) =>
  WithSidebarTemplate(twigContext);

type WithSidebarTwigContext = {
  /** If `true`, sidebar will be on the left on desktop. Default is `false` (sidebar defaults to right side). */
  sidebarLeft?: boolean;
  /** If `true`, sidebar will be on the bottom on mobile. Default is `false` (sidebar defaults to top). */
  sidebarBottom?: boolean;
  header: InjectedComponent<typeof SiteHeader>;
  footer: InjectedComponent<typeof SiteFooter>;
};

const meta: Meta = {
  title: 'Page Template/With Sidebar',
  excludeStories: ['WithSidebar'],
};

export default meta;

export const WithSidebarStory: Story<WithSidebarArgs> = {
  name: 'With Sidebar',

  parameters: {
    render: async ({ sidebarLeft, sidebarBottom }) => {
      const header = SiteHeader(SiteHeader.args);
      const footer = SiteFooter(SiteFooter.args);
      return WithSidebarPureComponent({
        sidebarLeft,
        sidebarBottom,
        header,
        footer,
      });
    },
  },

  args: {
    sidebarLeft: false,
    sidebarBottom: false,
  },

  argTypes: {
    sidebarLeft: {
      name: 'sidebarLeft (for desktop)',
    },
    sidebarBottom: {
      name: 'sidebarBottom (for mobile)',
    },
  },
};

type WithSidebarArgs = Partial<WithSidebarTwigContext> & {
  foo?: never;
};

export const WithSidebar = makeComponentInjector({
  pureComponent: WithSidebarPureComponent,
  storyRenderFn: WithSidebarStory.parameters.render,
  defaultArgs: WithSidebarStory.args,
});
