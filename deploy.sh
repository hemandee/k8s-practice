#!/usr/bin/env sh

# abort on errors
set -e

# build
export NODE_ENV=production
cd questions/ && node toJson.js -l -m question_set && cd ../
npm run build

git add dist/*
git commit -a -m 'deploy'  && git subtree push --prefix dist origin gh-pages

