import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import EditorialSlabTemplate from './EditorialSlab.twig';
import {
  Heading,
  HeadingTwigContext,
  defaultHeading,
} from '@components/Atom/Heading/Heading.stories';
import {
  defaultWysiwyg,
  EditorialTwigContext,
} from '../Editorial/Editorial.stories';
import {
  defaultFancyLinks,
  FancyLinkListTwigContext,
} from '@components/Molecule/LinkList/FancyLinkList/FancyLinkList.stories';
import Theme from '@components/_ts-helpers/theme';

const themeOptions = [null, Theme.Default, Theme.Neutral50] as const;

const EditorialSlabPureComponent = (twigContext: EditorialSlabTwigContext) =>
  EditorialSlabTemplate(twigContext);

export type EditorialSlabTwigContext = {
  theme?: (typeof themeOptions)[number];
  id?: string;
  verticalRhythm?: string;
  heading?: HeadingTwigContext;
  fancyLinkList?: FancyLinkListTwigContext;
  editorial: EditorialTwigContext;
  /**
   * By default, the `GenericSlab` wrapper will get `smallContainer: true` to cap
   * the width of the content. Use `noSmallContainer: true` if you don't want this
   * behavior. Might be useful if, say, the `wysiwyg` content of the `editorial`
   * is just a table, and you want the table to be able to stretch wider.
   * (Note: in that case, you'd probably also want to give the `editorial` component
   * the `noMaxWidth: true` option, so that it doesn't have its own capped width).
   */
  noSmallContainer?: boolean;
};

const meta: Meta = {
  title: 'Organism/Editorial Slab',
  excludeStories: ['EditorialSlab', 'defaultEditorialSlab'],
};

export default meta;

const defaultHeadline =
  'Headline for Editorial Slab (Can Be Part of WYSIWYG or Separate)';

export const defaultEditorialSlab = ({
  theme,
  id,
  verticalRhythm,
  heading,
  headline,
  h2InWysiwyg,
  fancyLinkList,
  withFancyLinkList,
  editorial,
  noSmallContainer,
}: EditorialSlabArgs): EditorialSlabTwigContext => {
  heading =
    heading ||
    (headline && !h2InWysiwyg
      ? defaultHeading({ ...Heading.args, headline })
      : undefined);

  fancyLinkList =
    fancyLinkList ||
    (withFancyLinkList
      ? {
          fancyLinks: defaultFancyLinks({ arrowPosition: 'after' }),
        }
      : undefined);

  editorial = editorial || {
    wysiwyg: /* html */ `
      ${headline && h2InWysiwyg ? /* html */ `<h2>${headline}</h2>` : ''}
      ${defaultWysiwyg}
    `,
  };

  return {
    theme,
    id,
    verticalRhythm,
    heading,
    fancyLinkList,
    editorial,
    noSmallContainer,
  };
};

export const EditorialSlabStory: Story<EditorialSlabArgs> = {
  name: 'Editorial Slab',

  parameters: {
    render: (args) => EditorialSlabPureComponent(defaultEditorialSlab(args)),
  },

  args: {
    theme: themeOptions[0],
    headline: defaultHeadline,
    h2InWysiwyg: false,
    withFancyLinkList: false,
  },

  argTypes: {
    theme: {
      options: themeOptions,
      control: {
        type: 'select',
      },
    },
  },
};

type EditorialSlabArgs = Partial<EditorialSlabTwigContext> & {
  headline?: string;
  h2InWysiwyg?: boolean;
  withFancyLinkList?: boolean;
};

export const EditorialSlab = makeComponentInjector({
  pureComponent: EditorialSlabPureComponent,
  storyRenderFn: EditorialSlabStory.parameters.render,
  defaultArgs: EditorialSlabStory.args,
});
