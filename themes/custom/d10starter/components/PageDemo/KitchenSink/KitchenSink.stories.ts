import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import KitchenSinkTemplate from './KitchenSink.twig';
import {
  SiteHeader,
  currentPageLevelOptions,
} from '@components/Wrapper/SiteHeader/SiteHeader.stories';
import { SiteFooter } from '@components/Wrapper/SiteFooter/SiteFooter.stories';
import { HeroPageHeader } from '@components/Organism/PageHeader/HeroPageHeader/HeroPageHeader.stories';
import { InPageAlert } from '@components/Organism/InPageAlert/InPageAlert.stories';
import Theme from '@components/_ts-helpers/theme';
import { OverlappingFeature } from '@components/Organism/OverlappingFeature/OverlappingFeature.stories';
import { StandardTeaserCollection } from '@components/Organism/TeaserCollection/StandardTeaserCollection/StandardTeaserCollection.stories';
import { StackedTeaserCollection } from '@components/Organism/TeaserCollection/StackedTeaserCollection/StackedTeaserCollection.stories';
import { CardCollection } from '@components/Organism/CardCollection/CardCollection.stories';
import { NoImageRoutingBlockCollection } from '@components/Organism/NoImageRoutingBlockCollection/NoImageRoutingBlockCollection.stories';
import { FastFacts } from '@components/Organism/FastFacts/FastFacts.stories';
import { Accordion } from '@components/Organism/Accordion/Accordion.stories';
import { EditorialSlab } from '@components/Organism/EditorialSlab/EditorialSlab.stories';
import { TestimonialSlab } from '@components/Organism/TestimonialSlab/TestimonialSlab.stories';
import { Slider } from '@components/Organism/Slider/Slider.stories';
import { MixedTeaserCollection } from '@components/Organism/TeaserCollection/MixedTeaserCollection/MixedTeaserCollection.stories';
import { LinkCollection } from '@components/Organism/LinkCollection/LinkCollection.stories';

const KitchenSinkPureComponent = (twigContext: KitchenSinkTwigContext) =>
  KitchenSinkTemplate(twigContext);

type KitchenSinkTwigContext = {
  header: InjectedComponent<typeof SiteHeader>;
  footer: InjectedComponent<typeof SiteFooter>;
  pageHeader: InjectedComponent<typeof HeroPageHeader>;
  inPageAlerts: InjectedComponent<typeof InPageAlert>[];
  overlappingFeatures: InjectedComponent<typeof OverlappingFeature>[];
  standardTeaserCollections: InjectedComponent<
    typeof StandardTeaserCollection
  >[];
  stackedTeaserCollections: InjectedComponent<typeof StackedTeaserCollection>[];
  mixedTeaserCollections: InjectedComponent<typeof MixedTeaserCollection>[];
  cardCollections: InjectedComponent<typeof CardCollection>[];
  noImageRoutingBlockCollections: InjectedComponent<
    typeof NoImageRoutingBlockCollection
  >[];
  linkCollections: InjectedComponent<typeof LinkCollection>[];
  fastFactses: InjectedComponent<typeof FastFacts>[];
  testimonialSlabs: InjectedComponent<typeof TestimonialSlab>[];
  sliders: InjectedComponent<typeof Slider>[];
  accordion: InjectedComponent<typeof Accordion>;
  editorialSlab: InjectedComponent<typeof EditorialSlab>;
};

const meta: Meta = {
  title: 'Page Demo/Kitchen Sink',
  excludeStories: ['KitchenSink'],
};

export default meta;

