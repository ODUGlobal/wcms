import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import BillboardTemplate from './Billboard.twig';
import { HeadingTwigContext } from '@components/Atom/Heading/Heading.stories';
import {
  EditorialTwigContext,
  defaultEditorial,
} from '../Editorial/Editorial.stories';
import {
  defaultFancyLinks,
  FancyLinkListTwigContext,
} from '@components/Molecule/LinkList/FancyLinkList/FancyLinkList.stories';
import {
  ButtonLinkListTwigContext,
  defaultButtonLinkList,
} from '@components/Molecule/LinkList/ButtonLinkList/ButtonLinkList.stories';
import Theme from '@components/_ts-helpers/theme';

const themeOptions = [Theme.MidBlue500, Theme.Navy500] as const;

const BillboardPureComponent = (twigContext: BillboardTwigContext) =>
  BillboardTemplate(twigContext);

export type BillboardTwigContext = {
  heading?: HeadingTwigContext;
  editorial?: EditorialTwigContext;
  fancyLinkList?: FancyLinkListTwigContext;
  buttonLinkList?: ButtonLinkListTwigContext;
  /** Defaults to `'mid-blue-500'` */
  theme?: (typeof themeOptions)[number];
  id?: string;
  verticalRhythm?: string;
};

const meta: Meta = {
  title: 'Organism/Billboard',
  excludeStories: ['Billboard', 'defaultBillboard'],
};

export default meta;

export const defaultBillboard = ({
  heading,
  headline,
  editorial,
  withEditorial,
  fancyLinkList,
  withFancyLinkList,
  buttonLinkList,
  withButtonLinkList,
  theme,
  id,
  verticalRhythm,
}: BillboardArgs): BillboardTwigContext => {
  heading = headline ? { headline } : undefined;

  editorial = editorial || (withEditorial ? defaultEditorial : undefined);

  fancyLinkList =
    fancyLinkList ||
    (withFancyLinkList
      ? { fancyLinks: defaultFancyLinks({ arrowPosition: 'after' }) }
      : undefined);

  buttonLinkList =
    buttonLinkList || (withButtonLinkList ? defaultButtonLinkList : undefined);

  return {
    heading,
    editorial,
    fancyLinkList,
    buttonLinkList,
    theme,
    id,
    verticalRhythm,
  };
};

export const BillboardStory: Story<BillboardArgs> = {
  name: 'Billboard',

  parameters: {
    render: (args) => BillboardPureComponent(defaultBillboard(args)),
  },

  args: {
    theme: themeOptions[0],
    headline: 'Billboard Headline with Rather Long Text for Testing Purposes',
    withEditorial: true,
    withFancyLinkList: true,
    withButtonLinkList: true,
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

type BillboardArgs = Partial<BillboardTwigContext> & {
  headline?: string;
  withEditorial?: boolean;
  withFancyLinkList?: boolean;
  withButtonLinkList?: boolean;
};

export const Billboard = makeComponentInjector({
  pureComponent: BillboardPureComponent,
  storyRenderFn: BillboardStory.parameters.render,
  defaultArgs: BillboardStory.args,
});
