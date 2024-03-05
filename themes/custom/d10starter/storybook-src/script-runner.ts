/// <reference types="webpack-env" />

/* eslint-disable import/no-import-module-exports */

/*
  This script sets up the automatic execution of each pattern `.js` or `.ts` file
  whenever its corresponding Twig template is newly rendered in Storybook. It also
  sets up the automatic execution of each custom global script whenever a new story
  is rendered in Storybook (a global script being a `.js` or `.ts` file in the
  `global-scripts` folder). It works with Webpack's hot-module-replacement API to detect
  all such scripts and to manage their execution as needed (so DO NOT `import` the
  `.js`/`.ts` files in question into any other module).

  (This script ALSO serves as a makeshift Storybook add-on that makes the HTML and component-level
  JS/CSS assets downloadable from within the Storybook UI. Ideally this would be done separately,
  but it makes use of some of the same mechanisms as the script-runner, so it's simplest to just
  lump them together for the time being. Note that updates to the assets require a page-reload
  to be reflected in the exported ZIP files. Not sure if there's a way around that, but it doesn't
  matter because this is really a feature for use in PRODUCTION mode for clients.)

  To use this (the actual script-loader):

  1. Make sure the PREREQUISITES are met (see below). (They already should be.)

  2. Within a descendant-directory of the `COMPONENTS` directory defined in the
  Webpack config (see PREREQUISITES), give a `.twig` file and `.js` (or `.ts`) file the
  same name (e.g., `header.ts` and `header.twig`). (For a global script, there's no need
  for a Twig file; just put the JS/TS file in the `global-scripts` directory.)

  3. Use the `export default` syntax to export a single function from the `.js`/`.ts` file, like this:

  const setUpComponent = () => {};
  if (!window.IS_STORYBOOK) setUpComponent();
  export default setUpComponent;

  The `if (!window.IS_STORYBOOK)` conditional will evaluate to true on the live site (so
  that the code actually executes there!) but to false in Storybook (where the function
  should only run when we tell it to in this script-runner). For the version on the live site,
  you'll want to either strip out the `export` statement (easily done with Babel and
  `babel-plugin-transform-remove-export` -- this should already be set up in the repo)
  or use `type="module"` on the `<script>` tag. Otherwise the `export` statement will throw an error.


  PREREQUISITES:

  1. A `COMPONENTS` variable defined in the Webpack config, which specifies the directory
  where the components live. It must be defined with the `webpack.DefinePlugin` method
  in the config's `plugin` array, like:
  `plugins: [new webpack.DefinePlugin({ COMPONENTS: '"/components"' })]`

  2. The presence of `<!-- START: [[TwigFilepath]] -->` comments in the HTML before a
  given template's markup, where [[TwigFilepath]] is the filepath of the Twig template
  relative to the project root, like `/components/Button/Button.twig`. This can be done
  programmatically with a custom webpack loader that alters the source before it hits
  whatever Twig loader is being used. The recipe is:

  const path = require('path');

  // eslint-disable-next-line func-names
  module.exports = function (source) {
    const relativePath = '/' + path.relative(this.rootContext, this.resourcePath);
    if (source.trimStart().startsWith('{% extends ')) {
      return `{% block _startExtends %}<!-- START: ${relativePath} -->{% endblock %}\n${source}\n{% block _endExtends %}<!-- END: ${relativePath} -->{% endblock %}`;
    }
    return `<!-- START: ${relativePath} -->\n${source}\n<!-- END: ${relativePath} -->`;
  };

  (This should already be configured in this repository.)
*/

// (for the asset-exporter)
import JSZip from 'jszip';
import { format as prettierFormat } from 'prettier/standalone';
import prettierHtml from 'prettier/parser-html';

/* needed to prevent this file from getting hot-reloaded itself */
if (module.hot) {
  module.hot.decline();
}

window.IS_STORYBOOK = true;

