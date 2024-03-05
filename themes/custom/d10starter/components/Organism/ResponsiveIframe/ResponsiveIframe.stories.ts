import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import ResponsiveIframeTemplate from './ResponsiveIframe.twig';

const ResponsiveIframePureComponent = (
  twigContext: ResponsiveIframeTwigContext
) => ResponsiveIframeTemplate(twigContext);

export type ResponsiveIframeTwigContext = {
  /**
   * This will be used as the main content of the iframe's `srcdoc` (i.e., its markup).
   * The Twig file will supply the rest of what's needed, including `<script>`
   * tags that configure the iframe to be responsive.
   */
  srcdocBody: string;
  /**
   * For the iframe's `title` attribute and also the `<title>` inside the iframe's `<head>`.
   * Required for accessibility reasons.
   */
  title: string;
  /**
   * DOM id for iframe-wrapper. Required for the responsive-iframe mechanism to work,
   * but if not provided then the Twig template will generate one from the title and a random number.
   */
  id?: string;
};

const meta: Meta = {
  title: 'Organism/Responsive Iframe',
  excludeStories: ['ResponsiveIframe'],
};

export default meta;

export const ResponsiveIframeStory: Story<ResponsiveIframeArgs> = {
  name: 'Responsive Iframe',

  parameters: {
    render: ({ id, srcdocBody, title }) => {
      title = title || 'Iframe must have a title.';

      srcdocBody =
        srcdocBody ||
        /* html */ `
          <div style="background-color: lightgray; padding: 2rem; display: flex; justify-content: center;">
            <div style="font-size: 24px; line-height: 1.5; max-width: 60ch;">
              <p>I am a responsive iframe. Resize the window and watch my height adjust to match the height of my content.</p>
              <p>My height also automatically adjusts to match the height of my content once every 500 milliseconds, in case my content's height itself has changed. This way, we're covered even if my content is dynamic.</p>
            </div>
          </div>
        `;

      return ResponsiveIframePureComponent({
        id,
        srcdocBody,
        title,
      });
    },
  },

  args: {},

  decorators: [
    (story) => /* html */ `
      <div class="vertical-rhythm-standard">
        <div class="conditional-container">
          <div class="space-y-vertical-space">
            <div>Stuff above iframe.</div>
            <div>${story()}</div>
            <div>Stuff below iframe.</div>
          </div>
        </div>
      </div>
    `,
  ],
};

type ResponsiveIframeArgs = Partial<ResponsiveIframeTwigContext> & {
  foo?: never;
};

export const ResponsiveIframe = makeComponentInjector({
  pureComponent: ResponsiveIframePureComponent,
  storyRenderFn: ResponsiveIframeStory.parameters.render,
  defaultArgs: ResponsiveIframeStory.args,
});
