#!/bin/bash
if [ "$1" = "false" ]
# not a pull request, deploy to github pages
then ( cd public
  git init
  git config user.name "AOTULabs"
  git config user.email "o2labs@qq.com"
  git add .
  git commit -m "Deployed from Travis CI"
  git push --force --quiet "https://${GH_TOKEN}@${GH_REPO}" master:master
)
fi