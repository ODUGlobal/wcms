import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import ProgramDetailTemplate from './ProgramDetail.twig';
import { SiteHeader } from '@components/Wrapper/SiteHeader/SiteHeader.stories';
import { SiteFooter } from '@components/Wrapper/SiteFooter/SiteFooter.stories';
import { ProgramPageHeader } from '@components/Organism/PageHeader/ProgramPageHeader/ProgramPageHeader.stories';
import { FastFacts } from '@components/Organism/FastFacts/FastFacts.stories';
import { OverlappingFeature } from '@components/Organism/OverlappingFeature/OverlappingFeature.stories';
import Theme from '@components/_ts-helpers/theme';
import { CardCollection } from '@components/Organism/CardCollection/CardCollection.stories';
import { NoImageRoutingBlockCollection } from '@components/Organism/NoImageRoutingBlockCollection/NoImageRoutingBlockCollection.stories';
import { ButtonLinkList } from '@components/Molecule/LinkList/ButtonLinkList/ButtonLinkList.stories';
import { ButtonLink } from '@components/Atom/Link/ButtonLink/ButtonLink.stories';
import { Editorial } from '@components/Organism/Editorial/Editorial.stories';
import { FancyLink } from '@components/Atom/Link/FancyLink/FancyLink.stories';
import { FiftyFifty } from '@components/Organism/FiftyFifty/FiftyFifty.stories';
import { FancyLinkList } from '@components/Molecule/LinkList/FancyLinkList/FancyLinkList.stories';
import {
  Heading,
  defaultHeading,
} from '@components/Atom/Heading/Heading.stories';
import { NoImageRoutingBlock } from '@components/Molecule/NoImageRoutingBlock/NoImageRoutingBlock.stories';

const ProgramDetailPureComponent = (twigContext: ProgramDetailTwigContext) =>
  ProgramDetailTemplate(twigContext);

type ProgramDetailTwigContext = {
  header: InjectedComponent<typeof SiteHeader>;
  footer: InjectedComponent<typeof SiteFooter>;
  pageHeader: InjectedComponent<typeof ProgramPageHeader>;
  fiftyFifty1: InjectedComponent<typeof FiftyFifty>;
  fastFacts: InjectedComponent<typeof FastFacts>;
  fiftyFifty2: InjectedComponent<typeof FiftyFifty>;
  fiftyFifty3: InjectedComponent<typeof FiftyFifty>;
  overlappingFeature: InjectedComponent<typeof OverlappingFeature>;
  fiftyFifty4: InjectedComponent<typeof FiftyFifty>;
  // Careers in Accounting
  cardCollection: InjectedComponent<typeof CardCollection>;
  noImageRoutingBlockCollection: InjectedComponent<
    typeof NoImageRoutingBlockCollection
  >;
};

const meta: Meta = {
  title: 'Page Demo/Program Detail',
  excludeStories: ['ProgramDetail'],
};

export default meta;

