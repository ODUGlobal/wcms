import { Args, Parameters as Params } from '@storybook/html';

export default [
  async ({
    args,
    parameters,
  }: {
    args: Args;
    parameters: Params & { render(args: Args): Promise<string> };
  }) => {
    const renderedStory = await parameters.render(args);
    window.STORYBOOK_RENDERED_STORY = renderedStory; // for script-runner / asset-exporter
    return { renderedStory };
  },
];
