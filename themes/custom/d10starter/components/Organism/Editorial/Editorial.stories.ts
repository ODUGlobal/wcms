import makeComponentInjector from '@components/_ts-helpers/make-component-injector';
import { Story, Meta } from '@components/_ts-helpers/types';

import EditorialTemplate from './Editorial.twig';

const EditorialPureComponent = (twigContext: EditorialTwigContext) =>
  EditorialTemplate(twigContext);

export type EditorialTwigContext = {
  wysiwyg: string;
  extraClasses?: string;
  /** To override default (empty) vertical-rhythm classes (outermost vertical-margins). */
  verticalRhythm?: string;
  /** To override default `max-w-4xl` (e.g., with a `container` or `conditional-container` class). */
  containerClasses?: string;
  /** To override default `max-w-4xl` with `max-w-none`. */
  noMaxWidth?: boolean;
  /** If `true`, will use the `prose-subsup` modifier to use the active theme's `subsup` color. */
  subsup?: string;
  /** If `true`, will suppress `<br>` tags in the `wysiwyg` (with `display: none`). */
  hideBr?: boolean;
};

const meta: Meta = {
  title: 'Organism/Editorial',
  excludeStories: ['Editorial', 'defaultWysiwyg', 'defaultEditorial'],
  decorators: [
    (story) =>
      /* html */ `<div class="container py-vertical-space">${String(
        story()
      )}</div>`,
  ],
};

export default meta;

export const defaultEditorial = {
  wysiwyg: /* html */ `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lacus neque, luctus sit amet erat quis, vestibulum tempor ligula. Etiam varius turpis aliquam purus pharetra tincidunt. In ac odio semper, volutpat metus in, mattis ante. Sed a dignissim urna.</p>`,
};

