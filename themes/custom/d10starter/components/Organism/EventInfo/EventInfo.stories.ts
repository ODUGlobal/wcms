import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import EventInfoTemplate from './EventInfo.twig';
import { IconDescriptionList } from '@components/Molecule/IconDescriptionList/IconDescriptionList.stories';
import { ButtonLink } from '@components/Atom/Link/ButtonLink/ButtonLink.stories';

const EventInfoPureComponent = (twigContext: EventInfoTwigContext) =>
  EventInfoTemplate(twigContext);

export type EventInfoTwigContext = {
  iconDescriptionList?: InjectedComponent<typeof IconDescriptionList>;
  buttonLink?: InjectedComponent<typeof ButtonLink>;
  id?: string;
  verticalRhythm?: string;
};

const meta: Meta = {
  title: 'Organism/Event Info',
  excludeStories: ['EventInfo'],
};

export default meta;

export const EventInfoStory: Story<EventInfoArgs> = {
  name: 'Event Info',

  parameters: {
    render: ({
      iconDescriptionList,
      withIconDescriptionList,
      buttonLink,
      withButtonLink,
      id,
      verticalRhythm,
    }) => {
      iconDescriptionList =
        iconDescriptionList ||
        (withIconDescriptionList
          ? IconDescriptionList({
              ...IconDescriptionList.args,
              forEvent: true,
            })
          : undefined);

      buttonLink =
        buttonLink ||
        (withButtonLink
          ? ButtonLink({ ...ButtonLink.args, title: 'Register for this Event' })
          : undefined);
      return EventInfoPureComponent({
        iconDescriptionList,
        buttonLink,
        id,
        verticalRhythm,
      });
    },
  },

  args: {
    withIconDescriptionList: true,
    withButtonLink: true,
  },
};

type EventInfoArgs = Partial<EventInfoTwigContext> & {
  withIconDescriptionList?: boolean;
  withButtonLink?: boolean;
};

export const EventInfo = makeComponentInjector({
  pureComponent: EventInfoPureComponent,
  storyRenderFn: EventInfoStory.parameters.render,
  defaultArgs: EventInfoStory.args,
});
