import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import EventsTemplate from './Events.twig';
import { SiteHeader } from '@components/Wrapper/SiteHeader/SiteHeader.stories';
import { SiteFooter } from '@components/Wrapper/SiteFooter/SiteFooter.stories';
import { SimplePageHeader } from '@components/Organism/PageHeader/SimplePageHeader/SimplePageHeader.stories';
import { StackedTeaserCollection } from '@components/Organism/TeaserCollection/StackedTeaserCollection/StackedTeaserCollection.stories';
import { StackedTeaser } from '@components/Molecule/Teaser/StackedTeaser/StackedTeaser.stories';
import { Picture } from '@components/Atom/Media/Picture/Picture.stories';

const EventsPureComponent = (twigContext: EventsTwigContext) =>
  EventsTemplate(twigContext);

export type EventsTwigContext = {
  /** So that the `ConstrainedContent.twig` will center the constrained content. */
  centered: true;
  header: InjectedComponent<typeof SiteHeader>;
  footer: InjectedComponent<typeof SiteFooter>;
  pageHeader: InjectedComponent<typeof SimplePageHeader>;
  stackedTeaserCollection: InjectedComponent<typeof StackedTeaserCollection>;
};

const meta: Meta = {
  title: 'Page Demo/Events',
  excludeStories: ['Events'],
};

export default meta;

export const EventsStory: Story<EventsArgs> = {
  name: 'Events',

  parameters: {
    render: ({ header, footer, pageHeader, stackedTeaserCollection }) => {
      header =
        header ||
        SiteHeader({
          ...SiteHeader.args,
          currentData: {
            hasCurrentPage: ['Academics'],
          },
          breadcrumbs: ['Home', 'Academics', 'Events'].map((title) => ({
            title,
            url: '#',
          })),
        });

      footer = footer || SiteFooter();

      pageHeader =
        pageHeader ||
        SimplePageHeader({
          ...SimplePageHeader.args,
          headline: 'Events',
          withEditorial: false,
        });

      stackedTeaserCollection =
        stackedTeaserCollection ||
        StackedTeaserCollection({
          ...StackedTeaserCollection.args,
          headline: undefined,
          withEditorial: false,
          withFancyLinks: false,
          teasers: Array(5).fill(
            StackedTeaser({
              ...StackedTeaser.args,
              linkTitle: 'Event Title Goes Here',
              withSubhead: false,
              withSuperhead: false,
              withFancyLinks: false,
              withButtonLinks: false,
              withPicture: false,
              iconDescriptionList: {
                keyValuePairs: [
                  {
                    picture: Picture({
                      ...Picture.args,
                      src: `${window.IMAGES}/icons/calendar.svg`,
                    }),
                    key: {
                      text: 'Date',
                      show: true,
                    },
                    value: { text: 'October 18 – November 2, 2023' },
                  },
                ],
              },
              iconDescriptionListFirst: true,
              editorial: {
                wysiwyg: /* html */ `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas at consectetur magna, eget auctor eros. Maecenas mollis metus risus, quis molestie nisi commodo congue.</p>`,
              },
            })
          ),
        });

      return EventsPureComponent({
        centered: true,
        header,
        footer,
        pageHeader,
        stackedTeaserCollection,
      });
    },
  },

  args: {},
};

type EventsArgs = Partial<EventsTwigContext> & {
  foo?: never;
};

export const Events = makeComponentInjector({
  pureComponent: EventsPureComponent,
  storyRenderFn: EventsStory.parameters.render,
  defaultArgs: EventsStory.args,
});