/*
  For pattern-level scripts to store ResizeObservers, MutationObservers and IntersectionObservers,
  so that we can disconnect them on story-change (see MutationObserver below).
*/
if (!window.observers) {
  window.observers = new Set();
}

/*
  For pattern-level scripts to store Vimeo instances, so that we can destroy old ones on story-change
  (see MutationObserver below).
*/
if (!window.VimeoPlayers) {
  window.VimeoPlayers = new Set();
}

/*
  For pattern-level scripts to store Accessible Slick sliders, so that we can destroy
  old ones on story-change (see MutationObserver below).
*/
if (!window.SlickSliders) {
  window.SlickSliders = new Set();
}

const root = document.querySelector('#storybook-root');
if (!root) throw Error('No #storybook-root found in document.');

const docsRoot = document.querySelector('#storybook-docs');
if (!docsRoot) throw Error('No #storybook-docs found in document.');

const scriptImports = require.context(
  COMPONENTS,
  true,
  /(?<!stories)\.(?:j|t)s$/
);

interface ScriptModule extends NodeModule {
  default?: unknown;
}

// a cache for keeping up-to-date JS/TS modules
const scriptModules = new Map<string, ScriptModule>(
  scriptImports.keys().map((key) => [key, scriptImports(key)])
);

if (module.hot) {
  module.hot.accept(scriptImports.id, () => {
    // this callback runs whenever pattern-level scripts have changed or been created/deleted

    // get a fresh scripts-import to compare against `scriptModules`
    const freshScriptImports = require.context(
      COMPONENTS,
      true,
      /(?<!stories)\.(?:j|t)s$/
    );
    const freshScriptModules = new Map<string, ScriptModule>(
      freshScriptImports.keys().map((key) => [key, freshScriptImports(key)])
    );

    // remove any deleted scripts from `scriptModules`
    for (const [key] of scriptModules) {
      if (!freshScriptModules.has(key)) scriptModules.delete(key);
    }

    /*
      We also want the page to reload whenever a script needed for the currently displayed
      story has been updated (because scripts should always execute only once). If needed,
      we could hook into the "Remount component" button in the Storybook UI for this purpose,
      but for now we don't need to: as of Storybook 7, saving changes to a script already forces
      a reload in Storybook.
    */
  });
}

/*
  In case a script has left listeners on anything above #storybook-root (like document or Window),
  we intercept all added event-listeners and remove them when selecting a different story.
  Otherwise these listeners can break behavior in other stories or when returning
  to the story that added them (the latter is more likely and has already happened).
  This comes with risk of breaking handlers put in place by Storybook or its add-ons;
  that hasn't proved a problem yet, but it's worth keeping in mind. I have not
  found a way to target only the handlers added by pattern-scripts. (I've tried stack-tracing,
  but the implementations vary too widely across browsers.)

  Also, pattern-level scripts should store ResizeObservers, MutationObservers and IntersectionObservers
  in the global `window.observers` Set (in Storybook only), so that we can disconnect them on story-change
  (happens in the MutationObserver below, along with the event-listener removals).
*/

const removers = new Set<() => void>();

EventTarget.prototype.addEventListener = new Proxy(
  // eslint-disable-next-line @typescript-eslint/unbound-method
  EventTarget.prototype.addEventListener,
  {
    apply(
      addEventListener,
      eventTarget: EventTarget,
      args: Parameters<typeof EventTarget.prototype.addEventListener>
    ) {
      /*
        Make exception for Frontback.
        Note: EXTREMELY imperfect right now, b/c the most reliable thing to detect is
        the function-as-string, and Frontback is just using the generic jQuery handler, which other
        listeners might be using as well. So it's possible that we'll inadvertently detect
        other handlers here too, in which case they won't get removed on story-change either.
        If Frontback ever stops working, it could be because the function-as-string has changed
        as a result of an update to Frontback (or its jQuery dependency). In that case, console-log
        `args[1]` and update the `.toString().includes('')` argument accordingly, below (just with the
        function body, though, b/c otherwise there are some browser-specific differences to worry about).
      */
      const mightBeFrontback = args[1]
        ?.toString()
        .includes(
          'return void 0!==jQuery&&jQuery.event.triggered!==e.type?jQuery.event.dispatch.apply(elem,arguments):void 0'
        );

      if (
        !mightBeFrontback &&
        (eventTarget instanceof Window ||
          eventTarget instanceof Document ||
          (eventTarget instanceof Element && !docsRoot.contains(eventTarget)))
      ) {
        removers.add(() =>
          (eventTarget as EventTarget).removeEventListener(...args)
        );
      }

      return addEventListener.apply(eventTarget, args);
    },
  }
);