export const ProgramDetailStory: Story<ProgramDetailArgs> = {
  name: 'Program Detail',

  parameters: {
    render: async ({
      header,
      footer,
      pageHeader,
      fiftyFifty1,
      fastFacts,
      fiftyFifty2,
      fiftyFifty3,
      overlappingFeature,
      fiftyFifty4,
      // Careers in Accounting
      cardCollection,
      noImageRoutingBlockCollection,
    }) => {
      header =
        header || SiteHeader({ ...SiteHeader.args, currentPageLevel: 'other' });
      footer = footer || SiteFooter();

      pageHeader = pageHeader || ProgramPageHeader();

      fiftyFifty1 =
        fiftyFifty1 ||
        FiftyFifty({
          ...FiftyFifty.args,
          firstHalfType: 'editorial',
          firstHalf: {
            heading: defaultHeading({
              ...Heading.args,
              headline: 'Why ODU for Accounting?',
            }),
            editorial: {
              wysiwyg: /* html */ `
                <p>Many organizations choose their corporate executives from their pool of accountants. Their broad training makes accountants natural leaders. Join them with an online degree through ODUGlobal.</p>
                <p>You'll learn technical accounting knowledge in this online bachelor's degree in accounting. Communication, analytical abilities, and computer skills will also be part of your key courses. You'll graduate ready to start your MBA or start your career.</p>
                <h3>Interested in earning an MBA or MPA?</h3>
                <p>You could earn graduate credits while you complete your ODU bachelor’s degree. Check out our <a href="#">MBA Early Entry</a> program or <a href="#">MPA Early Start</a> program for details.</p>
              `,
            },
          },
        });

      fastFacts =
        fastFacts ||
        FastFacts({
          ...FastFacts.args,
          itemCount: 2,
        });

      fiftyFifty2 =
        fiftyFifty2 ||
        FiftyFifty({
          ...FiftyFifty.args,
          secondHalfType: 'form',
        });

      fiftyFifty3 =
        fiftyFifty3 ||
        FiftyFifty({
          ...FiftyFifty.args,
          firstHalfType: 'editorial',
          firstHalf: {
            heading: defaultHeading({
              ...Heading.args,
              headline: 'Calculating Cost',
            }),
            editorial: {
              wysiwyg: /* html */ `
                <p>Active duty military students may qualify for a discounted undergraduate tuition rate.</p>
                <p>These tuition rates are effective Summer 2022 and subject to change.</p>
                <p>* In-state rate assumes residency requirements are met.</p>
                <div class="wysiwyg-embed tw-align-none">
                  ${await FancyLinkList({
                    ...FancyLinkList.args,
                    inline: true,
                    fancyLinks: [
                      {
                        link: { title: 'Estimate Your Total Cost', url: '#' },
                        withAfterIcon: true,
                      },
                      {
                        link: { title: 'ODU Tuition & Aid', url: '#' },
                        withAfterIcon: true,
                      },
                    ],
                  })()}
                </div>
              `,
            },
          },
          secondHalfType: 'cost-blocks',
        });

      overlappingFeature =
        overlappingFeature ||
        OverlappingFeature({
          ...OverlappingFeature.args,
          theme: Theme.MidBlue500,
          flipped: true,
          withButtonLinks: false,
          superhead: undefined,
          headline: 'Online Experience',
        });

      fiftyFifty4 =
        fiftyFifty4 ||
        FiftyFifty({
          ...FiftyFifty.args,
          theme: Theme.Neutral50,
          firstHalfType: 'no-image-routing-block',
          secondHalfType: 'editorial',
          secondHalf: {
            editorial: {
              wysiwyg: /* html */ `
                <ul>
                  <li>Accountant</li>
                  <li>Chief Financial Officer</li>
                  <li>President or Vice President</li>
                  <li>Staff Accountant</li>
                  <li>Auditor</li>
                  <li>Account Manager</li>
                </ul>
              `,
            },
          },
        });

      // Careers in Accounting

      cardCollection =
        cardCollection ||
        CardCollection({
          ...CardCollection.args,
          itemCount: 2,
          headline: 'Your Team',
          withFancyLinks: false,
          withItemFancyLinks: false,
          withSuperheads: false,
          withButtonLinks: false,
          withDescriptions: false,
          withIconDescriptionLists: true,
          theme: Theme.Neutral50,
        });

      noImageRoutingBlockCollection =
        noImageRoutingBlockCollection ||
        NoImageRoutingBlockCollection({
          ...NoImageRoutingBlockCollection.args,
          theme: Theme.MidBlue500,
          headline: 'Ready to get started?',
          withColumns: true,
          routingBlocks: [
            {
              headline: 'How to Apply',
              editorial: {
                wysiwyg: /* html */ `
                  <p>This bachelor's program is available entirely online. If you’ve never taken college classes before, you'll apply to ODU as a freshman. We have enrollment coordinators to help you through the admissions process.</p>
                  <p>You will need to be accepted to ODU as a <a href="#">degree-seeking undergraduate student</a> and apply to the BSBA program in the Strome College of Business.</p>
                `,
              },
              buttonLinkList: {
                buttonLinks: [
                  { link: { title: 'Apply Now', url: '#' } },
                  { link: { title: 'Request Info', url: '#' } },
                ],
              },
            },
            {
              headline: 'Get Guaranteed Admissions to ODU',
              editorial: {
                wysiwyg: /* html */ `
                  <p>ODU has partnered with the Virginia Community College System and select educational institutions to make transferring easy.</p>
                `,
              },
              fancyLinkList: {
                fancyLinks: [
                  {
                    link: {
                      title: 'Learn about Guaranteed Admissions to ODU',
                      url: '#',
                    },
                    withAfterIcon: true,
                  },
                ],
              },
            },
          ].map((args: typeof NoImageRoutingBlock.args) =>
            NoImageRoutingBlock(args)
          ),
        });

      return ProgramDetailPureComponent({
        header,
        footer,
        pageHeader,
        fiftyFifty1,
        fastFacts,
        fiftyFifty2,
        fiftyFifty3,
        overlappingFeature,
        fiftyFifty4,
        // Careers in Accounting
        cardCollection,
        noImageRoutingBlockCollection,
      });
    },
  },

  args: {},
};

type ProgramDetailArgs = Partial<ProgramDetailTwigContext> & {
  foo?: never;
};

export const ProgramDetail = makeComponentInjector({
  pureComponent: ProgramDetailPureComponent,
  storyRenderFn: ProgramDetailStory.parameters.render,
  defaultArgs: ProgramDetailStory.args,
});
