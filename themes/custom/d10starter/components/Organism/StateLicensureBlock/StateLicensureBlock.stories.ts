import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import StateLicensureBlockTemplate from './StateLicensureBlock.twig';
import {
  Heading,
  HeadingTwigContext,
  defaultHeading,
} from '@components/Atom/Heading/Heading.stories';
import {
  Editorial,
  EditorialTwigContext,
} from '../Editorial/Editorial.stories';
import { FancyLinkTwigContext } from '@components/Atom/Link/FancyLink/FancyLink.stories';

const StateLicensureBlockPureComponent = (
  twigContext: StateLicensureBlockTwigContext
) => StateLicensureBlockTemplate(twigContext);

export type StateLicensureBlockTwigContext = {
  id?: string;
  verticalRhythm?: string;
  heading?: HeadingTwigContext;
  items: {
    heading?: HeadingTwigContext;
    editorial?: EditorialTwigContext;
    sections?: {
      heading?: HeadingTwigContext;
      linkAndEditorials?: {
        fancyLink?: FancyLinkTwigContext;
        editorial?: EditorialTwigContext;
      }[];
      fancyLink?: FancyLinkTwigContext;
    }[];
  }[];
};

const meta: Meta = {
  title: 'Organism/State Licensure Block',
  excludeStories: ['StateLicensureBlock'],
};

export default meta;

