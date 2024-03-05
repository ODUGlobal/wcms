import { EditorialTwigContext } from '@components/Organism/Editorial/Editorial.stories';
import {
  Heading,
  HeadingTwigContext,
  defaultHeading,
} from '@components/Atom/Heading/Heading.stories';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';
import { Story, Meta } from '@components/_ts-helpers/types';

import AccordionTemplate from './Accordion.twig';
import {
  LinkCollection,
  LinkCollectionTwigContext,
} from '../LinkCollection/LinkCollection.stories';

const AccordionPureComponent = (twigContext: AccordionTwigContext) =>
  AccordionTemplate(twigContext);

export type AccordionTwigContext = {
  id?: string;
  /** Optional heading above accordion (almost certainly an `h2`). */
  heading?: HeadingTwigContext;
  /** For panel headlines. Defaults to `3` if there's a `heading`, to `2` if not. */
  panelHLevel?: number;
  panels: {
    headline: string;
    editorial?: EditorialTwigContext;
    /** Needed for licensure page. */
    linkCollection?: LinkCollectionTwigContext;
    /**
     * If `true`, panel will be open on load.
     * If also `closeOthersOnOpen` is `true`, then only the
     * first panel with `open: true` will be open on load.
     * Defaults to `false`.
     */
    open?: boolean;
  }[];
  /** If `true`, only one panel can be open at a time. Defaults to `false`. */
  closeOthersOnOpen?: boolean;
  /** To override default vertical-rhythm classes (outermost vertical-margins). */
  verticalRhythm?: string;
};

const meta: Meta = {
  title: 'Organism/Accordion',
  excludeStories: ['Accordion', 'defaultAccordion'],
};

export default meta;