new MutationObserver(() => {
  // (for the asset-exporter)
  window
    .top!.document.querySelectorAll('#assets-zip-downloader')
    .forEach((e) => e.remove());

  // first remove event-listeners
  removers.forEach((removeListener) => removeListener());
  removers.clear();
  console.log(
    '[STORYBOOK TWIG SCRIPT-RUNNER] all event-listeners in #storybook-preview-iframe removed'
  );

  // remove all jQuery events if applicable
  window.jQuery?.('*').off();

  /*
    also remove any dependencies fetched by pattern-scripts if they are causing problems
    on story-switching (but be careful: don't delete if fetched by other mechanism!)
  */
  delete window.jQuery?.magnificPopup;
  document.head.querySelector('script[src*="magnific-popup"]')?.remove();
  if (window.YT) window.YT = null; // it's undeletable but this allows for a boolean check
  if (window.pym) delete window.pym;
  if (window.Tabby) delete window.Tabby;

  // and remove any elements as necessary (modals, attached outside #storybook-root, for example)
  document.querySelectorAll('body > [class*="mfp"]').forEach((e) => e.remove());
  document
    .querySelector('script[src*="jquery-accessible-tabpanel-aria"]')
    ?.remove();

  // disconnect pattern-level ResizeObservers, MutationObservers, and IntersectionObservers
  window.observers?.forEach((observer) => observer.disconnect());
  window.observers?.clear();

  // destroy any existing Vimeo instances
  window.VimeoPlayers?.forEach((player) => {
    player.destroy().catch(console.error);
  });
  window.VimeoPlayers?.clear();

  // destroy any existing Accessible Slick sliders
  window.SlickSliders?.forEach((slider) => {
    try {
      slider.slick('unslick');
    } catch (err) {
      console.error(err);
    }
  });
  window.SlickSliders?.clear();

  /*
    Then cycle through the HTML comment-hooks to find which component-level scripts
    are needed, and keep track of them in a Set.
  */
  const twigKeys = new Set<string>();

  const commentPrefix = `START: ${COMPONENTS}`;

  const nodeIterator = document.createNodeIterator(
    root,
    NodeFilter.SHOW_COMMENT
  );
  let currentNode: Node | null = null;
  while ((currentNode = nodeIterator.nextNode())) {
    const value = currentNode.nodeValue?.trim();
    if (value?.startsWith(commentPrefix)) {
      twigKeys.add(value.replace(RegExp(`^${commentPrefix}`), '.'));
    }
  }

  // (for the asset-exporter)
  const assets = new Map<string, string>();

  const { id: currentStoryId } =
    window.__STORYBOOK_PREVIEW__?.currentRender?.story || {};
  const { storyRenders = [] } = window.__STORYBOOK_PREVIEW__ || {};
  const { simulateNoJs } =
    storyRenders[storyRenders.length - 1]?.store?.args?.argsByStoryId?.[
      currentStoryId || ''
    ] || {};

  // if `simulateNoJs`, convert `<noscript>` tags to `<div>` tags and delete `--real-vw`
  if (simulateNoJs) {
    const noscripts = document.querySelectorAll('noscript');
    noscripts.forEach((noscript) => {
      const div = document.createElement('div');
      div.innerHTML = noscript.innerText;
      // for the `#noscript-style-wrapper` in the `<head>`, really
      if (noscript.id) {
        div.id = noscript.id;
      }
      noscript.replaceWith(div);
    });
    document.documentElement.style.removeProperty('--real-vw');
  }

  // otherwise, run the scripts
  else {
    // (first, change the `#noscript-style-wrapper` in the `<head>` back to a `<noscript>` if needed)
    const noscriptStyleWrapper = document.getElementById(
      'noscript-style-wrapper'
    );
    if (noscriptStyleWrapper instanceof HTMLDivElement) {
      const noscript = document.createElement('noscript');
      noscript.innerHTML = noscriptStyleWrapper.innerHTML;
      noscript.id = noscriptStyleWrapper.id;
      noscriptStyleWrapper.replaceWith(noscript);
    }

    // run global custom scripts and add to assets
    for (const [key, scriptModule] of scriptModules) {
      if (key.startsWith('./global-scripts/')) {
        const fn = scriptModule.default;

        if (typeof fn === 'function') {
          console.log(
            `[STORYBOOK TWIG SCRIPT-RUNNER] executing ${
              fn.name || 'anonymous function'
            }, a global script`
          );
          fn();
        }

        if (self !== top) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const script = require('/app/dist/asset-txt/' +
              key
                .replace('.', 'components')
                .replace(/\.(?:t|j)s$/, '.js.txt')) as string;
            if (script) {
              assets.set(
                key.replace('./', '').replace(/\.(?:t|j)s$/, '.js'),
                script
              );
            }
          } catch {}
        }
      }
    }

    const patternScripts: (() => void)[] = [];

    for (const twigKey of twigKeys) {
      // (for the asset-exporter)
      let script: string | undefined = undefined,
        style: string | undefined = undefined;
      if (self !== top) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          script = require('/app/dist/asset-txt/' +
            twigKey
              .replace('.', 'components')
              .replace('.twig', '.js.txt')) as string;
        } catch {}
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          style = require('/app/dist/asset-txt/' +
            twigKey
              .replace('.', 'components')
              .replace('.twig', '.css.txt')) as string;
        } catch {}

        if (script) {
          assets.set(
            twigKey.replace('.', 'component-assets').replace('.twig', '.js'),
            script
          );
        }

        if (style) {
          assets.set(
            twigKey.replace('.', 'component-assets').replace('.twig', '.css'),
            style
          );
        }
      }

      const scriptModuleKeyJs = twigKey.replace(/twig$/, 'js');
      const scriptModuleKeyTs = twigKey.replace(/twig$/, 'ts');
      const scriptModule =
        scriptModules.get(scriptModuleKeyJs) ||
        scriptModules.get(scriptModuleKeyTs);

      const fn = scriptModule?.default;

      if (typeof fn === 'function') {
        const logAndRunFn = () => {
          console.log(
            `[STORYBOOK TWIG SCRIPT-RUNNER] executing ${
              fn.name || 'anonymous function'
            } for ${twigKey}`
          );
          fn();
        };

        /*
          Here, can fine-tune order of script-execution, if needed (by checking `fn.name`
          and using `.unshift()` instead of `.push()` to add to array).
        */
        patternScripts.push(logAndRunFn);
      }
    }

    patternScripts.forEach((fn) => fn());
  }

  // (for the asset-exporter)
  const folderName =
    (window.top!.document.querySelector('.sidebar-item[data-selected="true"]')
      ?.id || 'component') + '_markup-and-assets';

  const zip = new JSZip();

  for (const [path, contents] of assets) {
    zip.file(`${folderName}/${path}`, contents);
  }

  // window.STORYBOOK_RENDERED_STORY is set in `global-loaders` on every story-render
  zip.file(
    `${folderName}/markup.html`,
    prettierFormat(window.STORYBOOK_RENDERED_STORY, {
      htmlWhitespaceSensitivity: 'strict',
      parser: 'html',
      plugins: [prettierHtml],
    })
  );

  const tailwindStyles = [...document.querySelectorAll('style')].find((style) =>
    style.textContent?.includes('! tailwindcss v')
  )?.textContent;

  if (tailwindStyles) {
    zip.file(`${folderName}/tailwind.css`, tailwindStyles);
  }

  // add a README
  zip.file(
    `${folderName}/README.txt`,
    `
In this directory, you'll find:

• this \`README.txt\` file;

• a \`markup.html\` file containing the HTML for the story whose assets you exported from Storybook (note: this HTML is the markup as it appears before any client-side JavaScript has had a chance to alter it);

• a \`tailwind.css\` file containing the global custom CSS for the site (there's no fool-proof programmatic way to extract from it only the CSS that's needed for a given story, but if it's absolutely necessary that you have a smaller CSS file for just this story, then you can ask NewCity to give it a try);

• possibly a \`component-assets\` directory that, if present, contains the custom client-side JavaScript files that are needed for specific components used in this story;

• possibly a \`global-scripts\` directory that, if present, contains the GLOBAL custom client-side JavaScript files that are configured to run with every story in Storybook, including this one.


In this directory, you will NOT find:

• images and other kinds of media-assets (relevant for elements like \`<img src="/foo.jpg" />\` in the HTML, which won't work without a corresponding file at the specified path);

• third-party dependencies like fonts and any non-custom JS and CSS files that this story needs (if there are any). These third-party dependencies can be found in the \`.storybook/preview-head.html\` file of the repository for this Storybook pattern library, or in the \`<head>\` of the \`<iframe>\` that displays the stories in Storybook. If you need help here, please don't hesitate to ask NewCity!
    `.trim()
  );

  zip
    .generateAsync({ type: 'blob' })
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const tablist = window.top!.document.querySelector(
        '#storybook-panel-root [role="tablist"]'
      );
      if (!tablist) return;

      const classes = tablist
        .querySelector('[role="tab"]:not(.tabbutton-active)')
        ?.className?.replace('tabbutton', '');

      const button = document.createElement('button');
      if (classes) button.className = classes;
      button.id = 'assets-zip-downloader';
      button.textContent = 'Download HTML and CSS/JS assets as ZIP';
      button.onclick = () => window.location.replace(url);

      window
        .top!.document.querySelectorAll('#assets-zip-downloader')
        .forEach((e) => e.remove());

      const lastTablistButton = [...tablist.children]
        .reverse()
        .find((el) => el.matches('button'));
      if (lastTablistButton) {
        lastTablistButton.insertAdjacentElement('afterend', button);
      } else {
        tablist.appendChild(button);
      }
    })
    .catch(console.error);
}).observe(root, { childList: true, subtree: false });

/*
  Account for switching from Docs-story to normal-story, because in that
  case the normal mechanism isn't working quite right (I think the issue
  is scripts running on "stale" markup that they've already run on).
  To do this, we watch for the `root` element's `hidden` attribute to
  change, and use SB's "Remount component" button to reload story in response.
  But there's a timing issue, so we have to wait a bit before clicking
  the button (1 second seems to do the trick).
*/
new MutationObserver(() => {
  setTimeout(() => {
    top?.document
      .querySelector<HTMLButtonElement>('button[title="Remount component"]')
      ?.click();
  }, 1000);
}).observe(root, { attributeFilter: ['hidden'] });

console.warn(
  '[STORYBOOK TWIG SCRIPT-RUNNER] All `EventListener`s in\
 #storybook-preview-iframe will be removed upon selecting a different story.\
 This prevents listeners added in one story from causing problems in another\
 story (or, more likely, in the same story when returning to it), but it also\
 risks removing listeners added by Storybook or Storybook add-ons, which could\
 potentially cause problems. (No problems found yet, but be advised.)'
);
