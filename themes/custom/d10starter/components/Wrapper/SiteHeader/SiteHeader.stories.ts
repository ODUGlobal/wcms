import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import SiteHeaderTemplate from './SiteHeader.twig';

const SiteHeaderPureComponent = (twigContext: SiteHeaderTwigContext) =>
  SiteHeaderTemplate(twigContext);

type SiteHeaderTwigContext = {
  visuallyHiddenSiteTitle: string;
  utilityLinks: { url: string; title: string }[];
  infoForLinks: { url: string; title: string }[];
  /** Used to build mobile-nav, desktop main-nav, and desktop section-nav. */
  navTree: NavTreeItem[];
  /** First one MUST be Home, and last one MUST be the current page. */
  breadcrumbs?: { url: string; title: string }[];
  searchFormAction: string;
};

/**
 * Always has `title`, and then either has `url`, `children`, or both. More specifically:
 *
 * - The TOP-level items (e.g., "Academics") all have both `url` and `children`.
 * - The SECOND-level items all have `children` but never `url`.
 * - Beyond that, there are no fixed rules (but *usually* they have only `url`).
 *
 * The `hasCurrentPage` and `isCurrentPage` booleans are important so that the Twig template knows:
 *  - which items to give `aria-current="true"` and `aria-current="page"`
 *    in mobile-nav, desktop main-nav, and (if applicable) desktop section-nav;
 *  - what to show first in the mobile-menu on page-load;
 *  - what section-nav contents to show on desktop (if any).
 *
 * Items with `children` can have `hasCurrentPage: true`, and items with `url`
 * can have `isCurrentPage: true`. Items with both `children` and `url` can have
 * either one, but not both.
 *
 * Only one item in the whole tree may have `isCurrentPage: true`, which indicates the current page
 * (it must be an item that has a `url`). If an item has `isCurrentPage: true`, then EVERY ANCESTOR
 * OF THAT ITEM IN THE TREE MUST HAVE `hasCurrentPage: true`!
 *
 * Note that sometimes we may want `hasCurrentPage: true` on some items even if no descendant-item
 * has `isCurrentPage: true`. This is because not all pages are represented in the nav-tree!
 * For example, individual Program pages don't get links in the nav-tree, but we may still
 * want the top-level Academics item to get `hasCurrentPage: true` for these pages
 * (so that Academics gets `aria-current="true"`, so that the mobile-nav shows
 * the Academics list on page-load, and so that the Academics section-nav
 * on desktop is present).
 */
type NavTreeItem = { title: string } & (
  | { children: NavTreeItem[]; hasCurrentPage?: boolean }
  | { url: string; isCurrentPage?: boolean }
  | {
      children: NavTreeItem[];
      url: string;
      hasCurrentPage?: boolean;
      isCurrentPage?: boolean;
    }
);

const meta: Meta = {
  title: 'Wrapper/Site Header',
  excludeStories: [
    'SiteHeader',
    'currentPageLevelOptions',
    'defaultSiteHeader',
  ],
};

export default meta;

export const currentPageLevelOptions = [0, 1, 2, 3, 'other'] as const;

