import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import PartnerDetailTemplate from './PartnerDetail.twig';
import { SiteHeader } from '@components/Wrapper/SiteHeader/SiteHeader.stories';
import { SiteFooter } from '@components/Wrapper/SiteFooter/SiteFooter.stories';
import { PartnerPageHeader } from '@components/Organism/PageHeader/PartnerPageHeader/PartnerPageHeader.stories';
import { NoImageRoutingBlockCollection } from '@components/Organism/NoImageRoutingBlockCollection/NoImageRoutingBlockCollection.stories';
import {
  NoImageRoutingBlock,
  defaultNoImageRoutingBlock,
} from '@components/Molecule/NoImageRoutingBlock/NoImageRoutingBlock.stories';
import { FiftyFifty } from '@components/Organism/FiftyFifty/FiftyFifty.stories';
import Theme from '@components/_ts-helpers/theme';
import { defaultRoutingBlockPicture } from '@components/Molecule/NoImageRoutingBlock/NoImageRoutingBlock.stories';

const PartnerDetailPureComponent = (twigContext: PartnerDetailTwigContext) =>
  PartnerDetailTemplate(twigContext);

type PartnerDetailTwigContext = {
  header: InjectedComponent<typeof SiteHeader>;
  footer: InjectedComponent<typeof SiteFooter>;
  pageHeader: InjectedComponent<typeof PartnerPageHeader>;
  noImageRoutingBlockCollection: InjectedComponent<
    typeof NoImageRoutingBlockCollection
  >;
  fiftyFifty: InjectedComponent<typeof FiftyFifty>;
};

const meta: Meta = {
  title: 'Page Demo/Partner Detail',
  excludeStories: ['PartnerDetail'],
};

export default meta;

export const PartnerDetailStory: Story<PartnerDetailArgs> = {
  name: 'Partner Detail',

  parameters: {
    render: ({
      header,
      footer,
      pageHeader,
      noImageRoutingBlockCollection,
      fiftyFifty,
    }) => {
      header =
        header ||
        SiteHeader({
          ...SiteHeader.args,
          currentData: {
            hasCurrentPage: ['Academics', 'Academic Partnerships'],
          },
          breadcrumbs: [
            'Home',
            'Academics',
            'Eastern Shore Community College',
          ].map((title) => ({ title, url: '#' })),
        });
      footer = footer || SiteFooter();

      pageHeader =
        pageHeader ||
        PartnerPageHeader({
          ...PartnerPageHeader.args,
          headline: 'Eastern Shore Community College',
        });

      noImageRoutingBlockCollection =
        noImageRoutingBlockCollection ||
        NoImageRoutingBlockCollection({
          ...NoImageRoutingBlockCollection.args,
          theme: Theme.Neutral50,
          withColumns: true,
          routingBlocks: [
            {
              headline: 'Partnering for Your Success',
              picture: defaultRoutingBlockPicture,
              editorial: {
                wysiwyg: /* html */ `
                  <p>We have a Guaranteed Admission Agreement for select programs to make it easy to transfer from this college to ODU and keep your education on track.</p>
                  <p>Before you apply, we'll give you a free unofficial transfer evaluation so you know how your credits will transfer to ODU. <a href="#">Contact us to get started!</a></p>
                  </p>Are you a military servicemember, veteran, or military dependent? Our expert staff will help you navigate everything from tuition assistance to continuing your online degree on deployment.</p>
                `,
              },
              fancyLinkList: {
                fancyLinks: [
                  'More About Guaranteed Admission',
                  'Military Student Information',
                  'Contact ODUGlobal to Get Started',
                ].map((title) => ({
                  link: { title, url: '#' },
                  withAfterIcon: true,
                })),
                inline: false,
              },
            },
            {
              headline: 'Support from ODU and ESCC',
              picture: defaultRoutingBlockPicture,
              editorial: {
                wysiwyg: /* html */ `
                  <p>As our partner, ESCC supports online ODU students with:</p>
                  <ul>
                    <li>Computer labs</li>
                    <li>Computers in the library</li>
                    <li>Loaner laptop program</li>
                    <li>Disability services</li>
                    <li>Proctoring</li>
                  </ul>
                  <p>ODU's online students have access to a whole university of support, including:</p>
                  <ul>
                    <li>Free software like Microsoft Office</li>
                    <li>Interlibrary loan</li>
                    <li>Tutoring
                    <li>Writing and research help</li>
                    <li>Career services</li>
                  </ul>
                `,
              },
              fancyLinkList: {
                fancyLinks: [
                  'Explore How ODU’s Online Learning Works',
                  'Learn More About ODU’s Online Support',
                ].map((title) => ({
                  link: { title, url: '#' },
                  withAfterIcon: true,
                })),
                inline: false,
              },
            },
          ].map((args: typeof NoImageRoutingBlock.args) =>
            NoImageRoutingBlock(args)
          ),
        });

      fiftyFifty =
        fiftyFifty ||
        FiftyFifty({
          ...FiftyFifty.args,
          firstHalfType: 'no-image-routing-block',
          firstHalf: {
            noImageRoutingBlock: defaultNoImageRoutingBlock({
              ...NoImageRoutingBlock.args,
              withSuperhead: false,
              withSubhead: false,
              withIcon: false,
              withButtonLinks: false,
              headline: 'ODU Programs by Degree Level',
              editorial: {
                wysiwyg: /* html */ `
                <p>Ready to get started? Explore ODU's online programs below, or contact us to find out more.</p>
              `,
              },
              fancyLinkList: {
                fancyLinks: [
                  'Bachelor’s',
                  'Master’s',
                  'Doctorate & Ed Specialist',
                  'Certificate',
                  'Endorsement',
                  'See All of ODU’s Online Programs',
                ].map((title) => ({
                  link: { title, url: '#' },
                  withAfterIcon: true,
                })),
                inline: false,
              },
            }),
          },
        });
      return PartnerDetailPureComponent({
        header,
        footer,
        pageHeader,
        noImageRoutingBlockCollection,
        fiftyFifty,
      });
    },
  },

  args: {},
};

type PartnerDetailArgs = Partial<PartnerDetailTwigContext> & {
  foo?: never;
};

export const PartnerDetail = makeComponentInjector({
  pureComponent: PartnerDetailPureComponent,
  storyRenderFn: PartnerDetailStory.parameters.render,
  defaultArgs: PartnerDetailStory.args,
});