export const StateLicensureBlockStory: Story<StateLicensureBlockArgs> = {
  name: 'State Licensure Block',

  parameters: {
    render: ({ id, verticalRhythm, heading, items }) => {
      heading =
        heading ||
        defaultHeading({
          ...Heading.args,
          headline: 'Washington State Licensure and Information',
        });

      items = items || [
        {
          heading: defaultHeading({
            ...Heading.args,
            headline: 'Meets requirements',
          }),
          editorial: {
            wysiwyg: /* html */ `<p>ODU has determined that completion of the following programs meets educational requirements to apply for a license or endorsement in this state.</p>`,
          },
          sections: [
            {
              heading: defaultHeading({
                ...Heading.args,
                headline: 'Medical Laboratory Specialist',
              }),
              linkAndEditorials: [
                {
                  fancyLink: {
                    link: {
                      url: '#',
                      title: 'Medical Laboratory Science (BSMLS)',
                    },
                  },
                  editorial: {
                    wysiwyg: /* html */ `<p>As far as ODU has been able to determine, this state accepts ASCP Board of Certification credentials and does not have any additional requirements.</p>`,
                  },
                },
              ],
              fancyLink: {
                link: {
                  url: '#',
                  title:
                    'Learn more about credentials from the ASCP Board of Certification',
                },
              },
            },
            {
              heading: defaultHeading({
                ...Heading.args,
                headline: 'Education',
              }),
              linkAndEditorials: [
                {
                  fancyLink: {
                    link: {
                      url: '#',
                      title:
                        'Elementary Teacher PreK–6 with initial VA licensure (MSEd)',
                    },
                  },
                  editorial: {
                    wysiwyg: /* html */ `<p>Note for students in Washington State from the <a href="#">Student Achievement Council</a>: "Eligibility for initial education certification in Washington is based on completion of a state approved educator preparation program. This program is approved in Virginia and is authorized for field placements in Washington by the Professional Educators Standards Board. Even though you may be residing in Washington while in this program, your application for educator certification in Washington will be processed as an out-of-state application. Go to <a href="#">http://pathway.pesb.wa.gov/archive/outofstate</a> for more information. Teachers are advised to contact their individual school districts as to whether this program may qualify for teacher advancement."</p>`,
                  },
                },
                {
                  fancyLink: {
                    link: {
                      url: '#',
                      title: 'Special Education (BS)',
                    },
                  },
                  editorial: {
                    wysiwyg: /* html */ `<p>Note for students in Washington State from the <a href="#">Student Achievement Council</a>: "Eligibility for initial education certification in Washington is based on completion of a state approved educator preparation program. This program is approved in Virginia and is authorized for field placements in Washington by the Professional Educators Standards Board. Even though you may be residing in Washington while in this program, your application for educator certification in Washington will be processed as an out-of-state application. Go to <a href="#">http://pathway.pesb.wa.gov/archive/outofstate</a> for more information. Teachers are advised to contact their individual school districts as to whether this program may qualify for teacher advancement."</p>`,
                  },
                },
                {
                  fancyLink: {
                    link: {
                      url: '#',
                      title: 'Special Education - VA Licensure (MSEd)',
                    },
                  },
                  editorial: {
                    wysiwyg: /* html */ `<p>Note for students in Washington State from the <a href="#">Student Achievement Council</a>: "Eligibility for initial education certification in Washington is based on completion of a state approved educator preparation program. This program is approved in Virginia and is authorized for field placements in Washington by the Professional Educators Standards Board. Even though you may be residing in Washington while in this program, your application for educator certification in Washington will be processed as an out-of-state application. Go to <a href="#">http://pathway.pesb.wa.gov/archive/outofstate</a> for more information. Teachers are advised to contact their individual school districts as to whether this program may qualify for teacher advancement."</p>`,
                  },
                },
              ],
              fancyLink: {
                link: {
                  url: '#',
                  title:
                    'Washington State Professional Educator Standards Board',
                },
              },
            },
            {
              heading: defaultHeading({
                ...Heading.args,
                headline: 'Engineering',
              }),
              linkAndEditorials: [
                {
                  fancyLink: {
                    link: {
                      url: '#',
                      title: 'Civil Engineering Technology (BSET)',
                    },
                  },
                },
                {
                  fancyLink: {
                    link: {
                      url: '#',
                      title:
                        'Communications Systems Technology (Electrical Engineering Technology) (BSET)',
                    },
                  },
                },
                {
                  fancyLink: {
                    link: {
                      url: '#',
                      title:
                        'Computer Engineering Technology (Electrical Engineering Technology) (BSET)',
                    },
                  },
                },
              ],
              fancyLink: {
                link: {
                  url: '#',
                  title:
                    'Washington Board of Registration for Engineers and Land Surveyors',
                },
              },
            },
          ],
        },
        {
          heading: defaultHeading({
            ...Heading.args,
            headline: 'Does not meet requirements',
          }),
          editorial: {
            wysiwyg: /* html */ `<p>ODU has determined that the following programs do not meet educational requirements to apply for a license or endorsement in this state.</p>`,
          },
          sections: [
            {
              heading: defaultHeading({
                ...Heading.args,
                headline: 'Nursing',
              }),
              linkAndEditorials: [
                {
                  fancyLink: {
                    link: {
                      url: '#',
                      title: 'Adult-Gerontology CNS Post-Professional (Cert)',
                    },
                  },
                },
                {
                  fancyLink: {
                    link: {
                      url: '#',
                      title:
                        'Family Nurse Practitioner Post-Professional (Cert)',
                    },
                  },
                },
                {
                  fancyLink: {
                    link: {
                      url: '#',
                      title: 'Adult-Gerontology CNS Post-Professional (Cert)',
                    },
                  },
                },
                {
                  fancyLink: {
                    link: {
                      url: '#',
                      title:
                        'Family Nurse Practitioner Post-Professional (Cert)',
                    },
                  },
                },
                {
                  fancyLink: {
                    link: {
                      url: '#',
                      title: 'Adult-Gerontology CNS Post-Professional (Cert)',
                    },
                  },
                },
                {
                  fancyLink: {
                    link: {
                      url: '#',
                      title:
                        'Family Nurse Practitioner Post-Professional (Cert)',
                    },
                  },
                },
                {
                  fancyLink: {
                    link: {
                      url: '#',
                      title: 'Adult-Gerontology CNS Post-Professional (Cert)',
                    },
                  },
                },
                {
                  fancyLink: {
                    link: {
                      url: '#',
                      title:
                        'Family Nurse Practitioner Post-Professional (Cert)',
                    },
                  },
                },
                {
                  fancyLink: {
                    link: {
                      url: '#',
                      title: 'Adult-Gerontology CNS Post-Professional (Cert)',
                    },
                  },
                },
                {
                  fancyLink: {
                    link: {
                      url: '#',
                      title:
                        'Family Nurse Practitioner Post-Professional (Cert)',
                    },
                  },
                },
              ],
              fancyLink: {
                link: {
                  url: '#',
                  title:
                    'Washington State Department of Health - Nursing Commission',
                },
              },
            },
            {
              heading: defaultHeading({
                ...Heading.args,
                headline: 'Education',
              }),
              linkAndEditorials: [
                {
                  fancyLink: {
                    link: {
                      url: '#',
                      title: 'Educational Leadership with Licensure (EdS)',
                    },
                  },
                },
                {
                  fancyLink: {
                    link: {
                      url: '#',
                      title:
                        'Elementary Education - PreK-6 Post Baccalaureate Endorsement (End/Lic)',
                    },
                  },
                },
              ],
              fancyLink: {
                link: {
                  url: '#',
                  title:
                    'Washington State Professional Educator Standards Board',
                },
              },
            },
          ],
        },
        {
          heading: defaultHeading({
            ...Heading.args,
            headline: 'Undetermined',
          }),
          editorial: {
            wysiwyg: /* html */ `<p>ODU has not determined whether completion of the following programs meets educational requirements to apply for a license or endorsement in this state.</p>`,
          },
          sections: [
            {
              heading: defaultHeading({
                ...Heading.args,
                headline: 'Education',
              }),
              linkAndEditorials: [
                {
                  fancyLink: {
                    link: {
                      url: '#',
                      title:
                        'Educational Leadership - Admin. and Supervision K-12 (MSEd)',
                    },
                  },
                },
                {
                  fancyLink: {
                    link: {
                      url: '#',
                      title: 'Elementary Education (BS)',
                    },
                  },
                  editorial: {
                    wysiwyg: /* html */ `<p>Note from the Washington <a href="#">Student Achievement Council</a>: "This program is not intended to lead to teacher certification. Teachers are advised to contact their individual school districts as to whether this program may qualify for teacher advancement."</p>`,
                  },
                },

                {
                  fancyLink: {
                    link: {
                      url: '#',
                      title: 'Library & Information Studies (MLIS)',
                    },
                  },
                },
                {
                  fancyLink: {
                    link: {
                      url: '#',
                      title:
                        'Library & Information Studies - School Librarianship (MLIS)',
                    },
                  },
                },
              ],
              fancyLink: {
                link: {
                  url: '#',
                  title:
                    'Washington State Professional Educator Standards Board',
                },
              },
            },
            {
              heading: defaultHeading({
                ...Heading.args,
                headline: 'Substance Abuse Counseling',
              }),
              linkAndEditorials: [
                {
                  fancyLink: {
                    link: {
                      url: '#',
                      title: 'Addiction Prevention and Treatment (Cert)',
                    },
                  },
                },
                {
                  fancyLink: {
                    link: {
                      url: '#',
                      title: 'Human Services (BS)',
                    },
                  },
                },
              ],
              fancyLink: {
                link: {
                  url: '#',
                  title: 'Washington State Department of Health',
                },
              },
            },
          ],
        },
      ];

      return StateLicensureBlockPureComponent({
        id,
        verticalRhythm,
        heading,
        items,
      });
    },
  },

  args: {},
};

type StateLicensureBlockArgs = Partial<StateLicensureBlockTwigContext> & {
  foo?: never;
};

export const StateLicensureBlock = makeComponentInjector({
  pureComponent: StateLicensureBlockPureComponent,
  storyRenderFn: StateLicensureBlockStory.parameters.render,
  defaultArgs: StateLicensureBlockStory.args,
});