export const KitchenSinkStory: Story<KitchenSinkArgs> = {
  name: 'Kitchen Sink',

  parameters: {
    render: ({
      currentPageLevel,
      withHeroVideo,
      header,
      footer,
      pageHeader,
      inPageAlerts,
      overlappingFeatures,
      standardTeaserCollections,
      stackedTeaserCollections,
      mixedTeaserCollections,
      cardCollections,
      noImageRoutingBlockCollections,
      linkCollections,
      fastFactses,
      testimonialSlabs,
      sliders,
      accordion,
      editorialSlab,
    }) => {
      header =
        header ||
        SiteHeader({ ...SiteHeader.args, currentPageLevel: currentPageLevel });
      footer = footer || SiteFooter();

      pageHeader =
        pageHeader ||
        HeroPageHeader({
          ...HeroPageHeader.args,
          withVideo: withHeroVideo,
          headline: (() => {
            // argTypes limits this to 1, 2, or 3.
            switch (currentPageLevel) {
              case 1:
                return 'Academics';
              case 2:
                return `Bachelor's Degree`;
              case 3:
                return 'Accelerated Online Degree Options';
              default:
                return HeroPageHeader.args.headline;
            }
          })(),
        });

      inPageAlerts = inPageAlerts || [
        InPageAlert(),
        InPageAlert({
          ...InPageAlert.args,
          headingIsLink: true,
          iconName: 'info',
          theme: Theme.LightBlue500,
        }),
        InPageAlert({
          ...InPageAlert.args,
          withFancyLink: true,
          withEditorial: false,
          iconName: 'warning',
          theme: Theme.LightTeal300,
        }),
      ];

      overlappingFeatures = overlappingFeatures || [
        OverlappingFeature({
          ...OverlappingFeature.args,
          outerTheme: Theme.Neutral50,
          flipped: true,
        }),
        OverlappingFeature({ ...OverlappingFeature.args, video: true }),
        OverlappingFeature({
          ...OverlappingFeature.args,
          outerTheme: Theme.Neutral50,
          theme: Theme.MidBlue500,
          flipped: true,
        }),
        OverlappingFeature({
          ...OverlappingFeature.args,
          theme: Theme.Navy500,
          video: true,
        }),
        OverlappingFeature({
          ...OverlappingFeature.args,
          outerTheme: Theme.Neutral50,
          theme: Theme.Neutral900,
          flipped: true,
          video: true,
        }),
        OverlappingFeature({
          ...OverlappingFeature.args,
          theme: Theme.LightBlue500,
        }),
        OverlappingFeature({
          ...OverlappingFeature.args,
          outerTheme: Theme.Neutral50,
          theme: Theme.Gold300,
          flipped: true,
        }),
      ];

      standardTeaserCollections = standardTeaserCollections || [
        StandardTeaserCollection({
          ...StandardTeaserCollection.args,
          headline: 'Standard Teaser Collection, 2-up',
          itemCount: 2,
        }),
        StandardTeaserCollection({
          ...StandardTeaserCollection.args,
          headline: 'Standard Teaser Collection, 3-up',
          theme: Theme.MidBlue500,
        }),
        StandardTeaserCollection({
          ...StandardTeaserCollection.args,
          headline: 'Standard Teaser Collection, 4-up, 4 Max Cols',
          theme: Theme.Neutral50,
          itemCount: 4,
          maxCols: 4,
        }),
      ];

      stackedTeaserCollections = stackedTeaserCollections || [
        StackedTeaserCollection(),
        StackedTeaserCollection({
          ...StackedTeaserCollection.args,
          theme: Theme.MidBlue500,
        }),
        StackedTeaserCollection({
          ...StackedTeaserCollection.args,
          theme: Theme.Neutral50,
          headline: 'Stacked Teaser Collection for People/Contact',
          withButtonLinks: false,
          withDescriptions: false,
          withEditorial: false,
          withSuperheads: false,
          withItemFancyLinks: false,
          withFancyLinks: false,
          withIconDescriptionLists: true,
        }),
      ];

      mixedTeaserCollections = mixedTeaserCollections || [
        MixedTeaserCollection(),
        MixedTeaserCollection({
          ...MixedTeaserCollection.args,
          theme: Theme.Neutral50,
        }),
        MixedTeaserCollection({
          ...MixedTeaserCollection.args,
          theme: Theme.MidBlue500,
        }),
      ];

      cardCollections = cardCollections || [
        CardCollection(),
        CardCollection({
          ...CardCollection.args,
          headline: 'Card Collection for People/Contact',
          theme: Theme.Neutral50,
          withIconDescriptionLists: true,
          withSuperheads: false,
          withButtonLinks: false,
          withItemFancyLinks: false,
        }),
      ];

      noImageRoutingBlockCollections = noImageRoutingBlockCollections || [
        NoImageRoutingBlockCollection(),
        NoImageRoutingBlockCollection({
          ...NoImageRoutingBlockCollection.args,
          headline:
            'No Image Routing Blocks with Collection-Level Heading, etc.',
          withEditorial: true,
          withFancyLinks: true,
          theme: Theme.Neutral50,
        }),
        NoImageRoutingBlockCollection({
          ...NoImageRoutingBlockCollection.args,
          headline:
            'No Image Routing Blocks with Collection-Level Heading, etc., 2-Up Layout',
          withEditorial: true,
          withFancyLinks: true,
          theme: Theme.MidBlue500,
          withIcons: false,
          itemCount: 4,
          withColumns: true,
        }),
      ];

      linkCollections = linkCollections || [
        LinkCollection(),
        LinkCollection({
          ...LinkCollection.args,
          theme: Theme.Neutral50,
          itemCount: 2,
        }),
        LinkCollection({ ...LinkCollection.args, itemCount: 4 }),
        LinkCollection({
          ...LinkCollection.args,
          theme: Theme.Neutral50,
          itemCount: 5,
        }),
      ];

      fastFactses = fastFactses || [
        FastFacts(),
        FastFacts({
          ...FastFacts.args,
          innerTheme: Theme.LightBlue300,
          headline: 'Fast Facts with Heading, etc.',
          withEditorial: true,
          withFancyLinkList: true,
          itemCount: 4,
        }),
        FastFacts({ ...FastFacts.args, theme: Theme.Navy500 }),
        FastFacts({ ...FastFacts.args, theme: Theme.LightBlue500 }),
      ];

      testimonialSlabs = testimonialSlabs || [
        TestimonialSlab(),
        TestimonialSlab({
          ...TestimonialSlab.args,
          headline: 'Testimonial Slab with Headline, etc.',
          theme: Theme.Neutral50,
          withPicture: false,
          withEditorial: true,
          withFancyLinks: true,
        }),
        TestimonialSlab({
          ...TestimonialSlab.args,
          headline: 'Testimonial Slab with Headline, etc.',
          theme: Theme.MidBlue500,
          withPicture: false,
          withEditorial: true,
          withFancyLinks: true,
        }),
        TestimonialSlab({
          ...TestimonialSlab.args,
          headline: 'Testimonial Slab with Headline, etc.',
          theme: Theme.Navy500,
          withPicture: false,
          withEditorial: true,
          withFancyLinks: true,
        }),
      ];

      sliders = sliders || [
        Slider(),
        Slider({ ...Slider.args, theme: Theme.Neutral50 }),
        Slider({ ...Slider.args, theme: Theme.MidBlue500 }),
        Slider({ ...Slider.args, theme: Theme.Navy500 }),
      ];

      accordion = accordion || Accordion();

      editorialSlab = editorialSlab || EditorialSlab();

      return KitchenSinkPureComponent({
        header,
        footer,
        pageHeader,
        inPageAlerts,
        overlappingFeatures,
        standardTeaserCollections,
        stackedTeaserCollections,
        mixedTeaserCollections,
        cardCollections,
        noImageRoutingBlockCollections,
        linkCollections,
        fastFactses,
        testimonialSlabs,
        sliders,
        accordion,
        editorialSlab,
      });
    },
  },

  args: {
    currentPageLevel: currentPageLevelOptions[1],
    withHeroVideo: true,
  },

  argTypes: {
    currentPageLevel: {
      options: currentPageLevelOptions.slice(1, 4),
      control: {
        type: 'inline-radio',
      },
    },
  },
};

type KitchenSinkArgs = Partial<KitchenSinkTwigContext> & {
  currentPageLevel?: (typeof currentPageLevelOptions)[number];
  withHeroVideo?: boolean;
};

export const KitchenSink = makeComponentInjector({
  pureComponent: KitchenSinkPureComponent,
  storyRenderFn: KitchenSinkStory.parameters.render,
  defaultArgs: KitchenSinkStory.args,
});
