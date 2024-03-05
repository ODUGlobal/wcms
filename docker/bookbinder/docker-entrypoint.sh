#!/bin/sh

if [ "$MODE" = "build" ]; then
    # crash on error
    set -e
    npm run build-tailwind-config-json
    npm run build-js
    npm run build-css
    npm run build
else
    npm run build-tailwind-config-json

    # @TODO: does storybook provides hooks/events to run css/js compile on update?
    npm run watch-css &
    npm run watch-js &
    npm run watch-tailwind-config &
    npm run start
fi