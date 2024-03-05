// FILL THIS OUT
const REPO_NAME = 'odu-global-2023';

if (REPO_NAME.length) {
  window.frontback = {
    repo: 'https://gitlab.insidenewcity.com/newcity/' + REPO_NAME,
    postUrl: 'https://magicyeti.us/frontback',
  };
  const script = document.createElement('script');
  script.src = window.frontback.postUrl + '/assets/js/frontback.js';
  document.body.appendChild(script);
} else {
  console.warn(
    `frontback won't work until you supply the repo name at the top of \`inject-frontback.ts\` (and set it up on the back-end)`
  );
}
