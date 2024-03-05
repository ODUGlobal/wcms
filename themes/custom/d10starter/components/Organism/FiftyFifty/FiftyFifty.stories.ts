import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import FiftyFiftyTemplate from './FiftyFifty.twig';
import { EditorialTwigContext } from '../Editorial/Editorial.stories';
import {
  Figure,
  FigureTwigContext,
  defaultFigure,
} from '@components/Atom/Media/Figure/Figure.stories';
import {
  Picture,
  PictureTwigContext,
  defaultPicture,
} from '@components/Atom/Media/Picture/Picture.stories';
import {
  Video,
  VideoTwigContext,
  defaultVideo,
} from '@components/Atom/Media/Video/Video.stories';
import Theme from '@components/_ts-helpers/theme';
import { ButtonLink } from '@components/Atom/Link/ButtonLink/ButtonLink.stories';
import {
  NoImageRoutingBlock,
  NoImageRoutingBlockTwigContext,
  defaultNoImageRoutingBlock,
} from '@components/Molecule/NoImageRoutingBlock/NoImageRoutingBlock.stories';
import {
  CostBlocks,
  CostBlocksTwigContext,
  defaultCostBlocks,
} from '@components/Molecule/CostBlocks/CostBlocks.stories';
import { Form, FormTwigContext, defaultForm } from '../Form/Form.stories';
import {
  Heading,
  HeadingTwigContext,
  defaultHeading,
} from '@components/Atom/Heading/Heading.stories';

const themeOptions = [
  null,
  Theme.Default,
  Theme.Neutral50,
  Theme.MidBlue500,
] as const;

const halfOptions = [
  'editorial',
  'picture',
  'video',
  'picture-figure',
  'video-figure',
  'no-image-routing-block',
  'cost-blocks',
  'form',
] as const;

const FiftyFiftyPureComponent = (twigContext: FiftyFiftyTwigContext) =>
  FiftyFiftyTemplate(twigContext);

export type FiftyFiftyTwigContext = {
  theme?: (typeof themeOptions)[number];
  id?: string;
  verticalRhythm?: string;
  /** If it's a video/picture, the image should be at least 720px. */
  firstHalf: FiftyFiftyHalf;
  /** Must match type of `firstHalf` (so that the Twig template knows what to `include`). */
  firstHalfType: (typeof halfOptions)[number];
  /** If it's a video/picture, the image should be at least 720px. */
  secondHalf: FiftyFiftyHalf;
  /** Must match type of `secondHalf` (so that the Twig template knows what to `include`). */
  secondHalfType: (typeof halfOptions)[number];
};

type FiftyFiftyHalf =
  | { editorial: EditorialTwigContext; heading?: HeadingTwigContext }
  | { picture: InjectedComponent<typeof Picture> }
  | { video: InjectedComponent<typeof Video> }
  | { figure: InjectedComponent<typeof Figure> }
  | { noImageRoutingBlock: NoImageRoutingBlockTwigContext }
  | { costBlocks: CostBlocksTwigContext }
  | { form: FormTwigContext };

const meta: Meta = {
  title: 'Organism/Fifty Fifty',
  excludeStories: ['FiftyFifty', 'defaultFiftyFifty'],
};

export default meta;

const defaultFiftyFiftyEditorial = {
  wysiwyg: /* html */ `
    <p><strong>Total Credit Hours: 120</strong></p>
    <p>To earn this degree from ODU, you must complete at least 30 credit hours with us.</p>
    <p>Talk with an enrollment coordinator to determine how your credits will transfer. The curriculum sheet can serve as a guide for planning your course of study.</p>
    <h3>Sample Classes</h3>
    <ul>
      <li><a href="#">Principles of Financial Accounting</a></li>
      <li><a href="#">Principles of Managerial Accounting</a></li>
      <li><a href="#">International and Advanced Accounting</a></li>
      <li><a href="#">Principles of Financial Accounting</a></li>
      <li><a href="#">Principles of Managerial Accounting</a></li>
      <li><a href="#">International and Advanced Accounting</a></li>
    </ul>
    <div class="wysiwyg-embed tw-align-none">
      ${await ButtonLink({
        ...ButtonLink.args,
        title: 'Accounting Program Sample Curriculum',
      })()}
    </div>
  `,
};

const defaultHalf = (
  halfOption?: (typeof halfOptions)[number]
): FiftyFiftyHalf => {
  switch (halfOption) {
    case 'picture':
      return { picture: Picture() };
    case 'video':
      return { video: Video() };
    case 'picture-figure':
      return { figure: Figure() };
    case 'video-figure':
      return { figure: Figure({ ...Figure.args, type: 'video' }) };
    case 'no-image-routing-block':
      return {
        noImageRoutingBlock: defaultNoImageRoutingBlock({
          ...NoImageRoutingBlock.args,
          headline: 'Top Job Titles',
          superhead: 'Outcomes',
          withSubhead: false,
          withIcon: false,
          withFancyLinks: false,
          editorial: {
            wysiwyg: /* html */ `<p>Our alumni go on to do great things. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lacus neque, luctus sit amet erat quis, vestibulum tempor ligula.</p>`,
          },
          buttonLinkList: {
            buttonLinks: [
              {
                link: { title: 'See more Alumni Outcomes', url: '#' },
              },
            ],
          },
        }),
      };
    case 'cost-blocks':
      return { costBlocks: defaultCostBlocks(CostBlocks.args) };
    case 'form':
      return {
        form: defaultForm({
          ...Form.args,
          theme: Theme.LightBlue100,
          withEditorial: false,
          headline: 'Want to learn more?',
        }),
      };
    default:
      return {
        editorial: defaultFiftyFiftyEditorial,
        heading: defaultHeading({
          ...Heading.args,
          headline: 'Required Courses',
        }),
      };
  }
};

export const defaultFiftyFifty = ({
  firstHalf,
  firstHalfType,
  secondHalf,
  secondHalfType,
  theme,
  id,
  verticalRhythm,
}: FiftyFiftyArgs): FiftyFiftyTwigContext => {
  firstHalfType = firstHalfType || halfOptions[0];
  firstHalf = firstHalf || defaultHalf(firstHalfType);

  secondHalfType = secondHalfType || halfOptions[1];
  secondHalf = secondHalf || defaultHalf(secondHalfType);

  return {
    firstHalf,
    firstHalfType,
    secondHalf,
    secondHalfType,
    theme,
    id,
    verticalRhythm,
  };
};

export const FiftyFiftyStory: Story<FiftyFiftyArgs> = {
  name: 'Fifty Fifty',

  parameters: {
    render: (args) => FiftyFiftyPureComponent(defaultFiftyFifty(args)),
  },

  args: {
    firstHalfType: halfOptions[0],
    secondHalfType: halfOptions[1],
  },

  argTypes: {
    firstHalfType: {
      options: halfOptions,
      control: {
        type: 'select',
      },
    },
    secondHalfType: {
      options: halfOptions,
      control: {
        type: 'select',
      },
    },
  },
};

type FiftyFiftyArgs = Partial<FiftyFiftyTwigContext>;

export const FiftyFifty = makeComponentInjector({
  pureComponent: FiftyFiftyPureComponent,
  storyRenderFn: FiftyFiftyStory.parameters.render,
  defaultArgs: FiftyFiftyStory.args,
});
