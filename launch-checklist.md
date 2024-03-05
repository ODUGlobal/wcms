# QA / Launch checklist for ODUGlobal

- hostname: online.odu.edu
- other hostnames: dl.odu.edu, plus.odu.edu, www.online.odu.edu, global.odu.edu
- Pantheon relaunch protocols: https://docs.pantheon.io/relaunch

## Pre-Launch - DNS / Domain / Infrastructure
- [x] (ODUGlobal) Determine authoritative DNS servers and if lead-time is needed for changes to be enacted. (Basecamped)
- [x] (ODUGlobal) Verify the domain records are accessible at registrar if DNS servers need to change. (Basecamped)
- [x] (ODUGlobal) Determine if there is an internal DNS server on internal network. (Basecamped)

## Pre-Launch - Standards and Validation
- [x] (NewCity) Create a representative list of URLs to be tested
    - https://live-odu-global-2023.pantheonsite.io/
    - https://live-odu-global-2023.pantheonsite.io/online-experience
    - https://live-odu-global-2023.pantheonsite.io/academics
    - https://live-odu-global-2023.pantheonsite.io/admissions
    - https://live-odu-global-2023.pantheonsite.io/cost
    - https://live-odu-global-2023.pantheonsite.io/about-us
    - https://live-odu-global-2023.pantheonsite.io/academics/degree/bachelors-programs
    - https://live-odu-global-2023.pantheonsite.io/academics/programs/accounting-degree
    - https://live-odu-global-2023.pantheonsite.io/news-and-events
    - https://live-odu-global-2023.pantheonsite.io/news/rachel-jones-2023-whro-emerging-leaders-advisory-board
    - https://live-odu-global-2023.pantheonsite.io/staff
- [x] (NewCity) Test representative list of URLs with WAVE against WCAG 2.1 AA, including contrast checks
- [x] (NewCity) Verify visible skip-to-main-content navigation? (#50)
- [x] (NewCity) Test representative list of URLs for colorblindness-related issues (tested SB)
- [x] (NewCity) Test representative list of URLs with a keyboard, testing logical ordering, non-disappearing indicator
- [x] (NewCity) Run a full-site scan for accessibility - WGAG AA 2.1
- [x] (NewCity) Provide list of inaccessible PDF/Docx files to content creators
- [ ] (NewCity) Run a screenreader (Apple Voiceover / Chromevox) across representative URLs
- [x] (NewCity) HTML validation - check for unclosed tags
- [x] (NewCity) JavaScript - check for errors, unnecessary console logging

## Pre-Launch - SEO and Metrics
- [x] (NewCity) Make sure Metatag is installed for metatag support
- [x] (NewCity) Verify robots.txt rejects search engines during development phase
- [x] (NewCity) Verify page titles are in title tag and that each page title is unique
- [x] (NewCity) Check for out-of-order headers, empty headers
- [x] (NewCity) Verify that content creators have ability to edit metadata
- [x] (NewCity) Is there a 404 page for invalid URLs? (#118)
- [x] (NewCity) Does 404 page actually return a 404 error code?  Check via curl -I
- [x] (NewCity, ODUGlobal) Run a full-site 404 scan, address issues
- [x] (NewCity) 301 redirect non-https to https
- [x] (NewCity) Remove trailing slashes from URLs
- [x] (NewCity) Set up Google Tag Manager connection in CMS
- [x] (NewCity) Create a Google XML sitemap for content with Simple XML module

## Pre-Launch - Functional and Content Testing
- [x] (NewCity, ODUGlobal) Ensure email sending from website uses either an SMTP acct or a sending service (#119)
- [ ] (ODUGlobal) Test all forms.  Ensure they also save their data somewhere, send to thank you page
- [x] (NewCity) Update main site email address to final address
- [x] (NewCity) Get a design / UX review
- [x] (NewCity) Make sure CMS is performing adequate image compression and enforcing maximum dimensions
- [x] (NewCity) Change site's regional settings (time zone, etc)
- [x] (NewCity) Ensure that bug-reporting strategy is in place
- [x] (NewCity) Perform responsive testing - verify using most recent version of browsers (esp Chrome)
- [ ] (NewCity) Scan for spelling errors, submit list to content editors
- [x] (NewCity) If applicable, is there an emergency banner implemented? (#149)
- [x] (NewCity) Install same favicons as current site (#51)
- [x] (NewCity) Check for hard-coded links to staging domain
- [x] (NewCity) Ensure there is no test content on site
- [x] (NewCity) Remove all test accounts
- [ ] (NewCity) Verify that a print stylesheet has been created and works for important areas
- [x] (NewCity) Check search functionality

## Pre-Launch - Security/Risk
- [x] (NewCity) Modify robots.txt to add any needed exclusions
- [x] (NewCity) Monitoring - set up any needed uptime or service-related checks
- [x] (NewCity) Verify user registration is turned off.
- [x] (NewCity) Verify commenting is turned off.

## Pre-Launch - Performance
- [x] (NewCity) Check for giant images - implement image resizing if needed
- [x] (NewCity) Check for unnecessary png files where jpegs would be appropriate
- [x] (NewCity) Check for pages with a total asset weight of 3 megs or more
- [x] (NewCity) Check total page size/download time under 3 seconds
- [x] (NewCity) Check time to first byte
- [ ] (NewCity) Run thru webpagetest.org / Google PageSpeed Insights, each page should get a PageSpeed score of above 90
- [x] (NewCity) Check that main stylesheet file is not > 1 MB


## Launch Day
- [x] (NewCity, ODUGlobal) Coordinate changing DNS to point to new server
- [x] (NewCity) set the new site to be a paid site with level Performance XL
- [x] (NewCity) remove the hostnames from current online.odu.edu
- [x] (NewCity) add the hostnames to live-odu-global-2023
- [x] (NewCity) clear caches on old live env
- [x] (NewCity) clear caches on new live env
- [x] (NewCity) set the primary domain to online.odu.edu in new live env
- [x] (NewCity) wait for SSL provisioning (if we need to)
- [x] (NewCity) change old site to from paid to sandbox
- [x] (NewCity) Verify search results
- [x] (NewCity) Disable devel module if enabled
- [x] (NewCity) Page caching / Javascript/CSS combination
- [x] (NewCity) Get redis in place
- [x] (NewCity) Update sitemap base URL, if applicable
- [x] (NewCity) Refresh XML Sitemap and submit it to Google
- [x] (NewCity) Verify analytics data is flowing
- [x] (NewCity) Verify robots.txt allows search engines
- [x] (NewCity) Verify Varnish and Redis hits are happening at Pantheon with curl and redis client
- [x] (NewCity) redirect live pantheon URL

## Day after launch
- [ ] (NewCity, ODUGlobal) Post-launch maintenance - determine who will be responsible for applying post-launch security updates
- [ ] (ODUGlobal) Change TTL back to original settings if needed
- [ ] (NewCity, ODUGlobal) Check analytics for problems, popular pages etc. and adjust as necessary
- [ ] (NewCity) Reenable stage_file_proxy with updated domain if in use

