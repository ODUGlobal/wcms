import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import SimplePageHeaderTemplate from './SimplePageHeader.twig';
import { HeadingTwigContext } from '@components/Atom/Heading/Heading.stories';
import { EditorialTwigContext } from '@components/Organism/Editorial/Editorial.stories';

const SimplePageHeaderPureComponent = (
  twigContext: SimplePageHeaderTwigContext
) => SimplePageHeaderTemplate(twigContext);

export type SimplePageHeaderTwigContext = {
  heading: HeadingTwigContext;
  editorial?: EditorialTwigContext;
};

const meta: Meta = {
  title: 'Organism/Page Header/Simple Page Header',
  excludeStories: ['SimplePageHeader', 'defaultSimplePageHeader'],
};

export default meta;

const defaultHeadline = 'Simple Page Header with Optional WYSIWYG';

export const defaultSimplePageHeader = ({
  heading,
  headline,
  editorial,
  withEditorial,
}: SimplePageHeaderArgs): SimplePageHeaderTwigContext => {
  heading = heading || { headline: headline || defaultHeadline };

  editorial =
    editorial ||
    (withEditorial
      ? {
          wysiwyg: /* html */ `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lacus neque, luctus sit amet erat quis, vestibulum tempor ligula. Etiam varius turpis aliquam purus pharetra tincidunt. In ac odio semper, volutpat metus in, mattis ante. Sed a dignissim urna.</p>`,
        }
      : undefined);
  return { heading, editorial };
};

export const SimplePageHeaderStory: Story<SimplePageHeaderArgs> = {
  name: 'Simple Page Header',

  parameters: {
    render: (args) =>
      SimplePageHeaderPureComponent(defaultSimplePageHeader(args)),
  },

  args: {
    headline: defaultHeadline,
    withEditorial: true,
  },
};

type SimplePageHeaderArgs = Partial<SimplePageHeaderTwigContext> & {
  headline?: string;
  withEditorial?: boolean;
};

export const SimplePageHeader = makeComponentInjector({
  pureComponent: SimplePageHeaderPureComponent,
  storyRenderFn: SimplePageHeaderStory.parameters.render,
  defaultArgs: SimplePageHeaderStory.args,
});