const makeNavTree = ({
  currentPageLevel,
  currentData,
}: {
  currentPageLevel?: (typeof currentPageLevelOptions)[number];
  /**
   * For more fine-grained control of demos.
   * Note that the strings must exactly match the item `title`s.
   */
  currentData?: { isCurrentPage?: string; hasCurrentPage?: string[] };
}): SiteHeaderTwigContext['navTree'] => {
  const baseTree: SiteHeaderTwigContext['navTree'] = [
    // demo the entire Academics section here (just taken from the current/old ODUGlobal site)
    {
      ...(currentPageLevel === 1 && !currentData
        ? { isCurrentPage: true }
        : {}),
      ...(((typeof currentPageLevel === 'number' && currentPageLevel > 1) ||
        currentPageLevel === 'other') &&
      !currentData
        ? { hasCurrentPage: true }
        : {}),
      title: 'Academics',
      url: '#',
      children: [
        {
          ...(typeof currentPageLevel === 'number' &&
          currentPageLevel > 1 &&
          !currentData
            ? { hasCurrentPage: true }
            : {}),
          title: 'Programs by Degree Level',
          children: [
            {
              ...(currentPageLevel === 2 && !currentData
                ? { isCurrentPage: true }
                : {}),
              ...(typeof currentPageLevel === 'number' &&
              currentPageLevel > 2 &&
              !currentData
                ? { hasCurrentPage: true }
                : {}),
              title: 'Bachelor’s Degree',
              url: '#',
              children: [
                {
                  ...(currentPageLevel === 3 && !currentData
                    ? { isCurrentPage: true }
                    : {}),
                  title: 'Accelerated Online Degree Options',
                  url: '#',
                },
                {
                  title: 'Early Start MPA for Current ODU Undergraduates',
                  url: '#',
                },
                {
                  title: 'Linked BSBA to MBA',
                  url: '#',
                },
              ],
            },
            {
              title: 'Master’s Degree',
              url: '#',
            },
            {
              title: 'Doctorate & Ed Specialist',
              url: '#',
            },
            {
              title: 'Certificate',
              url: '#',
            },
            {
              title: 'Endorsement',
              url: '#',
            },
            {
              title: 'All Programs',
              url: '#',
            },
          ],
        },
        {
          title: 'Areas of Study',
          children: [
            {
              title: 'Business & Management',
              url: '#',
            },
            {
              title: 'Communication & Writing',
              url: '#',
            },
            {
              title: 'Computer Science & Math',
              url: '#',
            },
            {
              title: 'Education',
              url: '#',
            },
            {
              title: 'Engineering',
              url: '#',
            },
            {
              title: 'Health Sciences & Nurses',
              url: '#',
            },
            {
              title: 'Social Sciences',
              url: '#',
            },
            {
              title: 'Military Affiliated',
              url: '#',
            },
            {
              title: 'Continuing Education',
              url: '#',
            },
          ],
        },
        {
          title: 'Academic Partnerships',
          children: [
            {
              title: 'What is plusODU?',
              url: '#',
            },
            {
              title: 'Our 50+ Partners',
              url: '#',
            },
            {
              title: 'Community Colleges',
              url: '#',
            },
            {
              title: 'Higher Education Centers',
              url: '#',
            },
            {
              title: 'Education Industry Partnerships',
              url: '#',
            },
            {
              title: 'Military Affiliations and Partners',
              url: '#',
            },
            {
              title: 'Online Virginia Network',
              url: '#',
            },
            {
              title: 'Continuing Education & Professional Development',
              url: '#',
            },
          ],
        },
        {
          title: 'Academic Resources',
          children: [
            {
              title: 'How to Register for Courses',
              url: '#',
            },
            {
              title: 'Exams and Proctors',
              url: '#',
            },
            {
              title: 'How to Get Course Materials',
              url: '#',
            },
            {
              title: 'Upcoming Online Courses',
              url: '#',
            },
            {
              title: 'Access Online Classes',
              url: '#',
            },
          ],
        },
      ],
    },
    // the rest of the demo isn't fleshed out completely, which is fine for Storybook purposes (for now, at least)
    {
      title: 'Admissions',
      url: '#',
      children: [
        {
          title: 'How to Apply',
          children: [
            {
              title: 'Undergraduate Admissions',
              url: '#',
            },
            {
              title: 'Just links now',
              url: '#',
            },
          ],
        },
        {
          title: 'Once You’re Accepted',
          children: [
            {
              title: 'How to Succeed as an Online Student',
              url: '#',
            },
            {
              title: 'Just links now',
              url: '#',
            },
          ],
        },
      ],
    },
    {
      title: 'Cost & Aid',
      url: '#',
      children: [
        {
          title: 'Tuition & Fees',
          children: [
            {
              title: 'Undergraduate Cost',
              url: '#',
            },
            {
              title: 'Just links now',
              url: '#',
            },
          ],
        },
        {
          title: 'Financial Aid',
          children: [
            {
              title: 'Applying for Financial Aid',
              url: '#',
            },
            {
              title: 'Just links now',
              url: '#',
            },
          ],
        },
      ],
    },
    {
      title: 'Online Experience',
      url: '#',
      children: [
        {
          title: 'How You’ll Learn',
          children: [
            {
              title: 'Taking Classes Online',
              url: '#',
            },
            {
              title: 'Coaching and Advising',
              url: '#',
            },
            {
              title: 'Coursework and Exams',
              url: '#',
              children: [
                {
                  title: 'SmarterProctoring',
                  url: '#',
                },
                {
                  title: 'Just links now',
                  url: '#',
                },
              ],
            },
            {
              title: 'Top Questions, Answered',
              url: '#',
            },
            {
              title: 'Student Experiences',
              url: '#',
            },
          ],
        },
        {
          title: 'Advising & Support',
          children: [
            {
              title: 'Coaching & Advising',
              url: '#',
            },
            {
              title: 'Supporting Students',
              url: '#',
            },
            {
              title: 'Technical Support',
              url: '#',
              children: [
                {
                  title: 'Online Class Behavior',
                  url: '#',
                },
                {
                  title: 'Just links now',
                  url: '#',
                },
              ],
            },
            {
              title: 'Helpful Resources',
              url: '#',
            },
            {
              title: 'How to Succeed as an ODUGlobal Student',
              url: '#',
            },
          ],
        },
        {
          title: 'Career Services',
          children: [
            {
              title: 'Online Career Services at ODU',
              url: '#',
            },
          ],
        },
      ],
    },
    {
      title: 'About',
      url: '#',
      children: [
        {
          title: 'Overview',
          children: [
            {
              title: 'Our Experience',
              url: '#',
              children: [
                {
                  title: 'For Faculty',
                  url: '#',
                },
                {
                  title: 'Just links now',
                  url: '#',
                },
              ],
            },
            {
              title: 'At a Glance',
              url: '#',
            },
            {
              title: 'Accreditation',
              url: '#',
            },
            {
              title: 'State Authorization and Licensure',
              url: '#',
              children: [
                {
                  title: 'Washington State Authorization',
                  url: '#',
                },
                {
                  title: 'Just links now',
                  url: '#',
                },
              ],
            },
            {
              title: 'Rankings and Recognition',
              url: '#',
            },
          ],
        },
        {
          title: 'People & Locations',
          children: [
            {
              title: 'Partners',
              url: '#',
            },
            {
              title: 'Just links now',
              url: '#',
            },
          ],
        },
        {
          title: 'News & Events',
          children: [
            {
              title: 'Recent News',
              url: '#',
            },
            {
              title: 'Just links now',
              url: '#',
            },
          ],
        },
        {
          title: 'Partnerships',
          children: [
            {
              title: 'Education Industry Partnerships',
              url: '#',
            },
            {
              title: 'Just links now',
              url: '#',
            },
          ],
        },
      ],
    },
  ];

  if (currentData) {
    const setCurrentForLevel = (item: NavTreeItem) => {
      if ('url' in item) {
        if (currentData.isCurrentPage === item.title) {
          item.isCurrentPage = true;
          return;
        }
      }

      if ('children' in item) {
        if (currentData?.hasCurrentPage?.includes(item.title)) {
          item.hasCurrentPage = true;
          item.children.forEach((child) => setCurrentForLevel(child));
        }
      }
    };

    baseTree.forEach((item) => setCurrentForLevel(item));
  }

  return baseTree;
};

