import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import CostBlocksTemplate from './CostBlocks.twig';
import itemsFromCount from '@components/_ts-helpers/items-from-count';
import { CostBlock } from '../CostBlock/CostBlock.stories';

const CostBlocksPureComponent = (twigContext: CostBlocksTwigContext) =>
  CostBlocksTemplate(twigContext);

export type CostBlocksTwigContext = {
  items: InjectedComponent<typeof CostBlock>[];
};

const meta: Meta = {
  title: 'Molecule/Cost Blocks',
  excludeStories: ['CostBlocks', 'defaultCostBlocks'],
};

export default meta;

const defaultItems: CostBlocksTwigContext['items'] = [
  {
    studentType: 'In-state Virginia residents',
    cost: '$375 per credit hour*',
  },
  {
    studentType: 'Out-of-state students',
    cost: '$407 per credit hour*',
  },
].map((args: typeof CostBlock.args) => CostBlock(args));

export const defaultCostBlocks = ({
  items,
  itemCount,
}: CostBlocksArgs): CostBlocksTwigContext => {
  items = items || itemsFromCount(defaultItems, itemCount);

  return { items };
};

export const CostBlocksStory: Story<CostBlocksArgs> = {
  name: 'Cost Blocks',

  parameters: {
    render: (args) => CostBlocksPureComponent(defaultCostBlocks(args)),
  },

  args: {
    itemCount: 2,
  },

  decorators: [
    (story) => /* html */ `
        <div class="vertical-rhythm-standard">
          <div class="container">
            <div class="max-w-lg">
              ${story()}
            </div>
          </div>
        </div>
      `,
  ],
};

type CostBlocksArgs = Partial<CostBlocksTwigContext> & {
  itemCount?: number;
};

export const CostBlocks = makeComponentInjector({
  pureComponent: CostBlocksPureComponent,
  storyRenderFn: CostBlocksStory.parameters.render,
  defaultArgs: CostBlocksStory.args,
});
