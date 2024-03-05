import { StoryFn } from '@storybook/html';

const globalRenderFn: StoryFn = (_, { loaded: { renderedStory } }) =>
  renderedStory as string;

export default globalRenderFn;
