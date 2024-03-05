import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import NoImageRoutingBlockTemplate from './NoImageRoutingBlock.twig';
import { Picture } from '@components/Atom/Media/Picture/Picture.stories';
import {
  EditorialTwigContext,
  defaultEditorial,
} from '@components/Organism/Editorial/Editorial.stories';
import {
  defaultFancyLinks,
  FancyLinkListTwigContext,
} from '../LinkList/FancyLinkList/FancyLinkList.stories';
import {
  ButtonLinkListTwigContext,
  defaultButtonLinkList,
} from '../LinkList/ButtonLinkList/ButtonLinkList.stories';
import {
  CostBlocks,
  CostBlocksTwigContext,
  defaultCostBlocks,
} from '../CostBlocks/CostBlocks.stories';

const NoImageRoutingBlockPureComponent = (
  twigContext: NoImageRoutingBlockTwigContext
) => NoImageRoutingBlockTemplate(twigContext);

export type NoImageRoutingBlockTwigContext = {
  headline?: string;
  /**
   * Defaults to 2, but should be 3 instead if it's in a collection of routing-blocks
   * that has its own h2 (but override as needed based on context).
   */
  hLevel?: 2 | 3 | 4;
  superhead?: string;
  subhead?: string;
  /**
   * Optional icon (should have square dimensions, preferably).
   * In a routing-block-collection, either all routing-blocks should have one or all should *not* have one.
   */
  picture?: InjectedComponent<typeof Picture>;
  editorial?: EditorialTwigContext;
  fancyLinkList?: FancyLinkListTwigContext;
  buttonLinkList?: ButtonLinkListTwigContext;
  costBlocks?: CostBlocksTwigContext;
};

const injectHelper: {
  [K in keyof Required<NoImageRoutingBlockTwigContext>]: K;
} = {
  headline: 'headline',
  hLevel: 'hLevel',
  superhead: 'superhead',
  subhead: 'subhead',
  picture: 'picture',
  editorial: 'editorial',
  fancyLinkList: 'fancyLinkList',
  buttonLinkList: 'buttonLinkList',
  costBlocks: 'costBlocks',
};

const meta: Meta = {
  title: 'Molecule/No Image Routing Block',
  excludeStories: [
    'NoImageRoutingBlock',
    'defaultRoutingBlockPicture',
    'defaultNoImageRoutingBlock',
  ],
};

export default meta;

export const defaultRoutingBlockPicture = Picture({
  ...Picture.args,
  src: `${window.IMAGES}/icons/collaborate.svg`,
});

export const defaultNoImageRoutingBlock = ({
  headline,
  hLevel,
  superhead,
  withSuperhead,
  subhead,
  withSubhead,
  picture,
  withIcon,
  editorial,
  withEditorial,
  fancyLinkList,
  withFancyLinks,
  buttonLinkList,
  withButtonLinks,
  costBlocks,
  withCostBlocks,
}: NoImageRoutingBlockArgs): NoImageRoutingBlockTwigContext => {
  superhead = superhead || (withSuperhead ? 'Superhead' : undefined);

  subhead = subhead || (withSubhead ? 'Subhead' : undefined);

  picture = picture || (withIcon ? defaultRoutingBlockPicture : undefined);

  editorial = editorial || (withEditorial ? defaultEditorial : undefined);

  fancyLinkList =
    fancyLinkList ||
    (withFancyLinks
      ? { fancyLinks: defaultFancyLinks({ arrowPosition: 'after' }) }
      : undefined);

  buttonLinkList =
    buttonLinkList || (withButtonLinks ? defaultButtonLinkList : undefined);

  costBlocks =
    costBlocks ||
    (withCostBlocks ? defaultCostBlocks(CostBlocks.args) : undefined);

  return {
    headline,
    hLevel,
    superhead,
    subhead,
    picture,
    editorial,
    fancyLinkList,
    buttonLinkList,
    costBlocks,
  };
};

export const NoImageRoutingBlockStory: Story<NoImageRoutingBlockArgs> = {
  name: 'No Image Routing Block',

  parameters: {
    render: (args) =>
      NoImageRoutingBlockPureComponent(defaultNoImageRoutingBlock(args)),
  },

  args: {
    headline: 'This is the Title of a No Image Routing Block',
    withIcon: true,
    withSuperhead: true,
    withSubhead: true,
    withEditorial: true,
    withFancyLinks: true,
    withButtonLinks: true,
    withCostBlocks: false,
  },

  decorators: [
    (story) => /* html */ `
      <div class="vertical-rhythm-standard">
        <div class="container">
          <div class="max-w-3xl">
            ${story()}
          </div>
        </div>
      </div>
    `,
  ],
};

type NoImageRoutingBlockArgs = Partial<NoImageRoutingBlockTwigContext> & {
  withIcon?: boolean;
  withSuperhead?: boolean;
  withSubhead?: boolean;
  withEditorial?: boolean;
  withFancyLinks?: boolean;
  withButtonLinks?: boolean;
  withCostBlocks?: boolean;
};

export const NoImageRoutingBlock = makeComponentInjector({
  twigContextKeys: Object.values(injectHelper),
  pureComponent: NoImageRoutingBlockPureComponent,
  storyRenderFn: NoImageRoutingBlockStory.parameters.render,
  defaultArgs: NoImageRoutingBlockStory.args,
});
