import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import PartnersLandingTemplate from './PartnersLanding.twig';
import { SiteHeader } from '@components/Wrapper/SiteHeader/SiteHeader.stories';
import { SiteFooter } from '@components/Wrapper/SiteFooter/SiteFooter.stories';
import { SimplePageHeader } from '@components/Organism/PageHeader/SimplePageHeader/SimplePageHeader.stories';
import { OverlappingFeature } from '@components/Organism/OverlappingFeature/OverlappingFeature.stories';
import { EditorialSlab } from '@components/Organism/EditorialSlab/EditorialSlab.stories';
import Theme from '@components/_ts-helpers/theme';
import { ButtonLink } from '@components/Atom/Link/ButtonLink/ButtonLink.stories';
import { Picture } from '@components/Atom/Media/Picture/Picture.stories';
import { NoImageRoutingBlockCollection } from '@components/Organism/NoImageRoutingBlockCollection/NoImageRoutingBlockCollection.stories';
import { PartnerLocationsBlock } from '@components/Organism/PartnerLocationsBlock/PartnerLocationsBlock.stories';
import { NoImageRoutingBlock } from '@components/Molecule/NoImageRoutingBlock/NoImageRoutingBlock.stories';

const PartnersLandingPureComponent = (
  twigContext: PartnersLandingTwigContext
) => PartnersLandingTemplate(twigContext);

type PartnersLandingTwigContext = {
  header: InjectedComponent<typeof SiteHeader>;
  footer: InjectedComponent<typeof SiteFooter>;
  pageHeader: InjectedComponent<typeof SimplePageHeader>;
  overlappingFeature: InjectedComponent<typeof OverlappingFeature>;
  editorialSlab: InjectedComponent<typeof EditorialSlab>;
  partnerLocationsBlock: InjectedComponent<typeof PartnerLocationsBlock>;
  noImageRoutingBlockCollection: InjectedComponent<
    typeof NoImageRoutingBlockCollection
  >;
};

const meta: Meta = {
  title: 'Page Demo/Partners Landing',
  excludeStories: ['PartnersLanding'],
};

export default meta;

export const PartnersLandingStory: Story<PartnersLandingArgs> = {
  name: 'Partners Landing',

  parameters: {
    render: async ({
      header,
      footer,
      pageHeader,
      overlappingFeature,
      editorialSlab,
      partnerLocationsBlock,
      noImageRoutingBlockCollection,
    }) => {
      header =
        header ||
        SiteHeader({
          ...SiteHeader.args,
          currentData: {
            hasCurrentPage: ['Academics', 'Academic Partnerships'],
            isCurrentPage: 'Our 50+ Partners',
          },
        });

      footer = footer || SiteFooter();

      pageHeader =
        pageHeader ||
        SimplePageHeader({
          ...SimplePageHeader.args,
          headline: 'Partners',
          withEditorial: false,
        });

      overlappingFeature =
        overlappingFeature ||
        OverlappingFeature({
          ...OverlappingFeature.args,
          theme: Theme.MidBlue500,
          withFancyLinks: false,
          superhead: undefined,
          headline: 'We Collaborate For Your Success',
          editorial: {
            wysiwyg: /* html */ `<p>We have partnerships with the Virginia Community College System, higher education centers, and military bases across the state of Virginia, plus select institutions in Washington State and Arizona. These locations can provide access to high speed internet, proctoring, and other services for ODUGlobal students.</p>`,
          },
          buttonLinkList: {
            buttonLinks: [
              {
                link: { title: 'Partner Locations & Services', url: '#' },
              },
            ],
          },
        });

      editorialSlab =
        editorialSlab ||
        EditorialSlab({
          ...EditorialSlab.args,
          theme: Theme.Neutral50,
          h2InWysiwyg: true,
          editorial: {
            wysiwyg: /* html */ `
              <div class="wysiwyg-embed tw-align-none">
                ${await Picture({
                  ...Picture.args,
                  src: `${window.IMAGES}/sample-plusODU.png`,
                })()}
              </div>
              <h2>The Clear Pathway to Your Bachelor's Degree</h2>
              <p>We've partnered with select colleges to give you a clear path and the most support to earn your bachelor's degree through ODUGlobal.</p>
              <p>You start by earning an associate degree from a plusODU partner school, then gain guaranteed acceptance into Old Dominion University. Some courses may count toward both degrees, so you can save time and money.</p>
              <p>Plus, while you're still finishing the associate degree, you'll have access to services from both schools, such as academic advising, libraries, and more.</p>
              <div class="wysiwyg-embed tw-align-none">
                ${await ButtonLink({
                  ...ButtonLink.args,
                  title: 'What is plusODU?',
                })()}
              </div>
            `,
          },
        });

      partnerLocationsBlock = partnerLocationsBlock || PartnerLocationsBlock();

      noImageRoutingBlockCollection =
        noImageRoutingBlockCollection ||
        NoImageRoutingBlockCollection({
          ...NoImageRoutingBlockCollection.args,
          theme: Theme.MidBlue500,
          routingBlocks: [
            {
              headline: 'Partners for Success',
              editorial: {
                wysiwyg: /* html */ `
                  <p>Old Dominion University partners with colleges and universities to offer students pathways to further success. We also partner with businesses and organizations to offer opportunities for employee development.</p>
                  <p>We'd love to learn how we can work together!</p>
                `,
              },
              fancyLinkList: {
                fancyLinks: [
                  'Education Industry Partnerships',
                  'Employee Development Partnerships',
                ].map((title) => ({
                  link: { title, url: '#' },
                  withAfterIcon: true,
                })),
              },
            },
          ].map((args: typeof NoImageRoutingBlock.args) =>
            NoImageRoutingBlock(args)
          ),
        });

      return PartnersLandingPureComponent({
        header,
        footer,
        pageHeader,
        overlappingFeature,
        editorialSlab,
        partnerLocationsBlock,
        noImageRoutingBlockCollection,
      });
    },
  },

  args: {},
};

type PartnersLandingArgs = Partial<PartnersLandingTwigContext> & {
  foo?: never;
};

export const PartnersLanding = makeComponentInjector({
  pureComponent: PartnersLandingPureComponent,
  storyRenderFn: PartnersLandingStory.parameters.render,
  defaultArgs: PartnersLandingStory.args,
});
