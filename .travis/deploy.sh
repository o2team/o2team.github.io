#!/bin/bash
if [ "$1" = "false" ]
# not a pull request, deploy to github pages
then ( cd dist
  git init
  git config user.name "aotu-travis"
  git config user.email "aotu@jd.com"
  git add .
  git commit -m "Deployed from Travis CI"
  git push --force --quiet "https://${GH_TOKEN}@${GH_REPO}" master:master
)
fi