const defaultBreadcrumbs = (
  navTree: SiteHeaderTwigContext['navTree']
): SiteHeaderTwigContext['breadcrumbs'] => {
  const currentSlice = navTree.find(
    (item) => 'isCurrentPage' in item || 'hasCurrentPage' in item
  );
  if (!currentSlice) return;

  const breadcrumbs: SiteHeaderTwigContext['breadcrumbs'] = [
    { title: 'Home', url: '#' },
  ];

  const getBreadcrumb = (item: NavTreeItem) => {
    if ('isCurrentPage' in item && 'url' in item) {
      breadcrumbs.push({ title: item.title, url: item.url });
      return;
    }

    if ('hasCurrentPage' in item) {
      if ('url' in item) {
        breadcrumbs.push({ title: item.title, url: item.url });
      }

      if ('children' in item) {
        const nextSlice = item.children.find(
          (child) => 'isCurrentPage' in child || 'hasCurrentPage' in child
        );
        if (nextSlice) {
          getBreadcrumb(nextSlice);
        } else {
          breadcrumbs.push({ title: 'Accounting Program Online', url: '#' });
        }
      }
    }
  };

  getBreadcrumb(currentSlice);

  return breadcrumbs;
};

export const defaultSiteHeader = ({
  visuallyHiddenSiteTitle,
  utilityLinks,
  infoForLinks,
  navTree,
  currentPageLevel,
  currentData,
  breadcrumbs,
  searchFormAction,
}: SiteHeaderArgs): SiteHeaderTwigContext => {
  visuallyHiddenSiteTitle = visuallyHiddenSiteTitle || 'ODU Global';

  utilityLinks =
    utilityLinks ||
    [
      'ODU.edu',
      // 'For Faculty',
      'Education Partnerships',
      'Class Access',
    ].map((title) => ({ title, url: '#' }));

  infoForLinks =
    infoForLinks ||
    [
      'Prospective Students',
      'Current Students',
      'Military Students',
      'International Students',
      'Transfer Students',
    ].map((title) => ({ title, url: '#' }));

  navTree = navTree || makeNavTree({ currentPageLevel, currentData });

  // console.log(navTree);

  breadcrumbs = breadcrumbs || defaultBreadcrumbs(navTree);

  // console.log(breadcrumbs);

  searchFormAction = searchFormAction || '/';
  return {
    visuallyHiddenSiteTitle,
    utilityLinks,
    infoForLinks,
    navTree,
    breadcrumbs,
    searchFormAction,
  };
};

