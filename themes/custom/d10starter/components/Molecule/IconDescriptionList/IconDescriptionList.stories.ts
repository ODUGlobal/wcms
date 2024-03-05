import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import IconDescriptionListTemplate from './IconDescriptionList.twig';
import { Picture } from '@components/Atom/Media/Picture/Picture.stories';

const IconDescriptionListPureComponent = (
  twigContext: IconDescriptionListTwigContext
) => IconDescriptionListTemplate(twigContext);

export type IconDescriptionListTwigContext = {
  keyValuePairs: {
    /** The image `src` should be an SVG (preferably w/ square dimensions). */
    picture: InjectedComponent<typeof Picture>;
    key: {
      text: string;
      /**
       * If `true`, the key-text will be visible.
       * (By default, the key-text is visually-hidden, so that the `picture` is the only visible cue).
       * Avoid if possible, especially if the key-text is long (can negatively affect the layout).
       */
      show?: boolean;
    };
    /** The `value` EITHER has a `text` property (string) OR `links` property (array of link-objects). */
    value:
      | {
          text: string;
        }
      | {
          links: { url: string; title: string }[];
        };
  }[];
};

const meta: Meta = {
  title: 'Molecule/Icon Description List',
  excludeStories: ['IconDescriptionList', 'defaultIconDescriptionList'],
};

export default meta;

const defaultKeyValuePairs: IconDescriptionListTwigContext['keyValuePairs'] = [
  {
    picture: Picture({
      ...Picture.args,
      src: `${window.IMAGES}/icons/phone.svg`,
    }),
    key: {
      text: 'Phone',
    },
    value: {
      links: [{ url: 'tel:+01-123-456-7890', title: '123-456-7890' }],
    },
  },
  {
    picture: Picture({
      ...Picture.args,
      src: `${window.IMAGES}/icons/fax.svg`,
    }),
    key: {
      text: 'FAX',
      show: true,
    },
    value: {
      links: [{ url: 'tel:+01-098-765-4321', title: '098-765-4321' }],
    },
  },
  {
    picture: Picture({
      ...Picture.args,
      src: `${window.IMAGES}/icons/envelope.svg`,
    }),
    key: {
      text: 'Email',
    },
    value: {
      links: [
        {
          url: 'mailto:averylongemailaddresstotestthings@odu.edu',
          title: 'averylongemailaddresstotestthings@odu.edu',
        },
      ],
    },
  },
  {
    picture: Picture({
      ...Picture.args,
      src: `${window.IMAGES}/icons/web.svg`,
    }),
    key: {
      text: 'Related links',
    },
    value: {
      links: [
        {
          url: '#',
          title: 'www.mywebsite.edu',
        },
        {
          url: '#',
          title: 'Some other personal or relevant site',
        },
      ],
    },
  },
];

const defaultEventKeyValuePairs: IconDescriptionListTwigContext['keyValuePairs'] =
  [
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
    {
      picture: Picture({
        ...Picture.args,
        src: `${window.IMAGES}/icons/clock.svg`,
      }),
      key: {
        text: 'Time',
        show: true,
      },
      value: {
        text: '9:00am – 4:30pm',
      },
    },
    {
      picture: Picture({
        ...Picture.args,
        src: `${window.IMAGES}/icons/map-pin.svg`,
      }),
      key: {
        text: 'Location',
        show: true,
      },
      value: {
        text: 'Old Dominion University, Gornto Hall, Norfolk, VA 23529',
      },
    },
  ];

export const defaultIconDescriptionList: IconDescriptionListTwigContext = {
  keyValuePairs: defaultKeyValuePairs,
};

export const IconDescriptionListStory: Story<IconDescriptionListArgs> = {
  name: 'Icon Description List',

  parameters: {
    render: ({ keyValuePairs, forEvent }) => {
      keyValuePairs =
        keyValuePairs ||
        (forEvent ? defaultEventKeyValuePairs : defaultKeyValuePairs);
      return IconDescriptionListPureComponent({ keyValuePairs });
    },
  },

  args: {
    forEvent: false,
  },

  decorators: [
    (story) =>
      /* html */ `<div class="vertical-rhythm-standard container">${story()}</div>`,
  ],
};

type IconDescriptionListArgs = Partial<IconDescriptionListTwigContext> & {
  forEvent?: boolean;
};

export const IconDescriptionList = makeComponentInjector({
  pureComponent: IconDescriptionListPureComponent,
  storyRenderFn: IconDescriptionListStory.parameters.render,
  defaultArgs: IconDescriptionListStory.args,
});
