import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import HomeTemplate from './Home.twig';
import { SiteHeader } from '@components/Wrapper/SiteHeader/SiteHeader.stories';
import { SiteFooter } from '@components/Wrapper/SiteFooter/SiteFooter.stories';
import { HomepagePageHeader } from '@components/Organism/PageHeader/HomepagePageHeader/HomepagePageHeader.stories';
import { OverlappingFeature } from '@components/Organism/OverlappingFeature/OverlappingFeature.stories';
import Theme from '@components/_ts-helpers/theme';
import { ImageCardCollection } from '@components/Organism/ImageCardCollection/ImageCardCollection.stories';
import { ExploreProgramsRoutingBlock } from '@components/Organism/ExploreProgramsRoutingBlock/ExploreProgramsRoutingBlock.stories';
import { Form } from '@components/Organism/Form/Form.stories';

const HomePureComponent = (twigContext: HomeTwigContext) =>
  HomeTemplate(twigContext);

type HomeTwigContext = {
  header: InjectedComponent<typeof SiteHeader>;
  footer: InjectedComponent<typeof SiteFooter>;
  pageHeader: InjectedComponent<typeof HomepagePageHeader>;
  exploreProgramsRoutingBlock: InjectedComponent<
    typeof ExploreProgramsRoutingBlock
  >;
  imageCardCollection: InjectedComponent<typeof ImageCardCollection>;
  overlappingFeature: InjectedComponent<typeof OverlappingFeature>;
  form: InjectedComponent<typeof Form>;
};

const meta: Meta = {
  title: 'Page Demo/Home',
  excludeStories: ['Home'],
};

export default meta;

export const HomeStory: Story<HomeArgs> = {
  name: 'Home',

  parameters: {
    render: ({
      withHeroVideo,
      header,
      footer,
      pageHeader,
      exploreProgramsRoutingBlock,
      imageCardCollection,
      overlappingFeature,
      form,
    }) => {
      header = header || SiteHeader();
      footer = footer || SiteFooter();

      pageHeader =
        pageHeader ||
        HomepagePageHeader({
          ...HomepagePageHeader.args,
          withVideo: withHeroVideo,
        });

      exploreProgramsRoutingBlock =
        exploreProgramsRoutingBlock || ExploreProgramsRoutingBlock();

      imageCardCollection =
        imageCardCollection ||
        ImageCardCollection({
          ...ImageCardCollection.args,
          withEditorial: false,
          withFancyLinks: false,
          headline: 'Who Chooses ODU?',
          theme: Theme.LightBlue100,
        });

      overlappingFeature =
        overlappingFeature ||
        OverlappingFeature({
          ...OverlappingFeature.args,
          theme: Theme.MidBlue500,
          headline: 'Online Experience',
          superhead: undefined,
          flipped: true,
          withButtonLinks: false,
          fancyLinkList: {
            fancyLinks: [
              {
                link: { title: 'How You’ll Learn', url: '#' },
                withAfterIcon: true,
              },
              {
                link: { title: 'Coaching & Advising', url: '#' },
                withAfterIcon: true,
              },
            ],
          },
        });

      form =
        form ||
        Form({
          ...Form.args,
          theme: Theme.LightBlue100,
          headline: 'Talk to Us',
          withEditorial: false,
        });

      return HomePureComponent({
        header,
        footer,
        pageHeader,
        exploreProgramsRoutingBlock,
        imageCardCollection,
        overlappingFeature,
        form,
      });
    },
  },

  args: {
    withHeroVideo: true,
  },
};

type HomeArgs = Partial<HomeTwigContext> & {
  withHeroVideo?: boolean;
};

export const Home = makeComponentInjector({
  pureComponent: HomePureComponent,
  storyRenderFn: HomeStory.parameters.render,
  defaultArgs: HomeStory.args,
});