export const SiteHeaderStory: Story<SiteHeaderArgs> = {
  name: 'Site Header',

  parameters: {
    render: (args) => SiteHeaderPureComponent(defaultSiteHeader(args)),
  },

  args: {
    currentPageLevel: currentPageLevelOptions[0],
  },

  argTypes: {
    currentPageLevel: {
      name: 'currentPageLevel (0 for homepage, 1 for top-level landing-page, etc.); "other" is to demo when the current-page is not in the nav-tree (like an individual Program page) but for which we might want some "ancestor" menu represented (Academics, say)',
      options: currentPageLevelOptions,
      control: {
        type: 'inline-radio',
      },
    },
  },

  decorators: [
    (story) => /* html */ `
      ${story()}
      <div class="h-[1000px] bg-neutral-100 py-10">
        <div class="container">[[ CONTENT UNDER SITE HEADER ]]</div>
      </div>
    `,
  ],
};

type SiteHeaderArgs = Partial<SiteHeaderTwigContext> & {
  currentPageLevel?: (typeof currentPageLevelOptions)[number];
  /** For fine-grained control in demos. Not exposed to Storybook Control UI. */
  currentData?: { isCurrentPage?: string; hasCurrentPage?: string[] };
};

export const SiteHeader = makeComponentInjector({
  pureComponent: SiteHeaderPureComponent,
  storyRenderFn: SiteHeaderStory.parameters.render,
  defaultArgs: SiteHeaderStory.args,
});
