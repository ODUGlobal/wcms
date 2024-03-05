// Just a demo that uses `FiftyFifty` (not an independent component)

import { Story, Meta } from '@components/_ts-helpers/types';
import { FiftyFiftyStory } from '@components/Organism/FiftyFifty/FiftyFifty.stories';

const meta: Meta = {
  title: 'Organism/Text Plus Aside',
  excludeStories: ['TextPlusAside'],
};

export default meta;

export const TextPlusAsideStory: Story<
  typeof FiftyFiftyStory.args & { flipped?: boolean }
> = {
  ...FiftyFiftyStory,

  parameters: {
    ...FiftyFiftyStory,
    render: ({ flipped }) => {
      const firstHalfType: (typeof FiftyFiftyStory.args)['firstHalfType'] =
        flipped ? 'form' : 'editorial';

      const secondHalfType: (typeof FiftyFiftyStory.args)['secondHalfType'] =
        flipped ? 'editorial' : 'form';

      return FiftyFiftyStory.parameters.render({
        firstHalfType,
        secondHalfType,
      });
    },
  },

  name: 'Text Plus Aside',

  args: {
    ...FiftyFiftyStory.args,
    flipped: false,
  },

  argTypes: {
    ...FiftyFiftyStory.argTypes,
    firstHalfType: { table: { disable: true } },
    secondHalfType: { table: { disable: true } },
  },
};
