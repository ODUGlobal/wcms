import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import PartnerLocationsBlockTemplate from './PartnerLocationsBlock.twig';
import {
  Heading,
  HeadingTwigContext,
  defaultHeading,
} from '@components/Atom/Heading/Heading.stories';
import { EditorialTwigContext } from '../Editorial/Editorial.stories';
import { TwingMarkup } from 'twing';
import { LinkCollectionTwigContext } from '../LinkCollection/LinkCollection.stories';
import { LinkGroup } from '@components/Molecule/LinkGroup/LinkGroup.stories';

const PartnerLocationsBlockPureComponent = (
  twigContext: PartnerLocationsBlockTwigContext
) => PartnerLocationsBlockTemplate(twigContext);

export type PartnerLocationsBlockTwigContext = {
  id?: string;
  verticalRhythm?: string;
  heading?: HeadingTwigContext;
  editorial?: EditorialTwigContext;
  /**
   * In Storybook (for now, anyway), just placeholder text.
   * On actual Drupal site, the embedded autocomplete and map.
   */
  autocompleteAndMap: string | TwingMarkup;
  /**
   * `heading`, `hLevel`, and `noGenericSlab` will be ignored if present (they're set in the Twig template).
   * Also: we want to use `allowColumnBreak: true` for the "Virginia" link-group.
   */
  linkCollection: LinkCollectionTwigContext;
};

const meta: Meta = {
  title: 'Organism/Partner Locations Block',
  excludeStories: ['PartnerLocationsBlock', 'defaultPartnerLocationsBlock'],
};

export default meta;

export const defaultPartnerLocationsBlock = ({
  id,
  verticalRhythm,
  heading,
  headline,
  editorial,
  withEditorial,
  autocompleteAndMap,
  linkCollection,
}: PartnerLocationsBlockArgs): PartnerLocationsBlockTwigContext => {
  heading =
    heading ||
    (headline ? defaultHeading({ ...Heading.args, headline }) : undefined);

  editorial =
    editorial ||
    (withEditorial
      ? {
          wysiwyg: /* html */ `
            <p>These partner locations can help support your educational journey by providing you access to resources and facilities, such as computer labs, library resources, disability services and more. Click on a location to see what resources and support is offered there.</p>
            <p>COVID-19: If our partners need to mitigate the spread of the novel coronavirus, access to their services may be limited or unavailable. Please contact the partner location, office or testing center before you make plans to visit. If you are unable to access the services you need, please contact your instructor or advisor for assistance.</p>
          `,
        }
      : undefined);

  autocompleteAndMap =
    autocompleteAndMap || '[[ Autocomplete and Interactive Map here ]]';

  linkCollection = linkCollection || {
    linkGroups: [
      {
        // b/c this list is so long, we really must allow a column-break within it
        allowColumnBreak: true,
        heading: { headline: 'Virginia' },
        fancyLinkList: {
          fancyLinks: [
            'Blue Ridge Community College',
            'Brightpoint Community CollegeFort Lee',
            'Camp Community College',
            'Central Virginia Community College',
            'Danville Community College',
            'Eastern Shore Community College',
            'Fort Belvoir',
            'Fort Eustis',
            'Fort Myer',
            'Germanna Community College',
            'Joint Expeditionary Base Little Creek - Ft. Story',
            'Langley Air Force Base',
            'Laurel Ridge at Luray-Page County Center',
            'Laurel Ridge Community College - Fauquier',
            'Laurel Ridge Community College - Middletown',
            'Mountain Empire Community College',
            'Mountain Gateway Community College',
            'Naval Station Norfolk (NSN)',
            'New River Community College',
            'Northern Virginia Community College',
            'Oceana Naval Air Station',
            'ODU Dahlgren',
            'Patrick & Henry Community College',
            'Pentagon',
            'Piedmont Virginia Community College',
            'PVCC-ODU @ Eugene Giuseppe Center',
            'Quantico Marine Corps Base',
            'Rappahannock Community College',
            'Regional Medical Center/USCG Portsmouth at Tri-Cities Higher Education Center',
            'Reynolds Community College',
            'Roanoke Higher Education Center',
            'Southern Virginia Higher Education Center',
            'Southside Virginia Community College - Christanna Campus',
            'Southside Virginia Community College - J.H. Daniel Campus',
            'Southwest Virginia Community College',
            'Southwest Virginia Higher Education Center',
            'Tidewater Community College',
            'Virginia Highlands Community College',
            'Virginia Peninsula Community College',
            'Virginia Western Community College',
            'Wytheville Community College',
          ].map((title) => ({
            link: { title, url: '#' },
            withAfterIcon: true,
          })),
        },
      },
      {
        heading: { headline: 'Arizona' },
        fancyLinkList: {
          fancyLinks: ['Maricopa Community College', 'Yavapai College'].map(
            (title) => ({ link: { title, url: '#' }, withAfterIcon: true })
          ),
        },
      },
      {
        heading: { headline: 'Washington' },
        fancyLinkList: {
          fancyLinks: [
            'Olympic College',
            'Peninsula College',
            'Skagit Valley College',
          ].map((title) => ({
            link: { title, url: '#' },
            withAfterIcon: true,
          })),
        },
      },
      {
        heading: { headline: 'International' },
        fancyLinkList: {
          fancyLinks: [
            'Acharya Institute of Technology',
            'Cihan University Sulaimaniya (CUS)',
          ].map((title) => ({
            link: { title, url: '#' },
            withAfterIcon: true,
          })),
        },
      },
    ].map((args: typeof LinkGroup.args) => LinkGroup(args)),
  };

  return {
    id,
    verticalRhythm,
    heading,
    editorial,
    autocompleteAndMap,
    linkCollection,
  };
};

export const PartnerLocationsBlockStory: Story<PartnerLocationsBlockArgs> = {
  name: 'Partner Locations Block',

  parameters: {
    render: (args) =>
      PartnerLocationsBlockPureComponent(defaultPartnerLocationsBlock(args)),
  },

  args: {
    headline: 'Partner Locations',
    withEditorial: true,
  },
};

type PartnerLocationsBlockArgs = Partial<PartnerLocationsBlockTwigContext> & {
  headline?: string;
  withEditorial?: boolean;
};

export const PartnerLocationsBlock = makeComponentInjector({
  pureComponent: PartnerLocationsBlockPureComponent,
  storyRenderFn: PartnerLocationsBlockStory.parameters.render,
  defaultArgs: PartnerLocationsBlockStory.args,
});
