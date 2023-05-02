#!/usr/bin/env bash

git push &&
  git checkout qa &&
  git merge dev && git push &&
  git checkout main &&
  git merge qa && git push &&
  git checkout dev &&
  echo "Done! 🎉"
