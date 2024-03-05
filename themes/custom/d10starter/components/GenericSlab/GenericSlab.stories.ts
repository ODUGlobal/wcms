import { TwingMarkup } from 'twing';
import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';
import Theme from '@components/_ts-helpers/theme';

import GenericSlabTemplate from './GenericSlab.twig';
import {
  Heading,
  HeadingTwigContext,
} from '@components/Atom/Heading/Heading.stories';
import {
  Editorial,
  EditorialTwigContext,
} from '@components/Organism/Editorial/Editorial.stories';
import {
  FancyLinkList,
  FancyLinkListTwigContext,
} from '@components/Molecule/LinkList/FancyLinkList/FancyLinkList.stories';

const GenericSlabPureComponent = (twigContext: GenericSlabTwigContext) =>
  GenericSlabTemplate(twigContext);

type GenericSlabTwigContext = {
  id?: string;
  /** To override default vertical-rhythm classes (outermost vertical-margins). */
  verticalRhythm?: string;
  /** For a little more vertical space between component and everything above it. */
  bigSpaceY?: boolean;
  smallContainer?: boolean;
  extraSmallContainer?: boolean;
  theme?: Theme;
  backgroundDecoration?: string | TwingMarkup;
  heading?: HeadingTwigContext;
  headingStyleLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  centeredHeading?: boolean;
  /** Will get `inline: true` automatically. */
  fancyLinkList?: FancyLinkListTwigContext;
  centeredFancyLinkList?: boolean;
  editorial?: EditorialTwigContext;
  centeredEditorial?: boolean;
  centeredEditorialText?: boolean;
  component?: string | TwingMarkup;
  centered?: boolean;
};

const meta: Meta = {
  title: 'Organism/Generic Slab',
  excludeStories: /./,
};

export default meta;

export const GenericSlabStory: Story<GenericSlabArgs> = {
  name: 'Generic Slab',

  parameters: {
    render: ({
      id,
      verticalRhythm,
      bigSpaceY,
      smallContainer,
      extraSmallContainer,
      theme,
      backgroundDecoration,
      heading,
      headingStyleLevel,
      centeredHeading,
      fancyLinkList,
      centeredFancyLinkList,
      editorial,
      centeredEditorial,
      centeredEditorialText,
      component,
      centered,
    }) => {
      return GenericSlabPureComponent({
        id,
        verticalRhythm,
        bigSpaceY,
        smallContainer,
        extraSmallContainer,
        theme,
        backgroundDecoration,
        heading,
        headingStyleLevel,
        centeredHeading,
        fancyLinkList,
        centeredFancyLinkList,
        editorial,
        centeredEditorial,
        centeredEditorialText,
        component,
        centered,
      });
    },
  },

  args: {},
};

type GenericSlabArgs = Partial<GenericSlabTwigContext> & {
  foo?: never;
};

export const GenericSlab = makeComponentInjector({
  pureComponent: GenericSlabPureComponent,
  storyRenderFn: GenericSlabStory.parameters.render,
  defaultArgs: GenericSlabStory.args,
});