const defaultPanels: AccordionTwigContext['panels'] = [
  {
    headline: 'This is an accordion headline',
    editorial: {
      wysiwyg: /* html */ `
        <p>Lorem ipsum dolor <a href="#">sit amet</a>, consectetur adipiscing elit. Curabitur elementum accumsan faucibus. Maecenas cursus pulvinar risus, tincidunt imperdiet urna hendrerit lobortis. Suspendisse ullamcorper id neque sit amet venenatis. Aenean vitae sodales turpis. Phasellus elit ligula, eleifend ac volutpat vel, ultrices efficitur lectus. Nunc varius, turpis vel vehicula volutpat, elit lorem molestie risus, id lacinia elit augue nec leo. Suspendisse eu felis ac leo varius semper non porttitor tortor. Nullam tincidunt magna vel eros dapibus, nec luctus dolor consectetur. Sed suscipit ac nulla quis finibus. Nunc id ligula dictum, convallis nisi in, feugiat arcu. Suspendisse potenti. Nullam rhoncus, leo at posuere tempus, nunc nisl viverra est, non lacinia turpis mi at turpis. Cras sed eros tempor, ultricies lorem ac, molestie mauris. Vivamus sit amet nisl ac ipsum commodo feugiat.</p>
        <p>Maecenas volutpat in sapien sit amet venenatis. Vivamus dapibus dignissim justo, non hendrerit eros maximus ut. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vivamus lobortis, turpis fermentum vehicula porttitor, erat est pellentesque libero, eu posuere risus eros sed orci. Duis tempus sodales purus, id posuere mauris malesuada lacinia. Etiam vestibulum, nisl ut interdum sodales, urna diam sodales ex, et ornare velit turpis in sapien. Integer placerat pulvinar lacus quis fringilla. Ut bibendum faucibus vehicula. Pellentesque sagittis ipsum sed nulla mollis efficitur. Vivamus accumsan auctor interdum. Vestibulum viverra dui finibus, convallis ex aliquam, interdum magna. Aliquam sagittis vulputate rutrum.</p>
      `,
    },
  },
  {
    headline: 'This is another accordion headline',
    editorial: {
      wysiwyg: /* html */ `
        <p>Proin eu turpis laoreet, luctus augue nec, aliquam sem. Integer euismod tempus enim, id cursus neque ullamcorper quis. Cras lobortis semper lorem. Suspendisse mi enim, semper quis condimentum a, commodo et ligula. Donec mollis imperdiet porttitor. Pellentesque blandit tellus quis leo molestie auctor. Nam bibendum, velit eget fringilla pulvinar, felis nisl ultrices nunc, ut semper urna arcu a mauris. Nam ultrices velit risus, et efficitur ipsum vehicula ut. Quisque semper, felis vitae hendrerit finibus, dolor diam suscipit augue, ac viverra metus quam a massa. Curabitur ultricies tincidunt faucibus. Vestibulum rhoncus consectetur lacinia. Sed cursus urna quam, dignissim tincidunt sem mollis id. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Praesent vehicula venenatis elit, eu tincidunt odio tincidunt volutpat. Proin posuere velit ut nunc cursus sodales.</p>
      `,
    },
  },
  {
    headline:
      'And another. This one is longer so that we can easily see wrapping behavior.',
    editorial: {
      wysiwyg: /* html */ `
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed elementum purus tellus, eu scelerisque ante interdum aliquet. Nunc maximus euismod efficitur. Vivamus ac erat rhoncus, consequat justo in, blandit sapien. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque et commodo mi. Nam semper dapibus purus, non tempus ex convallis dignissim. Aliquam facilisis, enim eget bibendum hendrerit, velit turpis tempor ipsum, sed dictum turpis libero ut mauris. Nam pharetra, arcu vel vehicula tincidunt, ex dolor facilisis massa, ac placerat felis nulla vitae neque. Aenean congue, eros et semper pellentesque, lacus ligula fringilla est, ut auctor ex arcu non elit. Mauris imperdiet massa neque, et rhoncus nunc maximus vel. Suspendisse potenti. Pellentesque fermentum pharetra ex, ac malesuada tellus condimentum a. Vestibulum varius varius purus, vitae eleifend leo bibendum id. Donec ligula mauris, fringilla sit amet nisi et, egestas dapibus tellus. Cras iaculis commodo varius. Morbi cursus pellentesque tortor a tempor.</p>
      `,
    },
  },
  {
    headline: 'This is another accordion headline',
    editorial: {
      wysiwyg: /* html */ `
        <p>Proin eu turpis laoreet, luctus augue nec, aliquam sem. Integer euismod tempus enim, id cursus neque ullamcorper quis. Cras lobortis semper lorem. Suspendisse mi enim, semper quis condimentum a, commodo et ligula. Donec mollis imperdiet porttitor. Pellentesque blandit tellus quis leo molestie auctor. Nam bibendum, velit eget fringilla pulvinar, felis nisl ultrices nunc, ut semper urna arcu a mauris. Nam ultrices velit risus, et efficitur ipsum vehicula ut. Quisque semper, felis vitae hendrerit finibus, dolor diam suscipit augue, ac viverra metus quam a massa. Curabitur ultricies tincidunt faucibus. Vestibulum rhoncus consectetur lacinia. Sed cursus urna quam, dignissim tincidunt sem mollis id. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Praesent vehicula venenatis elit, eu tincidunt odio tincidunt volutpat. Proin posuere velit ut nunc cursus sodales.</p>
      `,
    },
  },
  {
    headline:
      'And another. This one is longer so that we can easily see wrapping behavior.',
    editorial: {
      wysiwyg: /* html */ `
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed elementum purus tellus, eu scelerisque ante interdum aliquet. Nunc maximus euismod efficitur. Vivamus ac erat rhoncus, consequat justo in, blandit sapien. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque et commodo mi. Nam semper dapibus purus, non tempus ex convallis dignissim. Aliquam facilisis, enim eget bibendum hendrerit, velit turpis tempor ipsum, sed dictum turpis libero ut mauris. Nam pharetra, arcu vel vehicula tincidunt, ex dolor facilisis massa, ac placerat felis nulla vitae neque. Aenean congue, eros et semper pellentesque, lacus ligula fringilla est, ut auctor ex arcu non elit. Mauris imperdiet massa neque, et rhoncus nunc maximus vel. Suspendisse potenti. Pellentesque fermentum pharetra ex, ac malesuada tellus condimentum a. Vestibulum varius varius purus, vitae eleifend leo bibendum id. Donec ligula mauris, fringilla sit amet nisi et, egestas dapibus tellus. Cras iaculis commodo varius. Morbi cursus pellentesque tortor a tempor.</p>
      `,
    },
  },
];

export const defaultAccordion = ({
  id,
  heading,
  headline,
  firstIsOpen,
  panels,
  panelHLevel,
  closeOthersOnOpen,
  verticalRhythm,
}: AccordionArgs): AccordionTwigContext => {
  panels =
    panels ||
    (firstIsOpen
      ? defaultPanels.map((panel, i) => ({
          ...panel,
          ...(!i ? { open: true } : {}),
        }))
      : defaultPanels);

  heading =
    heading ||
    (headline ? defaultHeading({ ...Heading.args, headline }) : undefined);

  return {
    id,
    heading,
    panels,
    panelHLevel,
    closeOthersOnOpen,
    verticalRhythm,
  };
};

export const AccordionStory: Story<AccordionArgs> = {
  name: 'Accordion',

  parameters: {
    render: (args) => AccordionPureComponent(defaultAccordion(args)),
  },

  args: {
    headline: 'This is an Accordion',
    firstIsOpen: false,
    closeOthersOnOpen: false,
  },
};

type AccordionArgs = Partial<AccordionTwigContext> & {
  /**
   * Determines whether to make the first panel open on load
   * (if using default `panels` because no `panels` was provided).
   */
  firstIsOpen?: boolean;
  /** Determines headline for optional heading (if no `heading` was provided). */
  headline?: string;
};

export const Accordion = makeComponentInjector({
  pureComponent: AccordionPureComponent,
  storyRenderFn: AccordionStory.parameters.render,
  defaultArgs: AccordionStory.args,
});
