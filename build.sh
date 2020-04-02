#!/usr/bin/env sh

# abort on errors
set -e

#while getopts ":gnp" opt; do
#  case ${opt} in
#    g ) # process option a
#      echo 'Process like Github'
#      export DEST=GITHUB
#      ;;
#    n ) # process option t
#      echo 'Process like Netlify'
#      export DEST=NETLIFY
#      ;;
#    p )
#      echo 'Production Work'
#      ;;
#    \? ) echo "Usage: cmd [-g] [-n] [-p]"
#      ;;
#  esac
#done


# build
export NODE_ENV=production
cd questions/ && node toJson.js -l -m question_set && cd ../ && echo 'Complete QBASE build'
npm run build

git add dist/*


