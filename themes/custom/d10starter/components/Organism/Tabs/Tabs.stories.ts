import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import TabsTemplate from './Tabs.twig';
import {
  Heading,
  HeadingTwigContext,
  defaultHeading,
} from '@components/Atom/Heading/Heading.stories';
import { EditorialTwigContext } from '@components/Organism/Editorial/Editorial.stories';

const TabsPureComponent = (twigContext: TabsTwigContext) =>
  TabsTemplate(twigContext);

export type TabsTwigContext = {
  id?: string;
  /** Optional heading above tabs (almost certainly an `h2`). */
  heading?: HeadingTwigContext;
  panels: {
    /**
     * Required `id` for tab-panel. Should be descriptive, probably a hyphenated
     * version of the `title` (like `'graduate-tuition'` for `'Graduate Tuition'`).
     * Of course, must be a valid HTML `id`, and must be unique on the page!!!
     * (This is a good reason not to use Tabs frequently: the onus is on the
     * content-folks to provide descriptive `id`s that are unique to the page.)
     * The reason we require manual/descriptive `id`s (instead of generating
     * them automatically via the JavaScript) is that when JavaScript is disabled,
     * the tabs should be just plain internal links; i.e., the `id`s must be present
     * in the markup before the JS executes. FYI, a direct link to the anchor will
     * open the corresponding panel on page-load.
     */
    id: string;
    /** Used for tab link. */
    title: string;
    /**
     * Optional (but strongly recommended) heading for tab-panel.
     * Should be `h3` if the whole Tabs component comes with an h2 `heading`,
     * otherwise should probably be `h2`. The text should probably
     * match the `title` (which is used for the tab-link).
     */
    heading?: HeadingTwigContext;
    editorial?: EditorialTwigContext;
  }[];
};

const meta: Meta = {
  title: 'Organism/Tabs',
  excludeStories: ['Tabs', 'defaultTabs'],
};

export default meta;

