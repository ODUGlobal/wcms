import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import EventTemplate from './Event.twig';
import { SiteFooter } from '@components/Wrapper/SiteFooter/SiteFooter.stories';
import { SiteHeader } from '@components/Wrapper/SiteHeader/SiteHeader.stories';
import { NewsStoryPageHeaderTwigContext } from '@components/Organism/PageHeader/NewsStoryPageHeader/NewsStoryPageHeader.stories';
import { Figure } from '@components/Atom/Media/Figure/Figure.stories';
import { GenericSlab } from '@components/GenericSlab/GenericSlab.stories';
import { EditorialSlab } from '@components/Organism/EditorialSlab/EditorialSlab.stories';
import { EventInfo } from '@components/Organism/EventInfo/EventInfo.stories';
import { Picture } from '@components/Atom/Media/Picture/Picture.stories';

const EventPureComponent = (twigContext: EventTwigContext) =>
  EventTemplate(twigContext);

export type EventTwigContext = {
  /** So that the `ConstrainedContent.twig` will center the constrained content. */
  centered: true;
  header: InjectedComponent<typeof SiteHeader>;
  footer: InjectedComponent<typeof SiteFooter>;
  pageHeader: NewsStoryPageHeaderTwigContext;
  eventInfo: InjectedComponent<typeof EventInfo>;
  editorialSlab: InjectedComponent<typeof EditorialSlab>;
};

const meta: Meta = {
  title: 'Page Demo/Event',
  excludeStories: ['Event'],
};

export default meta;

export const EventStory: Story<EventArgs> = {
  name: 'Event',

  parameters: {
    render: async ({
      header,
      footer,
      pageHeader,
      eventInfo,
      editorialSlab,
    }) => {
      header =
        header ||
        SiteHeader({
          ...SiteHeader.args,
          currentData: {
            hasCurrentPage: ['Academics'],
          },
          breadcrumbs: ['Home', 'Academics', 'Event Title Goes Here'].map(
            (title) => ({
              title,
              url: '#',
            })
          ),
        });

      footer = footer || SiteFooter();

      pageHeader = pageHeader || {
        heading: { headline: 'Event Title Goes Here' },
        figure: Figure({
          ...Figure.args,
          picture: Picture({ ...Picture.args, w: 1200, h: 900 }),
        }),
        wider: true,
      };

      eventInfo = eventInfo || EventInfo();

      editorialSlab =
        editorialSlab ||
        EditorialSlab({
          ...EditorialSlab.args,
          headline: 'Some WYSIWYG Content Here',
          editorial: {
            wysiwyg: /* html */ `
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget cursus lectus, tempus iaculis odio. Etiam malesuada euismod velit, nec dignissim nisi tincidunt id. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec vitae iaculis velit, a consectetur turpis.</p>
              <p>Duis finibus eleifend urna eget rhoncus. In sollicitudin fermentum dui, quis faucibus dui interdum a. Pellentesque mattis cursus lacinia. Phasellus non mi pellentesque massa sagittis scelerisque. Aliquam vulputate magna lectus, at pretium augue feugiat in. Sed accumsan sed quam in volutpat. Vivamus rutrum est vel lectus pretium tristique.</p>
            `,
          },
        });

      return EventPureComponent({
        centered: true,
        header,
        footer,
        pageHeader,
        eventInfo,
        editorialSlab,
      });
    },
  },

  args: {},
};

type EventArgs = Partial<EventTwigContext> & {
  foo?: never;
};

export const Event = makeComponentInjector({
  pureComponent: EventPureComponent,
  storyRenderFn: EventStory.parameters.render,
  defaultArgs: EventStory.args,
});
