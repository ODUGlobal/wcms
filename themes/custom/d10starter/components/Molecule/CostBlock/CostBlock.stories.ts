import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import CostBlockTemplate from './CostBlock.twig';

const CostBlockPureComponent = (twigContext: CostBlockTwigContext) =>
  CostBlockTemplate(twigContext);

export type CostBlockTwigContext = {
  studentType: string;
  cost: string;
};

const meta: Meta = {
  title: 'Molecule/Cost Block',
  excludeStories: ['CostBlock', 'CostBlockStory'],
};

export default meta;

export const CostBlockStory: Story<CostBlockArgs> = {
  name: 'Cost Block',

  parameters: {
    render: ({ studentType, cost }) => {
      studentType = studentType || 'In-state Virginia residents';
      cost = cost || '$375 per credit hour';

      return CostBlockPureComponent({ studentType, cost });
    },
  },

  args: {},
};

type CostBlockArgs = Partial<CostBlockTwigContext> & {
  foo?: never;
};

export const CostBlock = makeComponentInjector({
  pureComponent: CostBlockPureComponent,
  storyRenderFn: CostBlockStory.parameters.render,
  defaultArgs: CostBlockStory.args,
});