const defaultPanels = (
  { withHeadings, hLevel }: { withHeadings?: boolean; hLevel?: 2 | 3 } = {
    withHeadings: true,
    hLevel: 3,
  }
): TabsTwigContext['panels'] =>
  [
    {
      id: 'foo',
      title: 'Foo',
      editorial: {
        wysiwyg: /* html */ `
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ultricies urna at venenatis gravida. Ut laoreet, sapien ut convallis mattis, dui lectus sodales nisi, vitae eleifend metus augue id metus. Cras faucibus, urna eget volutpat ultricies, lorem erat condimentum sem, nec molestie enim ex sit amet sem. Maecenas odio mi, pulvinar id nisi sed, placerat faucibus nibh. Quisque euismod, elit quis convallis sagittis, lectus nibh pharetra eros, at blandit ante mauris non mi. Praesent id placerat lorem, nec mattis enim. Nunc efficitur arcu at purus hendrerit, tincidunt pharetra augue gravida. Sed cursus vulputate leo eu placerat. Pellentesque lobortis tortor nec nunc pretium commodo. Integer quis tincidunt ligula. Nullam imperdiet venenatis dui vitae tincidunt. In vulputate accumsan mauris et semper. Nullam non consequat est. Aenean vehicula feugiat semper. Nam vulputate, sapien nec placerat feugiat, nunc leo ultrices erat, eu tempor ligula sapien eget ex. In auctor augue quis arcu pellentesque volutpat.</p>
        <p>Mauris et aliquam eros, ac mollis purus. Proin id luctus lorem. Aliquam interdum massa sit amet arcu sagittis, et vestibulum libero aliquam. Pellentesque vitae convallis diam. Praesent pellentesque, lectus sit amet commodo rutrum, ligula massa convallis dolor, fringilla rhoncus libero elit ornare velit. Donec efficitur ultricies ante, in tristique sapien vulputate vel. Suspendisse elit dolor, aliquet eu faucibus elementum, pharetra ut nisi. Etiam ut feugiat ligula. Nunc nec erat eget ipsum pharetra interdum. Sed consequat erat dolor, eu pretium lorem sollicitudin non. Proin eget quam at dolor commodo rutrum. Aenean interdum mattis nulla ut imperdiet.</p>
      `,
      },
    },
    {
      id: 'bar',
      title: 'Bar',
      editorial: {
        wysiwyg: /* html */ `
        <p>Mauris et aliquam eros, ac mollis purus. Proin id luctus lorem. Aliquam interdum massa sit amet arcu sagittis, et vestibulum libero aliquam. Pellentesque vitae convallis diam. Praesent pellentesque, lectus sit amet commodo rutrum, ligula massa convallis dolor, fringilla rhoncus libero elit ornare velit. Donec efficitur ultricies ante, in tristique sapien vulputate vel. Suspendisse elit dolor, aliquet eu faucibus elementum, pharetra ut nisi. Etiam ut feugiat ligula. Nunc nec erat eget ipsum pharetra interdum. Sed consequat erat dolor, eu pretium lorem sollicitudin non. Proin eget quam at dolor commodo rutrum. Aenean interdum mattis nulla ut imperdiet.</p>
      `,
      },
    },
    {
      id: 'longer-title',
      title: 'This one has a longer title',
      editorial: {
        wysiwyg: /* html */ `
        <p>Suspendisse eros erat, finibus eget vulputate eget, ultrices quis turpis. Nam blandit neque ac suscipit dapibus. Phasellus mollis rutrum ligula quis cursus. Etiam et nibh nulla. Curabitur hendrerit at ipsum ut vestibulum. Vestibulum sagittis erat in nunc cursus venenatis. Duis varius pharetra egestas. Aenean sit amet tellus dictum, bibendum lacus quis, posuere arcu. Praesent iaculis sit amet metus in posuere. Aenean quis odio sit amet odio commodo rhoncus. Nunc ligula justo, hendrerit eget risus ut, egestas rhoncus magna.</p>
      `,
      },
    },
    {
      id: 'another',
      title: 'Another one',
      editorial: {
        wysiwyg: /* html */ `
        <p>Nullam nunc mi, fringilla ac libero quis, mollis ultrices justo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec quis malesuada risus. Aliquam sed purus eros. Ut sollicitudin ultrices risus, non vestibulum dui mollis ac. Donec vulputate ex nibh, cursus bibendum orci convallis in. Pellentesque dictum quam quis neque interdum, non mollis augue rhoncus. Etiam fringilla mi urna. Vestibulum sem turpis, pretium eu facilisis molestie, blandit nec ligula. Praesent ornare tincidunt justo ac condimentum. In placerat, mauris ut viverra vestibulum, lorem ipsum tristique dolor, et pretium ex erat et mauris. Aliquam non magna at ipsum lobortis ultricies ac a lectus. Nunc sollicitudin sapien justo, eget malesuada felis iaculis sed.</p>
      `,
      },
    },
    {
      id: 'and-another',
      title: 'And another one',
      editorial: {
        wysiwyg: /* html */ `
        <p>Howdy!</p>
      `,
      },
    },
    {
      id: 'yet-another',
      title: 'Yet another',
      editorial: {
        wysiwyg: /* html */ `
        <p>Sed imperdiet ipsum sed gravida vehicula. Duis nec augue tempus, mattis ante ut, sagittis orci. Donec vel augue orci. Morbi volutpat eros magna, id tincidunt velit rhoncus eget. Phasellus condimentum euismod risus at ultrices. Nullam a porta dolor. Duis suscipit elit porta, mattis augue vitae, scelerisque ligula. Phasellus nec finibus lectus, ut volutpat metus. Nullam quis dictum tortor, at volutpat neque. Sed tempor ullamcorper ex, ac malesuada mi elementum vel. Nullam eleifend sapien eu varius sodales. Mauris scelerisque auctor elit at lacinia. Maecenas blandit luctus elementum. Phasellus tincidunt egestas neque a pellentesque. Proin cursus ornare varius. Phasellus condimentum tincidunt nibh, ac sollicitudin velit volutpat a.</p>
      `,
      },
    },
    {
      id: 'and-yet-another',
      title: 'And yet another',
      editorial: {
        wysiwyg: /* html */ `
        <p>Not much here. Here is a <a href="#">link</a>.</p>
      `,
      },
    },
  ].map((panel) =>
    withHeadings
      ? {
          ...panel,
          heading: defaultHeading({
            ...Heading.args,
            headline: panel.title,
            tagLevel: hLevel,
          }),
        }
      : panel
  );

export const defaultTabs = ({
  id,
  heading,
  headline,
  panels,
  withPanelHeadings,
}: TabsArgs): TabsTwigContext => {
  heading =
    heading ||
    (headline
      ? defaultHeading({
          ...Heading.args,
          headline,
        })
      : undefined);

  panels =
    panels ||
    defaultPanels({
      withHeadings: withPanelHeadings,
      hLevel: heading ? 3 : 2,
    });

  return {
    id,
    heading,
    panels,
  };
};

export const TabsStory: Story<TabsArgs> = {
  name: 'Tabs',

  parameters: {
    render: (args) => TabsPureComponent(defaultTabs(args)),
  },

  args: {
    headline: 'This is a Tabs component',
    withPanelHeadings: true,
  },
};

type TabsArgs = Partial<TabsTwigContext> & {
  /** Determines headline for optional heading (if no `heading` was provided). */
  headline?: string;
  /** Determines whether to include headings in panels (for default `panels`, in case no `panels` was provided). */
  withPanelHeadings?: boolean;
};

export const Tabs = makeComponentInjector({
  pureComponent: TabsPureComponent,
  storyRenderFn: TabsStory.parameters.render,
  defaultArgs: TabsStory.args,
});
