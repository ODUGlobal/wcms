# The Front-End Setup

- [The Front-End Setup](#the-front-end-setup)
  - [Preliminaries](#preliminaries)
  - [The Basics](#the-basics)
    - [Components](#components)
    - [Global Assets](#global-assets)
      - [CSS](#css)
      - [Fonts](#fonts)
      - [Images](#images)
  - [Storybook with Twing and TypeScript](#storybook-with-twing-and-typescript)
    - [Some Background on Twing and Storybook](#some-background-on-twing-and-storybook)
    - [The VS Code Snippet, and an Example](#the-vs-code-snippet-and-an-example)
    - [The Boilerplate Explained](#the-boilerplate-explained)
    - [Direct Injection of One Component into Another](#direct-injection-of-one-component-into-another)
      - [Passing Additional Context to `|inject_template` (Probably Illegal)](#passing-additional-context-to-inject_template-probably-illegal)
    - [Direct Injection of an _Array_ of Components into Another](#direct-injection-of-an-array-of-components-into-another)
    - [Don't Inject a Component as a String (But Top-Level `await` Is Available)](#dont-inject-a-component-as-a-string-but-top-level-await-is-available)
    - [Using `include` or `embed` in Templates](#using-include-or-embed-in-templates)
    - [Making Multiple Stories in a Single `.stories.ts` File](#making-multiple-stories-in-a-single-storiests-file)
    - [Some Tips](#some-tips)
      - [Don't Mutate `.args`](#dont-mutate-args)
      - [Forbid Excess Properties When Calling Pure Component in `.parameters.render()` Body](#forbid-excess-properties-when-calling-pure-component-in-parametersrender-body)
      - [Be Thoughtful about Where You Specify Default Values](#be-thoughtful-about-where-you-specify-default-values)
  - [Important Front-End Mechanisms](#important-front-end-mechanisms)
    - [Themes (Color Schemes)](#themes-color-schemes)
    - [Vertical Rhythm](#vertical-rhythm)
    - [Containers](#containers)
    - [Container Queries](#container-queries)
    - [WYSIWYG Styles and WYSIWYG-Embeds](#wysiwyg-styles-and-wysiwyg-embeds)
    - [Linkify](#linkify)

## Preliminaries

- I highly recommend using VS Code for doing front-end work with this setup, so that you can use the VS Code [snippet](https://code.visualstudio.com/docs/editor/userdefinedsnippets) I've included for quickly making Storybook stories (explained below), and so that you can take advantage of the VS Code extensions recommended in `.vscode/extensions.json`.
- You'll want to `npm install` in this directory. This isn't _strictly_ necessary (because everything runs in the Docker container), but unless you do so you'll see warnings all over the place, and you won't get the benefits of the aforementioned VS Code extensions (one of them is ESLint, which I'm using here _only_ in VS Code, without a linting step in the pipeline or even a linting script in `package.json`; similarly, Prettier is set to format the front-end files on save in VS Code, but there's no formatting script or step in the pipeline).

  Note that the `package.json` in this directory is independent of `docker/bookbinder/package.json`. The former does _nothing_ but improve the developer experience in the ways mentioned in the previous paragraph; the latter is actually functional, and one of the things it's used for is to run Storybook with the code you write in this directory. That being the case, if you find yourself needing to install an npm package in _this_ directory for some reason, you'll almost certainly want the Docker container to have it too, which you can accomplish by editing `docker/bookbinder/package.json` appropriately, running `npm install` or `npm install --package-lock-only` from the `docker/bookbinder` directory, and doing `docker-compose down` / `docker-compose build` / `docker-compose up` from the project root. (The `--package-lock-only` option saves time by skipping the installation in the `docker/bookbinder` directory. The only installation that matters will happen in the Docker container when you run `docker-compose build`.)

## The Basics

When you `docker-compose up` in the project root, Storybook will spin up and become available at `localhost:3000`. Eventually you'll also want to test things in a local Drupal environment. To get that set up, you'll need to use the command line at `localhost:9001`. The commands should be something like `composer install` / `make updatedb`, but the relevant `make` commands won't work until the repository has been configured to pull from a live Drupal instance (probably a task for the back-end developer). You might also need appropriate `GITLAB_API_PRIVATE_TOKEN` and/or `PANTHEON_MACHINE_TOKEN` environmental variables (in your shell config file, I think). Once the local Drupal instance is running, it will be available at `localhost:9000`.

Some of the front-end-related files are located in `docker/bookbinder`, and changes to them will require restarting (and possibly rebuilding) Docker to take effect. You should rarely have to touch those files, but it's worth noting that Storybook's [`main.ts`](https://storybook.js.org/docs/html/configure/overview#configure-your-storybook-project) and [`preview.ts`](https://storybook.js.org/docs/html/configure/overview#configure-story-rendering) are among them.

_This_ directory contains the rest of the front-end-related files, and they'll automatically write to the Docker container as needed on file-save. This allows Storybook to reflect your changes immediately in almost all cases (no reload in browser required). The Docker container is _also_ set up to immediately integrate those changes into the local _Drupal_ environment (`localhost:9000`), though to see your changes there you'll have to reload the page at least, and, depending on what you've changed, possibly do `drush cr` and/or `drush cim` first at `localhost:9001`.

Here is a brief rundown of what's in this directory, followed by more details on some of the items:

- The [`./components/`](#components) directory is where you'll work 99% of the time.
- There are three directories for storing [global assets](#global-assets): `./css/`, `./fonts/`, and `./images/`.
  - The `./css/` directory has the `tailwind.css` file that gets processed by PostCSS. You probably won't need to touch anything in this directory, though you _can_ add additional global CSS files here if you'd like (more on this below).
  - Naturally, the `./fonts/` and `./images/` are for storing font-files and images. We'll go over how they work below.
- The `./storybook-config/` directory has the Tailwind configuration file and an `.html` file that's used in the `<head>` of the Storybook UI. Changes to the Tailwind config take effect immediately; changes to the `.html` file require restarting the Docker container.
- Everything in `./storybook-src/` is imported by Storybook's `preview.ts` and is _only_ relevant to the Storybook environment. You probably won't have to touch anything in there, with two exceptions: in `./storybook-src/images-path.ts`, you'll want to set the `THEMENAME` variable to the name of this directory (if it isn't already); and in `./storybook-src/inject-frontback.ts`, you'll want to set `REPO_NAME` to the name of this repository. (To finish setting up Frontback, you'll also need to do [one more thing](https://gitlab.insidenewcity.com/newcity/dev/-/wikis/bug-tracking#server-setup).)
- If you're not doing Drupal-side work, then you can probably ignore the other top-level folders in this directory (`./src/` and `./templates/`).

### Components

In this setup, "component" means a Twig template that may be accompanied by a JavaScript (or TypeScript) file and/or a CSS file. Here are the important things to know about making components:

- The accompanying "pattern-level" JS/TS/CSS files should reside in the same subdirectory of `./components` as the Twig file and have the same filename. For example, in `./components/Molecule/Teaser/`, you'd probably have a `Teaser.twig` file, and in addition you might have a `Teaser.css` file and also either a `Teaser.js` or `Teaser.ts` file (TypeScript files will be compiled to JavaScript before they hit Storybook or Drupal). You'd have a `Teaser.stories.ts` file, too, for Storybook purposes, but more on that in a bit.
- Pattern-level CSS/JS/TS files are automatically loaded into Storybook, so you should _not_ import them into `.stories.ts` files! Specifically: all CSS files in `./components/` get included in the global `./assets/css/tailwind.css` file (which is loaded into Storybook by `./storybook-src/css-importer.ts`), and all pattern-level JS/TS files are handled by `./storybook-src/script-runner.ts`.
- For the aforementioned `script-runner.ts` to do its job, each pattern-level JS/TS file must be structured something like this:
  ```javascript
  const someFunction = () => {
    /* all the code for the pattern-level script goes here */
  };
  if (!window.IS_STORYBOOK) someFunction();
  export default someFunction;
  ```
  (For your convenience, this repository comes with a VS Code snippet called `make-script` that will write this skeleton for you; just start typing `make-script` in a JS or TS file and you should see the option appear.) This allows the script-runner to import that exported function and call it in Storybook when appropriate (i.e., whenever a newly rendered story has used the corresponding Twig file, with the function running only once each time). Babel is set up to strip out the `export` statement from the version of the JS file it creates for Drupal.
- Avoid the Twig [`extends`](https://twig.symfony.com/doc/3.x/tags/extends.html) tag in the front-end files, except for maybe the page-demos (where it's convenient to extend a base `./components/Page/Page.twig` template). If and when you _do_ use `extends`:

  1. make sure that it's the _very first thing_ in its line, and preferably in the whole template, before even any Twig comments (see `./components/PageTemplate/WithSidebar/WithSidebar.twig` for an example);
  2. this one is less important, but try to remember to make sure that the template you're _extending_ has an empty `{% block _startExtends %}{% endblock %}` before any of its HTML content and also an empty `{% block _endExtends %}{% endblock %}` after all of its HTML content (see `./components/Page/Page.twig` for an example).

  These unfortunate requirements have to do with the fact that we've got Webpack set up to inject HTML comments like `<!-- START: /components/Atom/Button/Button.twig -->` and `<!-- END: /components/Atom/Button/Button.twig -->` into the templates it loads (see `docker/bookbinder/.storybook/sb-main-helpers/inject-relative-path-html-comments-loader.js`), and that the implementation must work around Twing's (true-to-Twig) strict policy of forbidding _any_ content&mdash;even HTML comments&mdash;from appearing outside of `block`s in a template that `extends` another. Those injected HTML comments aren't just decorative, by the way; the `script-runner.ts` relies on them to know which pattern-level scripts to run!

- A recommendation: eschew pattern-level CSS files in favor of in-template Tailwind utility classes. The CSS files work, and of course there's nothing wrong with them, but I've found that _mixing_ them with the utility-class approach opens the door to confusing specificity battles and is almost always avoidable (with the exception of third-party styles).

- Each component can also be documented in Storybook. To do this: create an `.mdx` file in the component's directory, give it the same filename as the relevant `.stories.ts` file (e.g., if you have `Button.stories.ts`, use `Button.mdx`), start typing `make-docs` in the empty new file, and select the VS Code snippet that appears. From there, customize the documentation as you see fit.

For instructions on _using_ components in Storybook (and on writing stories), see [Storybook with Twing and TypeScript](#storybook-with-twing-and-typescript).

The `./components/` directory also has two special subfolders to know about:

1. The `./components/global-scripts/` directory is for scripts that don't belong to any particular pattern, but which are instead "global" in nature. The script-runner will execute each of them in Storybook upon _every_ story-render. They should be structured the same way as pattern-level scripts (see the code-block a few paragraphs up, with the `export default` statement).
2. The `./components/_ts-helpers/` directory is for TypeScript "helper" files. They're for things that you might import into `.stories.ts` files. They're _not_ for pattern-level and global scripts that will run on the actual site; at the moment, these scripts aren't configured to work with `import` statements at all.

### Global Assets

#### CSS

Since we're using Tailwind, and since _pattern-level_ CSS files go in subdirectories of `./components/`, there's a good chance that you'll never need to touch `./css/` (which is for _global_ CSS), but you _can_ make new CSS files here or edit `./css/tailwind.css` if you'd like (for what it's worth, I prefer to edit the Tailwind config and leave `tailwind.css` alone). If you do make new CSS files in `./assets/css/`, then getting Storybook to load them will require either importing them into `tailwind.css` or tweaking `./storybook-src/css-importer.ts`.

#### Fonts

If you plan to self-host fonts on the real site (as opposed to linking to external resources like Google Fonts), you can store the local font-assets in the `./fonts/` directory, and then get them into Storybook with [`@font-face` syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) in the `./storybook-config/preview-head.html` file. I recommend using _relative_ paths, like this:

<!-- prettier-ignore -->
```html
<!-- `./storybook-config/preview-head.html` -->
<head>
  <!-- ... -->
  <style>
    @font-face {
      font-family: 'Archivo';
      src: url('./themes/custom/{{ name of this directory }}/fonts/Archivo-Regular.woff2') format('woff2'),
        url('./themes/custom/{{ name of this directory }}/fonts/Archivo-Regular.ttf') format('truetype');
      font-weight: 400;
      font-style: normal;
    }
  </style>
  <!-- ... -->
</head>
```

The reason I recommend relative paths here instead of _root_-relative paths (like `'/foo/...'`) is that I believe the latter will only work if the Storybook endpoint is the root, which may not be the case in the production Storybook environment. For example, at the time of writing, the URLs we get when hosting on NewCity's GitLab Pages look like `https://newcity.pagesfor.us/repo-name/`, which is one directory deeper than the root. By contrast, _relative_ paths (like `'./foo/...'`) should work regardless of environment, since such a path in the HTML file will be relative to the _page_ (and Storybook is a single-page app).

Note that on the _real website_, the situation will be reversed: it won't be a single-page app, but the root will be stable across environments. So if you use the same mechanism to load the fonts on the real site (i.e., linking to self-hosted assets from the `<head>`), then you'd want to use _root_-relative paths instead (or absolute paths).

#### Images

In Storybook, I recommend that URLs to anything in the `./images/` directory be set in the `.stories.ts` files like `` `${window.IMAGES}/image.jpg` `` and passed to the Twig templates as variables. This avoids hard-coding the paths into the HTML or CSS, which frees you from worrying about whether the paths on the real site are the same as the paths in Storybook (at the cost of requiring that the path-variables be handled separately on the real site). The `window.IMAGES` string is set in `./storybook-src/images-path.ts`, and it _should_ work in both development and production Storybook environments, but if for some reason it doesn't, feel free to customize the logic in that `images-path.ts` file, using a `process.env.NODE_ENV === 'development'` check to differentiate between the environments if needed.

That said, it may be feasible to ensure that the image-paths _are_ the same in all environments (and indeed things may already be set up that way). If you've verified that that's the case, then feel free to hard-code the paths.

## Storybook with Twing and TypeScript

This is a long section on how to use Storybook in this setup. There are some idiosyncrasies, but if you've used TypeScript and worked with Storybook before then you can probably get the hang of things pretty quickly by looking at the `.stories.ts` and `.twig` files in the `./components/Atom/Media/` directory. Regardless, at least read these takeaways:

1. Use TypeScript for the `.stories.ts` files (don't use `.stories.js` files).
2. Use the provided `make-story` VS Code snippet for generating boilerplate in those `.stories.ts` files (just start typing `make-story`, select the snippet, optionally rename your component if you're dissatisfied with what's been automatically generated from the filename, and hit <kbd>Tab</kbd>).
3. To inject one component into another via the latter's `.stories.ts` file (so that the former is available in the latter's Twig template as a variable), use the function that the VS Code snippet will have created at the _very bottom_ of the injected component's `.stories.ts` file, and use syntax like `{{ injectedComponent|inject_template }}` rather than `{{ injectedComponent }}` in the higher-order component's Twig template. As an example, study how the `Image()` function at the bottom of `./components/Atom/Media/Image/Image.stories.ts` is imported into `./components/Atom/Media/Picture/Picture.stories.ts` and used there in `PictureStory.parameters.render()` to create `image` and pass it to `./components/Atom/Media/Picture/Picture.twig`, where you'll see `{{ image|inject_template }}`. This sidesteps the need to use `async` functions and `Promise`s everywhere, which makes the TypeScript code much easier to develop and maintain. A few details:
   1. If the Twig templates are to be used directly on the back-end (which they should be in our Drupal projects), then a corresponding custom `|inject_template` filter needs to be defined in that environment, too, but it can just be a "no-op" that returns the value it's called on (i.e., `{{ image|inject_template }}` should just render `{{ image }}` in Drupal). That might look something like this in PHP:
      ```php
      $twig->addFilter( new Twig_Filter( 'inject_template', function passthrough_function( $value ) {
        return $value;
      } ) );
      ```
   2. By default, a component-injecting function like `Image()` generates the injected component using the corresponding story-rendering function (`ImageStory.parameters.render()`), automatically using the story's default args (`ImageStory.args`) if you don't pass in an argument&mdash;and it's got the story's default args attached as a property, so you can do `Image({ ...Image.args, foo: 'bar' })` to use the default args with overrides, without having to _also_ import `ImageStory`. If, however, you have reason to make the component-injecting function use the corresponding "pure component" instead (`ImagePureComponent()`), you can do that by passing `{ usePureComponent: true }` as a second argument (like `Image({ foo: 'bar' }, { usePureComponent: true })`).
   3. The custom `|inject_template` filter in _this_ repository _does_ support syntax like `{{ image|inject_template({ foo: 'bar' }) }}`, allowing you to pass additional context to `Image.twig` directly from the higher-order template. However, _don't do this unless the custom `|inject_template` filter on the CMS is likewise built to handle it_ (the simple "no-op" mentioned above obviously won't suffice)! It's sometimes an extremely useful pattern, though, so if the Twig templates you build will _not_ be used directly on the back-end (e.g., because some third-party is handling the back-end integration with their own internal tools), or if you've got the right corresponding custom filter on the CMS side, then I recommend using it for things like styling details and setting h-tag levels. If you're going to be using this mechanism, use the `make-story-plus` VS Code snippet instead of the `make-story` snippet.

### Some Background on Twing and Storybook

This Storybook setup uses [Twing](https://gitlab.com/nightlycommit/twing) instead of [Twig.js](https://github.com/twigjs/twig.js/) as the Twig engine. The upside is that Twing is a better JavaScript port of Twig. The downside is that Twing loads Twig files as JavaScript functions that return not markup-strings directly but rather _Promises_ that _resolve_ to markup-strings, and accommodating this in Storybook requires some trickery.

The solution here involves a custom global render-function (a feature of Storybook 7's [CSF 3](https://storybook.js.org/blog/component-story-format-3-0/)) and a [global loader](https://storybook.js.org/docs/html/writing-stories/loaders#global-loaders) that are both abstracted away in `docker/bookbinder/.storybook/preview.ts`. What's _not_ abstracted away is the need for every story's rendering logic to go in a `.parameters.render()` method that accepts the story's args as input and returns a Promise that resolves to a markup-string (namely, the Promise generated by the corresponding Twig-function when you pass it an object of properties derived from the args).

### The VS Code Snippet, and an Example

To make this all easier to manage (and to help catch mistakes before you make them), this setup uses TypeScript and comes with a VS Code snippet for writing stories. In VS Code, you can just start typing `make-story` in an empty `components/**/*.stories.ts` file, and the snippet-option should appear. Once you select it, you'll see some boilerplate code (okay, a lot of boilerplate code) that looks like this if the file is called `Example.stories.ts`:

```typescript
// ./components/Example/Example.stories.ts
import { Story, Meta } from '@components/_ts-helpers/types';
import makeComponentInjector from '@components/_ts-helpers/make-component-injector';

import ExampleTemplate from './Example.twig';

const ExamplePureComponent = (twigContext: ExampleTwigContext) =>
  ExampleTemplate(twigContext);

// should exactly match the context-signature of `Example.twig`
type ExampleTwigContext = {
  foo?: never; // leave this if it prevents the type from being empty
};

const meta: Meta = {
  title: 'Example/Example',
  excludeStories: ['Example'],
};

export default meta;

export const ExampleStory: Story<ExampleArgs> = {
  name: 'Example',

  parameters: {
    render: ({ foo }) => {
      // story rendering logic goes here
      return ExamplePureComponent({ foo });
    },
  },

  args: {},
};

type ExampleArgs = Partial<ExampleTwigContext> & {
  foo?: never; // leave this if it prevents the type from being empty
};

export const Example = makeComponentInjector({
  pureComponent: ExamplePureComponent,
  storyRenderFn: ExampleStory.parameters.render,
  defaultArgs: ExampleStory.args,
});
```

All instances of the component's name will be highlighted and have a blinking cursor, so that you can rename it everywhere at once if you're dissatisfied with what's been automatically generated from the filename (stick with `UpperCamelCase`, though). Hit <kbd>Tab</kbd> when you're happy with the name, and the blinking cursor will move to just the [grouping](https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#grouping) portion of your new story's `title`&mdash;i.e., the first `Example` in `title: 'Example/Example'` above&mdash;so that you can set the story's place in the hierarchy used in the sidebar of Storybook's UI. By default it will just be what you chose for the component's name, but you'll probably want to change it to something more organizationally useful, like `Organism/Wrapper` if the component is the site-header, or `Atom/Link` if the component is a fancy-link, or `Organism/Page Header` if the component is some page-header variant. Usually I make it match the file's path, but that's not a requirement.

### The Boilerplate Explained

I know that's a lot of code. It might seem excessive at first, but it gives us solid type-safety, and after the initial `import` statements there are really only three things happening here:

1. **Defining and typing the "pure component."**

   ```typescript
   const ExamplePureComponent = (twigContext: ExampleTwigContext) =>
     ExampleTemplate(twigContext);

   // should exactly match the context-signature of `Example.twig`
   type ExampleTwigContext = {
     foo?: never; // leave this if it prevents the type from being empty
   };
   ```

   By "pure component," I mean that `ExamplePureComponent()` does nothing but bring the `Example.twig` template into the TypeScript ecosystem by passing it _typed_ context. The [`type` alias](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases) for the pure component's input-object (`ExampleTwigContext`) should therefore precisely match the Twig template's context-signature. It needs to be kept up to date manually, but TypeScript will warn you if you try to pass an invalid argument to `ExamplePureComponent()` ([provided you're careful](#forbid-excess-properties-when-calling-pure-component-in-parametersrender-body)), so that should help.

2. **Defining and typing the story (`ExampleStory`) and its metadata.**

   ```typescript
   const meta: Meta = {
     title: 'Example/Example',
     excludeStories: ['Example'],
   };

   export default meta;

   export const ExampleStory: Story<ExampleArgs> = {
     name: 'Example',

     parameters: {
       render: ({ foo }) => {
         // story rendering logic goes here
         return ExamplePureComponent({ foo });
       },
     },

     args: {},
   };

   type ExampleArgs = Partial<ExampleTwigContext> & {
     foo?: never; // leave this if it prevents the type from being empty
   };
   ```

   You'll need to fill out the type alias for the story's `.args` (`ExampleArgs`) as you add properties to it (TypeScript will warn you if it isn't right). That same type is used for the argument of the story's rendering function (`ExampleStory.parameters.render()`), which returns a call to the pure component.

   The `Partial<ExampleTwigContext>` adds all properties of `ExampleTwigContext` to `ExampleArgs` as _optional_ properties, the idea being that you can [provide default values](#be-thoughtful-about-where-you-specify-default-values) for them as needed in the `.parameters.render()` function and/or in the story's `.args`. I like this pattern, especially because it automatically keeps `ExampleArgs` up to date with `ExampleTwigContext`, but you certainly don't have to use it.

3. **Defining a function (`Example()`) that you'll use in _other_ `*.stories.ts` files when you need to inject this component into others.**
   ```typescript
   export const Example = makeComponentInjector({
     pureComponent: ExamplePureComponent,
     storyRenderFn: ExampleStory.parameters.render,
     defaultArgs: ExampleStory.args,
   });
   ```
   You should never have to change this function's definition. By default it injects the component with the story-rendering function (`ExampleStory.parameters.render()`), but when you call it you can choose to make it use the pure component instead (`ExamplePureComponent()`). We'll go over how this function works in the next section. Usually it's the _only_ thing you'll import into other `*.stories.ts` files.

Quick note on typing the Twig context and the story's `.args`: the type aliases mustn't be empty, so just leave the `foo?: never;` placeholders where they are if there's nothing to replace them. In case you weren't aware, the `?` in `foo?:` makes `foo` an optional property. You can read about the `never` type in the [TypeScript docs](https://www.typescriptlang.org/docs/handbook/type-compatibility.html#any-unknown-object-void-undefined-null-and-never-assignability).

Maintaining separate types for the pure component and the story requires some extra effort, but it helps with organization as a project grows. And to be clear, the two type aliases _will_ often differ somewhat, because the story's `.parameters.render()` method and the corresponding Twig template serve different purposes: the Twig template is for rendering the component's actual markup, while the `.parameters.render()` method is for generating and displaying that rendered markup as a story in the Storybook UI, which might involve logic for supplying default values or processing a user's input from the Storybook [Controls](https://storybook.js.org/docs/html/essentials/controls).

(To nip a possible source of confusion in the bud: the type alias for `.args` has nothing to do with the story's optional [`.argTypes`](https://storybook.js.org/docs/html/api/argtypes) property, which can be used to manage the Storybook Controls.)

### Direct Injection of One Component into Another

When you want to pass another component (a button, say) into `Example.twig` as context (so that you can access it as a variable in `Example.twig` instead of using [`include`](https://twig.symfony.com/doc/3.x/tags/include.html) or [`embed`](https://twig.symfony.com/doc/3.x/tags/embed.html) to import `Button.twig`), you should use the `Button()` function that the VS Code snippet will have automatically created for you at the bottom of `Button.stories.ts`, like this:

```typescript
// ./components/Example/Example.stories.ts

// ...

import ExampleTemplate from './Example.twig';
import { Button } from '@components/Atom/Button/Button.stories';

const ExamplePureComponent = (twigContext: ExampleTwigContext) =>
  ExampleTemplate(twigContext);

type ExampleTwigContext = {
  button: InjectedComponent<typeof Button>;
  // ...
};

// ...

export const ExampleStory: Story<ExampleArgs> = {
  // ...

  parameters: {
    render: ({ buzz /* ... */ }) => {
      const button = Button({
        // start with button-story's default args...
        ...Button.args,
        // ...and override them as necessary:
        foo: 'baz',
        fizz: buzz,
      });

      // ...

      return ExamplePureComponent({
        button,
        // ...
      });
    },
  },

  // ...
};

// ...
```

Here, `button` is a _function_. Where needed, specify its type like `InjectedComponent<typeof Button>` (`InjectedComponent` is just a more expressive alias for TypeScript's built-in [`ReturnType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype); I've made it available globally, so you never have to import it). To use `button` in `Example.twig`, you'd do:

```twig
{{ button|inject_template }}
```

That `|inject_template` is a custom Twig filter. If the Twig templates in this project will be used directly on the back-end, then there needs to be a corresponding custom `|inject_template` filter in that environment (a "no-op" will do the trick).

By default, the function-call triggered by `{{ button|inject_template }}` will involve the button's _story-rendering function_ (`ButtonStory.parameters.render()`), and that function will automatically be called with the story's default args (`ButtonStory.args`) if you didn't pass any arguments to `Button()`. The `Button()` function also has `ButtonStory.args` attached as an object, so if you need to use the default args but with some overrides, then you can do `Button({ ...Button.args, /* overrides here */ })` without having to _also_ import `ButtonStory` (this is what we did in the example above). If instead of the story-rendering function you want `{{ button|inject_template }}` to involve the button's _pure component_ (`ButtonPureComponent()`), then pass `{ usePureComponent: true }` into `Button()` as a second argument. You'll get appropriate type-safety on the first argument either way (i.e, if you omit the second argument, then TypeScript will force you to make the first argument match the `ButtonArgs` type or be undefined; and if you pass in `{ usePureComponent: true }` as a second argument, then you'll be forced to make the first argument match the `ButtonTwigContext` type).

The main reason for doing things this way is to avoid having to deal with `async` functions and `Promise`s in the TypeScript (the `|inject_template` filter and `makeComponentInjector()` helper abstract all of that away).

An upshot is that you'll rarely have to import anything from a `*.stories.ts` file other than the component-injecting function. Need to use the button's story-rendering function with the story's default args? Just do `Button()`. Need to do the same but with some overrides? It's `Button({ ...Button.args, foo: 'baz' })`. Need to use the button's pure component? I doubt you ever will, but you can: `Button({ foo: 'bar' }, { usePureComponent: true })`. Need to refer to the type alias for the button-story's args? Do `typeof Button.args` (or import the `ButtonArgs` type if you prefer, but you don't have to, and the snippet boilerplate doesn't export it by default).

But remember to do `{{ button|inject_template }}` in the Twig!

#### Passing Additional Context to `|inject_template` (Probably Illegal)

The custom `|inject_template` filter _can_ accommodate syntax like `{{ button|inject_template({ foo: 'bar' }) }}`, letting you pass additional context to the Twig template directly from the higher-order template that it's being injected into. Although this is occasionally a very useful pattern, don't use it _unless the implementation of `|inject_template` on the CMS can support it_ (a "no-op" filter won't suffice), or unless the Twig files aren't going to be used directly on the back end (because, say, some third-party is handling the integration with their own tools).

If the circumstances are favorable and you can use this syntax, I recommend reserving it only for things like styling details or managing h-tag levels. Note that any properties passed to `|inject_template` will _override_ corresponding properties set in the TypeScript.

Oh, and to use this mechanism at all, you have to include an appropriate `twigContextKeys` property on the object you pass to `makeComponentInjector()`. The basics are handled for you automatically if you use the `make-story-plus` snippet instead of the `make-story` snippet when writing stories.

### Direct Injection of an _Array_ of Components into Another

Sometimes you'll need to inject an _array_ of components into a higher-order component (e.g., injecting an array of teasers into a teaser-collection). In that case, you'd do something like this:

```typescript
// ./components/Organism/TeaserCollection/TeaserCollection.stories.ts

// ...

import TeaserCollectionTemplate from './TeaserCollection.twig';
import { Teaser } from '@components/Molecule/Teaser/Teaser.stories';

const TeaserCollectionPureComponent = (
  twigContext: TeaserCollectionTwigContext
) => TeaserCollectionTemplate(twigContext);

type TeaserCollectionTwigContext = {
  teasers: InjectedComponent<typeof Teaser>[];
  // ...
};

// ...

const teasers = [
  Teaser.args, // use default teaser-story args for 1st teaser, say (`undefined` would work too)
  { ...Teaser.args, foo: 'bar' }, // override `foo` for 2nd teaser, maybe
  // ...
].map((teaserArgs) => Teaser(teaserArgs));

export const TeaserCollectionStory: Story<TeaserCollectionArgs> = {
  // ...

  parameters: {
    render: (args) => {
      // ...
      return TeaserCollectionPureComponent({
        teasers,
        // ...
      });
    },
  },

  // ...
};

type TeaserCollectionArgs = /* ... */;

// ...
```

(specify the array's type like `InjectedComponent<typeof Teaser>[]`). Then in `TeaserCollection.twig`, you might do:

```twig
{% for teaser in teasers %}
  {{ teaser|inject_template }}
{% endif %}
```

### Don't Inject a Component as a String (But Top-Level `await` Is Available)

It's _possible_ to sidestep the functions like `Button()` and instead inject a component as an already-rendered markup-string by defining it as `await ButtonStory.parameters.render({ /* ... */ })` or `await ButtonPureComponent({ /* ... */ })`, and using it like `{{ button }}` (without the `|inject_template`). _I strongly recommend not doing this_, for a few reasons:

1. Consistency. If you start mixing this in with the `Button()`/`button|inject_template` approach, you're going to create confusion for yourself and future developers.
2. The `{{ button|inject_template }}` syntax has the virtue of signaling in the Twig template that `button` is an injected component and not some other kind of variable.
3. The functions like `Button()` are more pleasant to work with, as they aren't asynchronous and they use the story's `.args` by default.

To help discourage the string-approach, the VS Code snippet gives the functions like `Button()` the terser names, and it doesn't even `export` the pure components (exporting the story-rendering functions is unavoidable).

It's worth noting, though, that top-level `await` is enabled in this project, so if you ever have a Promise-returning function that would be convenient to resolve at the top level of a `.stories.ts` file, you can go for it.

### Using `include` or `embed` in Templates

The "direct-injection" mechanism described above is usually the cleanest and most convenient way to pass one component into another in this Storybook setup. For one thing, it keeps as much as possible in the TypeScript, which provides type-safety. For another, it uses the injected component's story-rendering function (by default), so that you can use simple syntax like `Button()` or `Button({ ...Button.args, foo: 'bar' })` to prepare an injected component with default property-values.

But it has a shortcoming: unless you have the green light to pass extra context to the `|inject_template` filter (like `button|inject_template({ foo: 'baz' })`)—[and you probably don't](#passing-additional-context-to-inject_template-probably-illegal)—then a component injected this way must be _fully_ prepared in the TypeScript, meaning that it cannot have any of its properties calculated in the consuming component's Twig template. This is rarely a problem, but sometimes it is! For example, typically an individual teaser's heading should be either an `h3` or an `h2`, depending on whether the collection it's a part of itself has an `h2`. Where should the logic for this go? If the Twig templates are being used directly on the actual site, then the answer is: in the _teaser collection's Twig template_ (ideally). That's because the `.stories.ts` files aren't used on the back-end at all, and any logic you put there will have to be reproduced by the back-end developer (in PHP for a Drupal site, say). If the logic is in the consuming component's Twig template, then the back-end developer doesn't even have to know it's there—it should just work. (If the Twig templates are _not_ being used directly on the actual site, then where you put the logic is less consequential, but then you're also free to do the `teaser|inject_template({ hLevel: collectionHeading ? 3 : 2 })` thing anyway; regardless, you should leave clear notes for the integrator.)

In these kinds of scenarios (and perhaps others), you might decide that using [`include`](https://twig.symfony.com/doc/3.x/tags/include.html) or [`embed`](https://twig.symfony.com/doc/3.x/tags/embed.html) syntax in the consuming component's Twig template is a better choice than preparing the injected component in the TypeScript for use with `|inject_template`. If you do, then what you pass to the consuming template are _properties_ to be fed to the injected template. On the `.stories.ts` side, that might look something like this:

```typescript
// ./components/Organism/TeaserCollection/TeaserCollection.stories.ts

// ...

import TeaserCollectionTemplate from './TeaserCollection.twig';
import { TeaserTwigContext } from '@components/Molecule/Teaser/Teaser.stories';
import { Editorial } from '@components/Organism/Editorial/Editorial.stories';
import { Heading } from '@components/Atom/Heading/Heading.stories';

const TeaserCollectionPureComponent = (
  twigContext: TeaserCollectionTwigContext
) => TeaserCollectionTemplate(twigContext);

type TeaserCollectionTwigContext = {
  heading?: InjectedComponent<typeof Heading>;
  teasers: TeaserTwigContext[];
  // ...
};

// ...

const defaultTeasers: TeaserCollectionTwigContext['teasers'] = [
  {
    link: { url: '#', title: 'Some Teaser Headline' },
    editorial: Editorial({
      ...Editorial.args,
      wysiwyg: `<p>Teaser description.</p>`,
    }),
    // ...
  },
  {
    /* props for another teaser here */
  },
  // ... etc.
];

export const TeaserCollectionStory: Story<TeaserCollectionArgs> = {
  // ...

  parameters: {
    render: ({ heading, teasers }) => {
      teasers = teasers || defaultTeasers;
      // ...
      return TeaserCollectionPureComponent({
        heading,
        teasers,
        // ...
      });
    },
  },

  // ...
};

type TeaserCollectionArgs = Partial<TeaserCollectionTwigContext> & {
  /* ... */
};

// ...
```

Note that we're using the `TeaserTwigContext` type alias for the elements of the `teasers` array, and not `TeaserArgs` (so we'd need to `export` the former from `Teaser.stories.ts`). This is because the `include` syntax we'll use in `TeaserCollection.twig` will call the `Teaser.twig` template directly. Also note that the `heading` for the collection is an _optional_ property in `TeaserCollectionTwigContext` (that's what the question mark means). So then in `TeaserCollection.twig`, we might have something like:

```twig
{# ./components/Organism/TeaserCollection/TeaserCollection.twig #}

{# ... #}

{% if heading %}
  {{ heading|inject_template }}
{% endif %}

{# ... #}

<ul>
  {% for teaserProps of teasers %}
    <li>
      {% include '@components/Molecule/Teaser/Teaser.twig' with teaserProps|merge({
        hLevel: heading ? 3 : 2
      }) only %}
    </li>
  {% endfor %}
</ul>

{# ... #}
```

Here, we're using the [`|merge`](https://twig.symfony.com/doc/3.x/filters/merge.html) filter to add an appropriate `hLevel` property to the `teaserProps` hash that we pass to the `Teaser.twig` template (for each individual teaser). Then maybe the `Teaser.twig` file has:

```twig
{# ./components/Molecule/Teaser/Teaser.twig #}

{# ... #}

{% set hLevel = hLevel|default(3) %}

<h{{ hLevel }}>
  <a href="{{ link.url }}">{{ link.title }}</a>
</h{{ hLevel }}>

{# ... #}

{% if editorial %}
  {{ editorial|inject_template }}
{% endif %}

{# ... #}
```

Of course, you don't _have_ to put the `hLevel` logic in the `TeaserCollection.twig` file. The upside is that it will "just work" on the real site, without the back-end developer having to worry about it at all. But it's also less convenient for you (and future front-end maintainers), and it makes the front-end codebase less consistent. If you wanted to use the direct-injection mechanism instead, you might do something like this on the TypeScript side:

```typescript
// ./components/Organism/TeaserCollection/TeaserCollection.stories.ts

// ...

import TeaserCollectionTemplate from './TeaserCollection.twig';
import { Teaser } from '@components/Molecule/Teaser/Teaser.stories';

const TeaserCollectionPureComponent = (
  twigContext: TeaserCollectionTwigContext
) => TeaserCollectionTemplate(twigContext);

type TeaserCollectionTwigContext = {
  heading?: InjectedComponent<typeof Heading>;
  /**
   * Note: each teaser should have `hLevel: 3` if the collection
   * has a `heading`, and `hLevel: 2` if it doesn't.
   */
  teasers: InjectedComponent<typeof Teaser>[];
  // ...
};

// ...

const defaultTeaserArgs: (typeof Teaser.args)[] = [
  Teaser.args,
  // ...
];

export const TeaserCollectionStory: Story<TeaserCollectionArgs> = {
  // ...

  parameters: {
    render: ({ heading, teasers }) => {
      teasers =
        teasers ||
        defaultTeaserArgs.map((teaserArgs) =>
          Teaser({
            ...teaserArgs,
            hLevel: heading ? 3 : 2,
          })
        );
      // ...
      return TeaserCollectionPureComponent({
        heading,
        teasers,
        // ...
      });
    },
  },

  // ...
};

type TeaserCollectionArgs = Partial<TeaserCollectionTwigContext> & {
  /* ... */
};

export const TeaserCollection = makeComponentInjector({
  /* ... */
});
```

Here, we've handled the `hLevel` logic in the collection's story-rendering function, and we've left clear instructions about it for the back-end developer near the top of the file.

And actually, the clear instructions are for you, too: if you call the `TeaserCollection()` function in some other file and pass it a `teasers` property (so that the `defaultTeaserArgs` isn't used when the story-rendering function runs), then the onus will be on _you_ to prepare those teasers with an appropriate `hLevel` (i.e., `3` if you're passing a `heading` to the story-rendering function, and `2` if you aren't). If you'd like, you could get around this by having the story-rendering function accept an array of teaser _args_ instead of an array of _teasers_, and then making the story-rendering function prepare `teasers` on the fly with the appropriate `hLevel` every time, like this:

```typescript
// ./components/Organism/TeaserCollection/TeaserCollection.stories.ts

// ...

import TeaserCollectionTemplate from './TeaserCollection.twig';
import { Teaser } from '@components/Molecule/Teaser/Teaser.stories';

const TeaserCollectionPureComponent = (
  twigContext: TeaserCollectionTwigContext
) => TeaserCollectionTemplate(twigContext);

type TeaserCollectionTwigContext = {
  heading?: InjectedComponent<typeof Heading>;
  /**
   * Note: each teaser should have `hLevel: 3` if the collection
   * has a `heading`, and `hLevel: 2` if it doesn't.
   */
  teasers: InjectedComponent<typeof Teaser>[];
  // ...
};

// ...

const defaultTeaserArgs: (typeof Teaser.args)[] = [
  Teaser.args,
  // ...
];

export const TeaserCollectionStory: Story<TeaserCollectionArgs> = {
  // ...

  parameters: {
    render: ({ heading, teaserArgs }) => {
      const teasers = (teaserArgs || defaultTeaserArgs).map((args) =>
        Teaser({
          ...args,
          hLevel: heading ? 3 : 2,
        })
      );
      // ...
      return TeaserCollectionPureComponent({
        heading,
        teasers,
        // ...
      });
    },
  },

  // ...
};

type TeaserCollectionArgs = Partial<
  Omit<TeaserCollectionTwigContext, 'teasers'>
> & {
  teaserArgs?: (typeof Teaser.args)[];
};

// ...
```

The [`Omit<>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys) syntax removes the `teasers` property from the `TeaserCollectionArgs` type alias, and we replace the `teasers` property with an optional `teaserArgs` property.

Anyway, at the moment, there's no perfect way of handling these "one property depends on another" situations. If we can get the `|inject_template({ foo: 'bar' })` mechanism working on the CMS-side, then we'll be closer, but for now we just have to use our best judgment and aim for clear communication with the back-end developer.

### Making Multiple Stories in a Single `.stories.ts` File

To make multiple stories in a single `.stories.ts` file (using the one generated by the VS Code snippet as a "prototype"), follow the [CSF 3.0 instructions](https://storybook.js.org/blog/component-story-format-3-0/#spreadable-story-objects), but try to remember to annotate them all with the same `Story<>` type:

```typescript
// ...

// prototype-story
export const ButtonStory: Story<ButtonArgs> = {
  // our snippet boilerplate uses `name: 'Button'`, but 'Primary' makes more sense now
  name: 'Primary',

  parameters: {
    render: /* ... */,
  },

  args: {
    foo: 'bar',
    // ...
  },
};

// call it whatever you want, but annotate w/ `Story<ButtonArgs>`
export const ButtonStorySecondary: Story<ButtonArgs> = {
  ...ButtonStory,
  name: 'Secondary',
  args: {
    ...ButtonStory.args,
    foo: 'baz',
  },
};

type ButtonArgs = /* ... */;

export const Button = /* ... */;
```

Above, `ButtonStorySecondary` differs from `ButtonStory` only by `name` and `args.foo`. If you wanted to inject a button into another component using the _secondary_ story's default args, you'd have to import the secondary story, and you'd do `Button(ButtonStorySecondary.args)` (or you could skip the import and just do `Button({ ...Button.args, foo: 'baz' })`).

Note that the `name` field is always optional. If it's absent (or if it's got the same value as that of a story defined earlier in the file), then Storybook will revert to its default display-name behavior, which is to use the name of the story-object itself (e.g., "Button Story Secondary" for `ButtonStorySecondary`).

### Some Tips

#### Don't Mutate `.args`

The `Story<>` utility used in the snippet boilerplate to annotate stories is abstracted away in `./components/_ts-helpers/types.ts`. It uses Storybook's built-in `Story` interface as a basis, but one way in which it diverges from its namesake is that all of its properties are read-only. This is to help prevent some unexpected behavior that can arise as a result of mutating something in a story, which in my experience usually happens (inadvertently) when working with the story's default `.args` in another file.

Unfortunately, TypeScript has no built-in "deep" read-only mechanism, so the `Story<>` utility only makes _top-level_ properties on `.args` read-only. For example, if a `TeaserCollectionStory` has an `.args.teasers` array, then you won't be able to reassign `TeaserCollectionStory.args` or `TeaserCollectionStory.args.teasers`, but you _will_ be able to mutate the `teasers` array, and you _will_ be able to mutate or reassign anything deeper. (The same goes for the `TeaserCollection()` function you'd be working with in other files: you won't be able to reassign `TeaserCollection.args` or `TeaserCollection.args.teasers`, but `.args.teasers` can be mutated, and anything deeper can be mutated or reassigned.)

All of this is to say, try to avoid accidentally mutating or reassigning something in a story's `.args`. If you want the `TeaserCollection.args.teasers` array in reverse-order, don't do this:

```typescript
// (BAD)
const teaserCollection = TeaserCollection({
  ...TeaserCollection.args,
  teasers: TeaserCollection.args.teasers.reverse(), // `.reverse()` mutates the array!
});
```

Instead, do something like this:

```typescript
// (GOOD)
const teaserCollection = TeaserCollection({
  ...TeaserCollection.args,
  teasers: [...TeaserCollection.args.teasers].reverse(),
});
```

You can also explicitly declare things as read-only yourself, to leverage TypeScript to your advantage. For instance, using a [`ReadonlyArray`](https://www.typescriptlang.org/docs/handbook/2/objects.html#the-readonlyarray-type):

```typescript
type TeaserCollectionArgs = {
  // teasers: InjectedComponent<typeof Teaser>[] /* fine, but can be mutated */
  teasers: ReadonlyArray<InjectedComponent<typeof Teaser>>;
  // ...
};
```

There are [ways to implement](https://github.com/sindresorhus/type-fest/blob/e3234d74aa12d12f209d942a43d30b3f88301916/source/readonly-deep.d.ts) "deep" read-only in TypeScript, but I don't like how they affect the messages you get when you hover over things during development, so I've opted not to use them. The stakes are pretty low here; try not to mutate or reassign anything in `.args`, but if you do, it's probably not a big deal.

#### Forbid Excess Properties When Calling Pure Component in `.parameters.render()` Body

TypeScript generally allows objects to have "excess properties"&mdash;i.e., as long as an object has _at least_ the properties specified by its type, then it's allowed to have other properties, too.

The exceptions are properties defined _explicitly_ in an object literal. Properties defined this way [_must_ be specified by the object's type](https://www.typescriptlang.org/docs/handbook/interfaces.html#excess-property-checks). But there's a subtlety that hinges on that word _explicitly_: TypeScript [allows excess properties to be _spread into_](https://github.com/microsoft/TypeScript/pull/26798) the object literal. (As far as I can tell, this subtlety isn't mentioned in the TypeScript docs!) [Here](https://www.typescriptlang.org/play?#code/C4TwDgpgBMEM7CgXigbwFBSgMwPa4C4oEAnASwDsBzAbkxzIC9GjTLb0BfO9Ael6gAVcBADKAY3JhEAd1wUA5IgA2ERCFwBXKAEMAJnqgQAHuPhwoYErkglgZeDFy6KUXACMAVhHEqysEh1lADpQ9HF5BCgKXBIAWyCAeS8fYAAZfwhA5SJYKJQMLDxCKAV3HRIFABp6bCYWUvdNZmr6E2BAogUYo2MOnUtrW3tHIOVcGQhDZTIAa2hgAAsyOFbudD4BUODNClU4CyXcOGgrGyyRiwroACI4Kwh9G6hKYPDIxA9vXwyAoIB1fyLUQPfS5eCIApQbYxeJJFI-TLZKDrTZQACipnMg3OdgcVxI0CCcGcYwmUzcrgAbhUyDp3PsYIsdIhrroDmQqBQKcBnF9UodmazCYpPgi-H9lHA3hEKFEYsBkt90kiguD8tFYgllErUr8skE6EA) is a little demo.

Since we'd like the type of each pure component's object-parameter to exactly match the context-signature of the corresponding Twig template, it's to our advantage _not_ to allow excess properties on the object that the story-rendering function passes to the pure component. That way, TypeScript will help us catch any missing properties on the pure component's parameter-type (properties that should be there that we've neglected to include).

To that end, when returning the call to a pure component like `VideoPureComponent({ /* ... */ })` in the body of a story-rendering method like `VideoStory.parameters.render()`, we should feed the pure component an _object literal_, and we should avoid using the spread syntax inside it. Alternatively, we can feed it a variable that's been _assigned_ to a "spreadless" object literal, provided that the variable was annotated with the pure component's parameter-type (`VideoTwigContext`).

Here is an example where using the spread syntax would be a great idea in JavaScript or if we didn't care about excess properties, but would in this context have the undesirable consequence of preventing TypeScript from alerting us to a mistake that we've made:

```typescript
// (BAD)
// ...

const VideoPureComponent = (twigContext: VideoTwigContext) =>
  VideoTemplate(twigContext);

type VideoTwigContext = {
  url: string;
  picture: InjectedComponent<typeof Picture>;
  // we forgot to include `title` here, and we'd like TS to alert us to that fact
};

// ...

export const VideoStory: Story<VideoArgs> = {
  // ...

  parameters: {
    render: ({ picture, ...rest }) => {
      // some logic here that assigns `picture` a default value if needed
      return VideoPureComponent({ picture, ...rest }); // b/c `title` is spread in, we get no alert!
    },
  },

  // ...
};

type VideoArgs = {
  url: string;
  picture?: InjectedComponent<typeof Picture>;
  title?: string;
};

// ...
```

We likewise wouldn't get the desired warning if we'd written the `VideoStory.parameters.render()` method like this (even though the object literal doesn't contain spread syntax):

```typescript
// (BAD)
render: ({ picture, url, title }) => {
  // ...
  const twigContext = { picture, url, title };
  return VideoPureComponent(twigContext);
},
```

The pattern to make a habit of is this:

```typescript
// (GOOD)
render: ({ picture, url, title }) => {
  // ...
  return VideoPureComponent({ picture, url, title });
},
```

(feed the pure component an object literal without spread syntax), or this:

```typescript
// (GOOD)
render: ({ picture, url, title }) => {
  // ...
  const twigContext: VideoTwigContext = { picture, url, title };
  return VideoPureComponent(twigContext);
},
```

(feed the pure component an _appropriately annotated_ variable that's been assigned to an object literal without spread syntax). With either of the recommended patterns, TypeScript will alert us to the fact that `title` isn't a key in `VideoTwigContext`.

To be clear, we _can_ use a [rest property](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#rest_in_object_destructuring) in the destructured input-object, as long as we're explicit in the object literal we feed to the pure component:

```typescript
// (GOOD)
render: ({ picture, ...rest }) => {
  // ...
  return VideoPureComponent({
    picture,
    url: rest.url,
    title: rest.title,
  });
},
```

And we're under no obligation to destructure the input-object at all:

```typescript
// (GOOD)
render: (args) => {
  const picture = args.picture || /* ... */
  const twigContext: VideoTwigContext = {
    picture,
    url: args.url,
    title: args.title,
  };
  return VideoPureComponent(twigContext);
},
```

But we _should_ avoid passing the input-object directly to the pure component:

```typescript
// (BAD)
render: (args) => {
  // ...
  return VideoPureComponent(args);
},
```

(The VS Code snippet helps steer us away from this by using the recommended object-literal pattern and also by making the input-object's properties read-only.)

That said, this last "bad" pattern is harmless if the type of the input-parameter (`VideoArgs`) exactly matches the type of the corresponding Twig context (`VideoTwigContext`), which may occasionally be the case. One _could_ even assign `VideoStory.parameters.render` directly to `VideoPureComponent` if the story also has no rendering logic. Works fine for page-demos, but should be avoided for reusable components.

For what it's worth, there are [some hacks out there](https://github.com/microsoft/TypeScript/issues/12936) for making an `Exact` utility type that we could use to _force_ the pure components to reject input-objects with any excess properties&mdash;[this one](https://www.typescriptlang.org/play?#code/C4TwDgpgBAChBOBnA9gOygXigbwLACgooAzASyWAC4pFh5TUBzAGigBsBDW62+pggL4ECoSFABqHNqQAmHYBADKdAK4BjYCvgQAPABVWy+OuAA+TFAJE9UCAA8FqGYihGTUAPyXCUAKJ21NhUZXQBrCBBkYigDKHDI6LcNc3tHZyhUCAA3BE8YqGpMnPgCjOyEAG5hfBDAjm0SFVQNUjQaDhy4JDR9UwAKSG7UaklpOQUkzW19Vi6UVFMASmos5Fkq-AI1NFooYGRkADEIAHcLbBJybigAcmUIYg5UG6gBDe3UXfsODXPLimodwUj2erE41xuACEOCoALaMerATLwF5CfAfXb7ZAAWSeID+ZABt3uIJuYK4VFu0LhCPgSIQZKgHEYEGoAGYAOyvaqIDoQOZoPpY44nRYVKAAeglUEAvBuAUp2oDJkBBEM9gFATsh4KECLzOgh5n1vhoxZLpYBQcnawFIiDIKr2AAtoB86D9gLq+QLUEKDrjUCBTVLZQqlSq1RqtTrNvggA) seemed to work best when I experimented with them&mdash;but they give completely unhelpful error messages when there's a problem. Not worth the trouble, I think.

#### Be Thoughtful about Where You Specify Default Values

There are two places where you can provide default values for properties that a story-rendering function accepts: in the story's `.args` object (always optional), and in the story-rendering function itself (_sometimes_ mandatory, as explained below). The most significant difference between them is that any property of the `.args` object will appear in the Controls of Storybook's UI by default. A good rule of thumb, then, is to mainly reserve `.args` for properties you want the user to be able to customize from the Controls. Generally these will fall into one of two categories:

1. values (usually primitive ones) that the story-rendering function passes directly to the pure component without modification;
2. values that aren't passed directly to the pure component, but which are instead used in the body of the story-rendering function to construct _other_ properties that _are_.

It's only a rule of thumb, though. Sometimes it might be convenient to put an array- or object-valued property in `.args` _just_ so that it's available for syntax like [`TeaserCollection({ ...TeaserCollection.args, teasers: [...TeaserCollection.args.teasers].reverse() })`](#dont-mutate-args), even though you don't want the user to be able to customize the property from the Controls. In that case, you should consider [excluding](https://storybook.js.org/docs/react/essentials/controls#disable-controls-for-specific-properties) that property from the Controls via the story's `.argTypes`.

Setting a default value in a story-rendering function is _mandatory_ when the property in question gets passed directly to the pure component _and is required there_. TypeScript will force you to get this right. If the property is _optional_ in the pure component, then you may still choose to set a default value for it in the story-rendering function, but be careful: depending on how you do so, you might inadvertently make it impossible for the story-rendering function to output the component _without_ that optional property. This is never a problem with `.args`, since properties in `.args` can always be overridden with syntax like `Button({ ...Button.args, foo: 'bar' })` (and you can omit the `.args` entirely with syntax like `Button({ foo: 'bar', /* ... */ })`). But if a default value for `foo` were supplied in the button's story-rendering function, then simply leaving out `foo` like `Button({ fizz: 'buzz' })` wouldn't get you a button without a `foo` property (indeed, that's the whole point of default values). Even `Button({ foo: '' })` won't work if your default value is set with syntax like `foo = foo || /* ... */`! So if you wanted an "escape hatch" from the default value, you'd need to use some logic that handles the `undefined` (missing) case one way and, say, the empty-string case another way. Sometimes [nullish coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator) will do the trick (like `foo = foo ?? /* ... */`). (You can also just bypass the story-rendering function altogether, like `Button({ /* ... */ }, { usePureComponent: true })`.)

Let's look at a couple of examples. We'll start with the relevant bits of `./components/Atom/Media/Video/Video.stories.ts`:

```typescript
const VideoPureComponent = (twigContext: VideoTwigContext) =>
  VideoTemplate(twigContext);

type VideoTwigContext = {
  url: string;
  picture: InjectedComponent<typeof Picture>;
  title?: string;
};

const DEFAULT_VIDEO = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

// ...

export const VideoStory: Story<VideoArgs> = {
  name: 'Video',

  parameters: {
    render: ({ picture, pictureArgs, url, title }) => {
      picture = picture || Picture(pictureArgs);
      url = url || DEFAULT_VIDEO;
      return VideoPureComponent({ picture, url, title });
    },
  },

  args: {},
};

type VideoArgs = Partial<VideoTwigContext> & {
  pictureArgs?: typeof Picture.args;
};

export const Video = /* ... */
```

Here, there's _nothing_ in the story's `.args` because I didn't want any fields in the Controls. Instead, I supply default-values for `picture` and `url` in the story-rendering function's body (as I _must_, because they are _required_ properties in `VideoTwigContext`).

Note that we _could_ still give the `.args` object `picture` and `url` properties, though `picture` would be useless in the Controls (because `picture` is a function). We could also optionally supply a default value for `title` in either the story-rendering function or the `.args` (it gets passed to the pure component but is not _required_ there); if we did so in the story-rendering function, however, then we'd probably want to do something like `title = title ?? /* ... */` instead of `title = title || /* ... */` to allow us to _bypass_ the default value like `Video({ ...Video.args, title: '' })`.

I likewise didn't give `pictureArgs` a default value (this one isn't passed to the pure component at all). The idea here is to have the `Picture()` function be called like `Picture(undefined)` by default, which, remember, is equivalent to `Picture(Picture.args)`. Having `pictureArgs` available just gives me the flexibility to do `Video({ ...Video.args, pictureArgs: /* ... */ })` as an alternative to `Video({ ...Video.args, picture: /* ... */ })` (i.e., I have two ways to specify a picture to use for a video-instance, one of which might be more convenient than the other in a given circumstance).

Now let's look at `./components/Atom/Media/Figure/Figure.stories.ts` for a rather different example:

```typescript
const FigurePureComponent = (twigContext: FigureTwigContext) =>
  FigureTemplate(twigContext);

type FigureTwigContext = {
  media: InjectedComponent<typeof Picture | typeof Video>;
  caption?: string;
  credit?: string;
  figureClasses?: string;
};

// ...

const mediaTypeOptions = ['picture', 'video'] as const;

export const FigureStory: Story<FigureArgs> = {
  name: 'Figure',

  parameters: {
    render: ({
      media,
      type,
      pictureArgs,
      videoArgs,
      caption,
      credit,
      figureClasses,
    }) => {
      media =
        media || (type === 'video' ? Video(videoArgs) : Picture(pictureArgs));
      return FigurePureComponent({ media, caption, credit, figureClasses });
    },
  },

  args: {
    type: 'picture',
    caption:
      'Optional caption for above media. Nullam quis risus eget urna mollis ornare vel eu leo. Nullam id dolor id nibh ultricies vehicula ut id elit.',
    credit: 'Optional courtesy and credit line.',
  },

  argTypes: {
    type: {
      options: mediaTypeOptions,
      control: {
        type: 'inline-radio',
      },
    },
  },
};

type FigureArgs = Partial<FigureTwigContext> & {
  type?: typeof mediaTypeOptions[number];
  pictureArgs?: typeof Picture.args;
  videoArgs?: typeof Video.args;
};

export const Figure = /* ... */
```

Here, I've put the default values for the `caption` and `credit` strings in the story's `.args`. This way, the user can customize the displayed caption and credit from the Controls while viewing the `Figure` story, and those default values will be supplied when using syntax like `Figure()` or `Figure({ ...Figure.args, /* ... */ })` (though they won't be with syntax like `Figure({ /* ... */ })` that doesn't spread in `Figure.args`).

I've _also_ put the default value for `type` in the `.args`. That one's used in the story-rendering function to help supply a default value for `media`, allowing the user (and the developer using `Figure()`!) to decide whether to construct a picture-figure or a video-figure.

Since `media` is required in `FigureTwigContext` but optional in `FigureArgs`, the story-rendering function _must_ give it a default value. By contrast, the `figureClasses` property is _optional_ in `FigureTwigContext`, so giving it a default value isn't mandatory (and I've opted not to).

The `pictureArgs` and `videoArgs` properties are just there to give the developer greater flexibility when working with the `Figure()` function:

- `Figure()` gives a default picture-figure component;
- `Figure({ ...Figure.args, type: 'video' })` gives a default video-figure component;
- `Figure({ ...Figure.args, pictureArgs: /* ... */ })` gives a picture-figure component with a picture of the developer's choosing;
- `Figure({ ...Figure.args, type: 'video', videoArgs: /* ... */ })` gives a video-figure component with a video of the developer's choosing;
- `Figure({ ...Figure.args, media: /* ... */ })` gives a picture-figure or video-figure component with a picture-or-video of the developer's choosing.

So this `Figure` example comes with some bells and whistles, but the core principle I want to convey is that you can keep the Controls UI less cluttered and more user-friendly by being thoughtful about where you set default values. My advice is: make the story-rendering function your first choice, and reach for `.args` only when you actually want to give the user customization options or when using `.args` would make things more convenient for _you_ somehow (in which case you can still use `.argTypes` to exclude properties from the Controls on a case-by-case basis). And when setting default values in the story-rendering function for properties that are _optional_ in the pure component, consider providing an escape hatch for _bypassing_ the default value (perhaps with the `??` operator).

## Important Front-End Mechanisms

### Themes (Color Schemes)

Generally, "organism"-level components (or "slabs") should be made in such a way that they can accommodate multiple color schemes ("themes"), which usually involve different combinations of background-colors and text-colors at minimum. The same may sometimes be true of certain smaller components.

To help facilitate this, I've set up a flexible theming mechanism that leverages both CSS variables and custom Tailwind [variants](https://tailwindcss.com/docs/hover-focus-and-other-states#creating-a-plugin). There's documentation for parts of it in `./storybook-config/tailwind.config.js` (the Tailwind config), but here is a summary of how the whole thing works:

1. Theme-names are defined in the `themeNames` array in the Tailwind config.
2. Themes are named for their background-colors (so each background-color option for organisms would typically get its own theme). The exception is the "default" theme, which corresponds to a white background-color. The "default" theme is special in that it's "active" when no theme-flag has been set (though it can also be activated explicitly like the others).
3. To activate a theme, set the `data-tw-theme` attribute on an element to the name of the desired theme (provided to templates as a `theme` variable in practice). The theme will now be active on _descendants_ of that element. (I recommend always using the `./components/utilities/theme-flag.twig` template for activating themes.) Some nesting of themes is supported, meaning that for a given element, the active theme is determined by the _closest_ ancestor with a `data-tw-theme` attribute. The nesting mechanism is somewhat delicate, though, and it's important to only use the `data-tw-theme` attribute when necessary (i.e., when _changing_ themes). Avoid empty or redundant `data-tw-theme` attributes. For instance, don't use `data-tw-theme="default"` as a _top-level_ theme-flag, and don't "re-activate" a theme that's already active. (Make sure the back-end developer understands this, too.)
4. To apply theme-specific styles with this mechanism, there are two options:
   1. Use a utility class that applies a color determined by a CSS variable (whose value depends on the currently active theme). Such classes are configured in the `themeColors` array in the Tailwind config. The entries of that array are objects, and the value of the `twColor` property on each object is the Tailwind color-name that you'd use in utility classes. For example, at the time of writing, the object for background-colors has `twColor: 'theme-bg-color'`, and the utility class `.bg-theme-bg-color` will set the background-color of the element accordingly. (You could also do, say, `.border-theme-bg-color`, or `.fill-theme-bg-color`; the `theme-bg-color` color is just like any other Tailwind color, except that the CSS color it resolves to depends on the currently active theme.)
   2. Use a utility class with a _theme-specific variant_, which will only have an effect if the theme in question happens to be the currently active one. For instance, if there's a theme named `"purple"`, then the utility class `.theme-purple:underline` will apply an underline to the element _only_ if the nearest ancestor with a `data-tw-theme` attribute has `data-tw-theme="purple"`.
5. As a convenience, the enum exported from the `./components/_ts-helpers/theme.ts` file serves as the source of truth for theme-names in Storybook. It needs to be (manually) kept up to date with the `themeNames` array in the Tailwind config. The idea here is that you can import the enum into your `.stories.ts` files and use it there however you see fit. Usually I create an array that's a subset of the enum's values (like `const themeOptions = [null, Theme.Default, Theme.Blue] as const`), corresponding to the theme-options that should be available to the component in question. This lets me signal to the back-end developer what the theme-options should be, and it also lets me limit the theme-options available in a story's Controls (so that users aren't presented with theme-options that the component doesn't support).
6. To create a new theme:
   1. Add its name to the `themeNames` array in the Tailwind config.
   2. In the `themeColors` array in the same file, supply values for the CSS variables that should go with the new theme.
   3. In `./components/_ts-helpers/theme.ts`, add an entry for your new theme in the `Theme` enum.
   4. If you're demoing each theme in Storybook as its own story, then make a demo for the new one.

### Vertical Rhythm

The approach to vertical-rhythm here follows the principle that non-full-bleed organisms should get top- and bottom-margin on their outermost wrapper (or on a wrapper as close as possible to outermost, with no intervening border or padding). The idea is to take advantage of [margin-collapse](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing). Full-bleed organisms (with background-color) don't "participate" in vertical-rhythm and instead get interior vertical _padding_. This way, we cover the main three situations:

1. Adjacent full-bleed organisms will touch.
2. A full-bleed organism and a non-full-bleed organism will be separated by margin.
3. Adjacent non-full-bleed organisms will be separated by margin (but not _double_-margin, thanks to margin-collapse).

Usually the class you want to reach for when applying vertical-rhythm margins is `.vertical-rhythm-standard`. It applies responsive top- and bottom-margins, and it also includes rules to "undo" those margins in special circumstances (e.g., in the region against a sidebar, the very first organism should have no top-margin, and the very last organism should have no bottom-margin). I refer you to the comments about it in the Tailwind config. There are also classes like `.mt-vertical-space` you can use to apply the standard spacing without the "undo" rules. (You can do `.py-vertical-space`, too, to use the same standard spacing for interior padding.)

To allow the non-full-bleed organisms to have their vertical-rhythms customized on a case-by-case basis, we almost always do `class="{{ verticalRhythm|default('vertical-rhythm-standard') }}"` in the Twig templates. This applies the `.vertical-rhythm-standard` class unless a `verticalRhythm` variable is passed in to override it.

### Containers

Tailwind comes with a [`.container`](https://tailwindcss.com/docs/container) component for constraining content-width to the width of the current breakpoint. If you look in the Tailwind config, you'll see that we're actually rolling our own version of this, which essentially does the same thing but only with the breakpoints we specify (this lets us add responsive Tailwind variants that _don't_ affect `.container`). It includes some horizontal padding, and it centers the content.

We use this `.container` class&mdash;or variants of it&mdash;for virtually every organism. For full-bleed organisms, it's typically pretty simple: the wrapper with `.container` should go inside the wrapper that applies the background-color.

Things are a little more complicated with non-full-bleed pieces. This is because they sometimes require that we "undo" their `.container` in certain circumstances. For example, if a non-full-bleed piece appears next to a sidebar, then applying the `.container` while the sidebar is "up" would introduce unwanted extra padding.

For this reason, it's better to use the special `.conditional-container` class for non-full-bleed pieces. This class comes with some rules that will "undo" the container-styles in appropriate circumstances. I refer you to the comments about it in the Tailwind config. Generally the wrapper with this class should go inside the wrapper that applies the organism's vertical-rhythm margins.

We also have a `.no-container` class that can be used to "undo" a `.container` at a specified breakpoint, say (e.g., `div.container.lg:no-container`). Usually the `.conditional-container` suffices, though.

Finally, if you're working inside a `.container` region and need to make an element "break out" to go full-bleed: first see if you can accomplish the same thing by refactoring and not having to "break out" of a container; then, if you can't, use `.-mx-container-offset`. The reason to avoid it if possible is that it uses `100vw` in a `calc()`, and unfortunately `100vw` includes the width of the vertical scrollbar, which results in [some small horizontal overflow](https://destroytoday.com/blog/100vw-and-the-horizontal-overflow-you-probably-didnt-know-about). We _are_ correcting for this with JavaScript (see `./components/global-scripts/realVw.ts`), so the overflow won't actually appear 99% of the time, but problems can arise in edge cases. Also, some people have JavaScript disabled.

Note that the `.container` component discussed here has nothing whatsoever to do with the container-query mechanism discussed below.

### Container Queries

The `./components/utilities/container-query.twig` file and its accompanying `./components/utilities/container-query.ts` script work together as a [container-query](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries) mechanism.

**Note:** this mechanism adds conceptual overhead and some CSS "bloat." If you'd prefer not to use it, then here is how to disable it:

1. In the `docker/bookbinder/postcss.config.js` file, delete this:

   ```javascript
   require('/app/postcss-custom-plugins/postcss-tailwindcss-container-query')({
    containerQueryAncestorSelector: '[data-container-query-ancestor]',
   }),
   ```

2. Delete the `./utilities/container-query.ts` file.
3. Optionally, remove any `include` or `embed` statements in Twig files that refer to the `@components/utilities/container-query.twig` template. (Leaving them in shouldn't do any harm, but it might confuse people.)

If you decide to use the container-query mechanism, here is what you need to know:

The client-side script works on page-load by finding any element with the `data-container-query-ancestor` attribute, iterating through its descendants, and replacing their _media_-query-based utility classes (like `.sm:py-10`) with _container_-query-based classes (like `._sm:py-10`) that are automatically generated by a custom PostCSS plugin (`docker/bookbinder/postcss-custom-plugins/postcss-tailwindcss-container-query.js`). A [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) is used to make those descendant-elements responsive to the width of the `[data-container-query-ancestor]` element (as opposed to the width of the viewport).

Note that because of the script's find-and-replace mechanism, you don't have to do anything special when developing a component to make it usable in a container-query context. Just use Tailwind's responsive classes (like `sm:py-10`) as you normally would. If the component appears as a descendant of a container-query ancestor, then the script will take care of the rest.

The major limitation here is that the mechanism only works for Tailwind classes that appear directly in the DOM. That's part of why I use in-markup utility classes almost exclusively (though the Tailwind folks also [recommend this approach](https://tailwindcss.com/docs/reusing-styles)).

Some important details:

- The mechanism supports up to two "layers" of container-query ancestors. By that I mean: if there is one `[data-container-query-ancestor]` element nested within another, then the descendants of the inner one will correctly respond to the width of the inner one only, but having _another_ `[data-container-query-ancestor]` element nested within the inner one will give undesirable results. For that reason, it's crucial to avoid inadvertent `[data-container-query-ancestor]` elements.
- When there's a sidebar present, the sidebar and the region against it are each individually wrapped in a `[data-container-query-ancestor]` element (see `./components/Page/Page.twig`). Likewise, the "constrained-content" helper gets the container-query treatment (see `./components/PageHelper/ConstrainedContent/ConstrainedContent.twig`).
- There's an "escape hatch": if an element appears as a descendant of a `[data-container-query-ancestor]` but has the `.no-container-query` class, then it will _not_ have its media-query-based classes replaced with container-query-based classes. Its descendants are _not_ automatically escape-hatched; the escape-hatch applies only to the element in question. If you use the `.no-container-query-deep` class instead, then the element's descendants _will_ also be escape-hatched.
- Since this mechanism relies on client-side JavaScript, it's best not to use it on anything "above the fold" (to avoid visible "flashes" on page-load), and it's also best not to use it in such a way that the content is _unreadable_ without it (because some users have JavaScript disabled).

### WYSIWYG Styles and WYSIWYG-Embeds

We're using Tailwind's [Typography plugin](https://tailwindcss.com/docs/typography-plugin) for our WYSIWYG styles. We customize it in the Tailwind config. To insert a WYSIWYG section into a component, just use `./components/Organism/Editorial/Editorial.twig`, which is already configured to use those styles. (The `.prose` class establishes a WYSIWYG region.)

Note that we're using the Typography plugin in "legacy mode," which disables the `:where()` selector and the [`.not-prose` mechanism](https://tailwindcss.com/docs/typography-plugin#undoing-typography-styles) for "undoing" Typography styles. We do this for two reasons:

1. Wider browser support (Safari).
2. We have a custom PostCSS plugin (see `docker/bookbinder/postcss-custom-plugins/postcss-tailwindcss-typography-embeds.js`) that handles "undoing" Typography styles more robustly than the Typography plugin does natively.

To embed a component in a WYSIWYG region without the Typography plugin's `.prose` styles leaking in, use the `.wysiwyg-embed` class on the outermost wrapper of the component. Moreover:

- If the component should be floated left, do `div.wysiwyg-embed.tw-align-left`.
- If the component should be floated right, do `div.wysiwyg-embed.tw-align-right`.
- If the component should be centered, do `div.wysiwyg-embed.tw-align-center`.
- If the component should be neither floated nor centered, do `div.wysiwyg-embed.tw-align-none`. This will just apply some vertical-margin; the embedded component will be flush to the left (but not floated).
- If you have the [container-query mechanism](#container-queries) enabled, then usually you'll also want to add the `data-container-query-ancestor` attribute to the `div.wysiwyg-embed` wrappers, particularly the floated ones.

The `.prose`/`.wysiwyg-embed` mechanism has _limited_ nesting support: a `.wysiwyg-embed` can have a `.prose` section, and the nested `.prose` can have its own `.wysiwyg-embed` regions, but the mechanism can only handle a few "layers," which means that it's important to avoid inadvertent `.prose` and `.wysiwyg-embed` elements.

### Linkify

The `./components/utilities/linkify.twig` file and its accompanying `./components/utilities/linkify.ts` script are for turning a non-link element into an "effective" link by giving it a click-handler that navigates to the provided URL. Navigation _won't_ occur if a button or link within the element in question was clicked, or if the user has highlighted some text within the element.

This utility is helpful for avoiding redundant adjacent links, which are bad for accessibility reasons.

For example, if an image next to a link is supposed to be a link that goes to the same place, then "linkifying" the image instead of making it a true link results in a better UX for people using a keyboard or a screen-reader. An [alternative](https://www.w3.org/WAI/WCAG22/Techniques/html/H2) that sometimes works is combining image and link-text into a single link.

Another good use-case for this mechanism is when you have an entire "card" that's supposed to be a link that goes to the same place as a link it already contains. An alternative that sometimes works here is to just make the whole card the link and make the link-text _not_ a link (though opinions vary on whether this is a good idea). Another alternative is to use an absolute-positioned `::before` or `::after` on the link to make the link's clickable area cover the whole relative-positioned card (this is what Bootstrap's [`.stretched-link`](https://getbootstrap.com/docs/5.0/helpers/stretched-link/) helper does). However, if the card contains a _second_ link (like a category-tag), then neither of these alternatives will suffice (at least not without some `z-index` and `position` tinkering, as mentioned in the above Bootstrap link), and linkifying the card is likely the better option. Even if the card just contains some additional _text_, linkifying is arguably preferable to the alternatives, for the simple reason that users should be able to easily highlight that text without triggering navigation.

One downside to using this utility is that hovering over a linkified element won't result in the target-URL being displayed at the bottom of the browser window (as happens when hovering over a normal link).

Note: if you use the linkify mechanism, make sure that the back-end developers know about it. This is especially important when working with third-party integrators who aren't using the Twig templates directly; they need to know what to do with the `data-linkify-url` attributes they see in the HTML.