export const defaultWysiwyg = /* html */ `
  <p class="lead">Until now, trying to style an article, document, or blog post with Tailwind has been a tedious task that required a keen eye for typography and a lot of complex custom CSS.</p>

  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pellentesque mauris consectetur, mollis risus vel, vehicula nibh. Aliquam hendrerit arcu erat. Etiam dignissim magna velit, non aliquet dolor facilisis vitae. Proin blandit eros sed ante posuere venenatis. Duis ac ipsum consequat, molestie magna at, volutpat nulla. Sed vulputate posuere orci, eu suscipit sem sollicitudin vel. Curabitur ac quam rutrum, tempor augue quis, dictum ligula. Curabitur eu erat nec velit fermentum finibus sed quis ante.</p>
  <p>Etiam eget nibh ultricies, ultrices dui nec, volutpat ligula. Etiam in nibh eu orci auctor vestibulum. Quisque nec laoreet ex. Nunc urna nibh, dignissim at libero ut, imperdiet sagittis ex. Phasellus tristique volutpat justo a fermentum. Morbi id velit fringilla, ultrices purus vitae, tempus diam. Duis sagittis porta arcu. Sed et porttitor massa, at viverra nisi. Nunc vulputate dictum felis id feugiat. Sed sit amet bibendum lacus, sit amet sollicitudin ante. Quisque fermentum tellus diam, maximus porta velit vehicula eget. Ut eros arcu, pretium non libero ut, interdum ullamcorper eros. Vivamus ut varius eros. Donec non eros placerat ipsum aliquet pretium vel eget odio. Proin non fermentum sapien.</p>

  <p>Here is an <code>a.fancy</code> (wrapped in a <code>&lt;p&gt;</code>-tag):</p>
  <p><a href="#" class="fancy">I am the aforementioned fancy-link.</a></p>

  <p>And here is an <code>a.button</code> (wrapped in a <code>&lt;p&gt;</code>-tag):</p>
  <p><a href="#" class="button">I am the aforementioned button-link.</a></p>

  <p>And here is an <code>a.button.ghost</code> (wrapped in a <code>&lt;p&gt;</code>-tag):</p>
  <p><a href="#" class="button ghost">I am the aforementioned "ghost" button-link.</a></p>

  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu nisi non felis aliquet scelerisque. Nam aliquet, ex id rutrum fermentum, quam ligula condimentum leo, non lacinia odio elit non ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aenean enim nisl, consectetur ut enim non, volutpat aliquet nisi. Ut eget hendrerit est. Donec nunc nisl, porta vitae imperdiet quis, accumsan ac ex. Integer molestie auctor dui sed tristique. Praesent placerat pulvinar lorem in tempus. Nam sit amet sem hendrerit, tristique lacus in, condimentum risus. Suspendisse at aliquam ipsum. Etiam pellentesque urna in lorem laoreet, quis condimentum eros pulvinar. Suspendisse faucibus mollis dignissim. Sed eu feugiat leo. Cras vitae sapien facilisis, volutpat erat eu, rutrum lectus. Fusce porta lorem eu orci maximus, pulvinar dictum turpis blandit. Nunc accumsan accumsan lacus nec venenatis.</p>

  <p>Nulla quis ex lectus. Aliquam a dapibus felis. Fusce egestas eu quam eget efficitur. Mauris quis nulla eget odio iaculis euismod vel molestie tortor. Praesent tortor nulla, egestas sit amet nibh at, lacinia imperdiet neque. Fusce sit amet augue lobortis quam varius ultricies. Sed ornare scelerisque dui.</p>

  <p>Duis vel ex vitae velit pharetra porttitor sit amet ac purus. Vivamus imperdiet metus ipsum, quis finibus sem mollis et. Quisque in mi sit amet odio vehicula ornare sed et purus. Cras sagittis erat placerat diam consectetur dapibus. Nulla at arcu ut ante accumsan pretium. Duis nec accumsan tortor. Integer venenatis aliquet odio nec sodales. Suspendisse aliquet id nisl in euismod.</p>
  <p>We even included table styles, check it out:</p>
  <table>
    <caption>Table caption</caption>
    <thead>
      <tr>
        <th>Wrestler</th>
        <th>Origin</th>
        <th>Finisher</th>
        <th>Another Column</th>
        <th>And Yet Another</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="">Bret "The Hitman" Hart</a></td>
        <td>Calgary, AB</td>
        <td>Sharpshooter</td>
        <td>Another cell here, maybe with some more text than others, plus a looooooooooooooooong word</td>
        <td>Yadda yadda yadda</td>
      </tr>
      <tr>
        <td>Stone Cold Steeeeeeeeeeeeeeeve Austin</td>
        <td>Austin, TX and some loooooooonger words</td>
        <td>Stone Cold Stunner</td>
        <td>Another cell here, maybe with some more text than others, and maybe even some more than that!</td>
        <td>Weeeeeeeeeeeeeeee are the champions, my friend, and we'll keep on fighting till the end. We need to create some horizontal-overflow in this table.</td>
      </tr>
      <tr>
        <td>Randy Savage</td>
        <td>Sarasota, FL</td>
        <td>Elbow Drop</td>
        <td>Another cell here, maybe with some more text than others</td>
        <td>Yadda yadda yadda</td>
      </tr>
      <tr>
        <td>Vader</td>
        <td>Boulder, CO</td>
        <td>Vader Bomb</td>
        <td>Another cell here, maybe with some more text than others, and maybe even some more than that!</td>
        <td>We are the champions</td>
      </tr>
      <tr>
        <td>Razor Ramon</td>
        <td>Chuluota, FL</td>
        <td>Razor's Edge</td>
        <td>Another cell here, maybe with some more text than others</td>
        <td>Yadda yadda yadda</td>
      </tr>
    </tbody>
  </table>
  <p>Here is a <code>table.striped</code>:</p>
  <table class="striped">
    <caption>Table caption</caption>
    <thead>
      <tr>
        <th>Wrestler</th>
        <th>Origin</th>
        <th>Finisher</th>
        <th>Another Column</th>
        <th>And Yet Another</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="">Bret "The Hitman" Hart</a></td>
        <td>Calgary, AB</td>
        <td>Sharpshooter</td>
        <td>Another cell here, maybe with some more text than others, plus a looooooooooooooooong word</td>
        <td>Yadda yadda yadda</td>
      </tr>
      <tr>
        <td>Stone Cold Steeeeeeeeeeeeeeeve Austin</td>
        <td>Austin, TX and some loooooooonger words</td>
        <td>Stone Cold Stunner</td>
        <td>Another cell here, maybe with some more text than others, and maybe even some more than that!</td>
        <td>Weeeeeeeeeeeeeeee are the champions, my friend, and we'll keep on fighting till the end. We need to create some horizontal-overflow in this table.</td>
      </tr>
      <tr>
        <td>Randy Savage</td>
        <td>Sarasota, FL</td>
        <td>Elbow Drop</td>
        <td>Another cell here, maybe with some more text than others</td>
        <td>Yadda yadda yadda</td>
      </tr>
      <tr>
        <td>Vader</td>
        <td>Boulder, CO</td>
        <td>Vader Bomb</td>
        <td>Another cell here, maybe with some more text than others, and maybe even some more than that!</td>
        <td>We are the champions</td>
      </tr>
      <tr>
        <td>Razor Ramon</td>
        <td>Chuluota, FL</td>
        <td>Razor's Edge</td>
        <td>Another cell here, maybe with some more text than others</td>
        <td>Yadda yadda yadda</td>
      </tr>
    </tbody>
  </table>
  <p>By default, Tailwind removes all of the default browser styling from paragraphs, headings, lists and more. This ends up being really useful for building application UIs because you spend less time undoing user-agent styles, but when you <em>really are</em> just trying to style some content that came from a rich-text editor in a CMS or a markdown file, it can be surprising and unintuitive.</p>
  <p>We get lots of complaints about it actually, with people regularly asking us things like:</p>
  <blockquote>
    <p>Why is Tailwind removing the default styles on my <code>h1</code> elements? How do I disable this? What do you mean I lose all the other base styles too?</p>
  </blockquote>
  <p>We hear you, but we're not convinced that simply disabling our base styles is what you really want. You don't want to have to remove annoying margins every time you use a <code>p</code> element in a piece of your dashboard UI. And I doubt you really want your blog posts to use the user-agent styles either — you want them to look <em>awesome</em>, not awful.</p>
  <p>The <code>@tailwindcss/typography</code> plugin is our attempt to give you what you <em>actually</em> want, without any of the downsides of doing something stupid like disabling our base styles.</p>
  <p>It adds a new <code>prose</code> class that you can slap on any block of vanilla HTML content and turn it into a beautiful, well-formatted document:</p>
  <pre><code class="language-html">&lt;article class="prose"&gt;
  &lt;h1&gt;Garlic bread with cheese: What the science tells us&lt;/h1&gt;
  &lt;p&gt;
    For years parents have espoused the health benefits of eating garlic bread with cheese to their
    children, with the food earning such an iconic status in our culture that kids will often dress
    up as warm, cheesy loaf for Halloween.
  &lt;/p&gt;
  &lt;p&gt;
    But a recent study shows that the celebrated appetizer may be linked to a series of rabies cases
    springing up around the country.
  &lt;/p&gt;
  &lt;!-- ... --&gt;
&lt;/article&gt;</code></pre>
  <p>For more information about how to use the plugin and the features it includes, <a href="https://github.com/tailwindcss/typography/blob/master/README.md">read the documentation</a>.</p>
  <hr />
  <h2>What to expect from here on out</h2>
  <p>What follows from here is just a bunch of absolute nonsense I've written to dogfood the plugin itself. It includes every sensible typographic element I could think of, like <strong>bold text</strong>, unordered lists, ordered lists, code blocks, block quotes, <em>and even italics</em>.</p>
  <p>It's important to cover all of these use cases for a few reasons:</p>
  <ol>
    <li>We want everything to look good out of the box.</li>
    <li>Really just the first reason, that's the whole point of the plugin.</li>
    <li>Here's a third pretend reason though a list with three items looks more realistic than a list with two items.</li>
  </ol>
  <p>Now we're going to try out another header style.</p>
  <h3>Typography should be easy</h3>
  <p>So that's a header for you — with any luck if we've done our job correctly that will look pretty reasonable.</p>
  <p>Something a wise person once told me about typography is:</p>
  <blockquote><p>Typography is pretty important if you don't want your stuff to look like trash. Make it good then it won't be bad.</p></blockquote>
  <p>It's probably important that images look okay here by default as well:</p>
  <figure>
    <img src="https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1000&amp;q=80" alt="" />
    <figcaption>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.</figcaption>
  </figure>
  <p>Now I'm going to show you an example of an unordered list to make sure that looks good, too:</p>
  <ul>
    <li>So here is the first item in this list.</li>
    <li>In this example we're keeping the items short.</li>
    <li>Later, we'll use longer, more complex list items.</li>
  </ul>
  <p>And that's the end of this section.</p>
  <h2>What if we stack headings?</h2>
  <h3>We should make sure that looks good, too.</h3>
  <p>Sometimes you have headings directly underneath each other. In those cases you often have to undo the top margin on the second heading because it usually looks better for the headings to be closer together than a paragraph followed by a heading should be.</p>
  <h3>When a heading comes after a paragraph …</h3>
  <p>When a heading comes after a paragraph, we need a bit more space, like I already mentioned above. Now let's see what a more complex list would look like.</p>
  <ul>
    <li>
      <p><strong>I often do this thing where list items have headings.</strong></p>
      <p>For some reason I think this looks cool which is unfortunate because it's pretty annoying to get the styles right.</p>
      <p>I often have two or three paragraphs in these list items, too, so the hard part is getting the spacing between the paragraphs, list item heading, and separate list items to all make sense. Pretty tough honestly, you could make a strong argument that you just shouldn't write this way.</p>
    </li>
    <li>
      <p><strong>Since this is a list, I need at least two items.</strong></p>
      <p>I explained what I'm doing already in the previous list item, but a list wouldn't be a list if it only had one item, and we really want this to look realistic. That's why I've added this second list item so I actually have something to look at when writing the styles.</p>
    </li>
    <li>
      <p><strong>It's not a bad idea to add a third item either.</strong></p>
      <p>I think it probably would've been fine to just use two items but three is definitely not worse, and since I seem to be having no trouble making up arbitrary things to type, I might as well include it.</p>
    </li>
  </ul>
  <p>After this sort of list I usually have a closing statement or paragraph, because it kinda looks weird jumping right to a heading.</p>
  <h2>Code should look okay by default.</h2>
  <p>I think most people are going to use <a href="https://highlightjs.org/">highlight.js</a> or <a href="https://prismjs.com/">Prism</a> or something if they want to style their code blocks but it wouldn't hurt to make them look <em>okay</em> out of the box, even with no syntax highlighting.</p>
  <p>Here's what a default <code>tailwind.config.js</code> file looks like at the time of writing:</p>
  <pre><code class="language-js">module.exports = {
  purge: [],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
}</code></pre>
  <p>Hopefully that looks good enough to you.</p>
  <h3>What about nested lists?</h3>
  <p>Nested lists basically always look bad which is why editors like Medium don't even let you do it, but I guess since some of you goofballs are going to do it we have to carry the burden of at least making it work.</p>
  <ol>
    <li>
      <strong>Nested lists are rarely a good idea.</strong>
      <ul>
        <li>You might feel like you are being really "organized" or something but you are just creating a gross shape on the screen that is hard to read.</li>
        <li>Nested navigation in UIs is a bad idea too, keep things as flat as possible.</li>
        <li>Nesting tons of folders in your source code is also not helpful.</li>
      </ul>
    </li>
    <li>
      <strong>Since we need to have more items, here's another one.</strong>
      <ul>
        <li>I'm not sure if we'll bother styling more than two levels deep.</li>
        <li>Two is already too much, three is guaranteed to be a bad idea.</li>
        <li>If you nest four levels deep you belong in prison.</li>
      </ul>
    </li>
    <li>
      <strong>Two items isn't really a list, three is good though.</strong>
      <ul>
        <li>Again please don't nest lists if you want people to actually read your content.</li>
        <li>Nobody wants to look at this.</li>
        <li>I'm upset that we even have to bother styling this.</li>
      </ul>
    </li>
  </ol>
  <p>The most annoying thing about lists in Markdown is that <code>&lt;li&gt;</code> elements aren't given a child <code>&lt;p&gt;</code> tag unless there are multiple paragraphs in the list item. That means I have to worry about styling that annoying situation too.</p>
  <ul>
    <li>
      <p><strong>For example, here's another nested list.</strong></p>
      <p>But this time with a second paragraph.</p>
      <ul>
        <li>These list items won't have <code>&lt;p&gt;</code> tags</li>
        <li>Because they are only one line each</li>
      </ul>
    </li>
    <li>
      <p><strong>But in this second top-level list item, they will.</strong></p>
      <p>This is especially annoying because of the spacing on this paragraph.</p>
      <ul>
        <li>
          <p>As you can see here, because I've added a second line, this list item now has a <code>&lt;p&gt;</code> tag.</p>
          <p>This is the second line I'm talking about by the way.</p>
        </li>
        <li><p>Finally here's another list item so it's more like a list.</p></li>
      </ul>
    </li>
    <li><p>A closing list item, but with no nested list, because why not?</p></li>
  </ul>
  <p>And finally a sentence to close off this section.</p>
  <h2>There are other elements we need to style</h2>
  <p>I almost forgot to mention links, like <a href="https://tailwindcss.com">this link to the Tailwind CSS website</a>. We almost made them blue but that's so yesterday, so we went with dark gray, feels edgier.</p>
  <p>We also need to make sure inline code looks good, like if I wanted to talk about <code>&lt;span&gt;</code> elements or tell you the good news about <code>@tailwindcss/typography</code>.</p>
  <h3>Sometimes I even use <code>code</code> in headings</h3>
  <p>Even though it's probably a bad idea, and historically I've had a hard time making it look good. This <em>"wrap the code blocks in backticks"</em> trick works pretty well though really.</p>
  <p>
    Another thing I've done in the past is put a <code>code</code> tag inside of a link, like if I wanted to tell you about the <a href="https://github.com/tailwindcss/docs"><code>tailwindcss/docs</code></a> repository. I don't love that there is an underline below the backticks but it is absolutely not worth the madness it would require to avoid it.
  </p>
  <h4>We haven't used an <code>h4</code> yet</h4>
  <p>But now we have. Please don't use <code>h5</code> or <code>h6</code> in your content, Medium only supports two heading levels for a reason, you animals. I honestly considered using a <code>before</code> pseudo-element to scream at you if you use an <code>h5</code> or <code>h6</code>.</p>
  <p class="line-through">We don't style them at all out of the box because <code>h4</code> elements are already so small that they are the same size as the body copy. What are we supposed to do with an <code>h5</code>, make it <em>smaller</em> than the body copy? No thanks.</p>
  <p>The <code>h5</code> and <code>h6</code> are available, but they look just like <code>h4</code>.</p>
  <h3>We still need to think about stacked headings though.</h3>
  <h4>Let's make sure we don't screw that up with <code>h4</code> elements, either.</h4>
  <p>Phew, with any luck we have styled the headings above this text and they look pretty good. A few more:</p>
  <h4>This is an h4.</h4>
  <h5>This is an h5.</h5>
  <h6>This is an h6.</h6>
  <p>Let's add a closing paragraph here so things end with a decently sized block of text. I can't explain why I want things to end that way but I have to assume it's because I think things will look weird or unbalanced if there is a heading too close to the end of the document.</p>
  <p>What I've written here is probably long enough, but adding this final sentence can't hurt.</p>
`;

export const EditorialStory: Story<EditorialArgs> = {
  name: 'Editorial',

  parameters: {
    render: async ({
      wysiwyg,
      extraClasses,
      verticalRhythm,
      containerClasses,
      noMaxWidth,
      subsup,
      hideBr,
    }) => {
      wysiwyg = wysiwyg || EditorialStory.args.wysiwyg!;
      return EditorialPureComponent({
        wysiwyg,
        extraClasses,
        verticalRhythm,
        containerClasses,
        noMaxWidth,
        subsup,
        hideBr,
      });
    },
  },

  args: {
    wysiwyg: defaultWysiwyg,
  },
};

type EditorialArgs = Partial<EditorialTwigContext> & {
  foo?: never;
};

export const Editorial = makeComponentInjector({
  pureComponent: EditorialPureComponent,
  storyRenderFn: EditorialStory.parameters.render,
  defaultArgs: EditorialStory.args,
});
