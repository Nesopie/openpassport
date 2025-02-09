#!/bin/bash

# echo $1
# url=$(curl -L   -H "Accept: application/vnd.github+json"    -H "X-GitHub-Api-Version: 2022-11-28"    https://api.github.com/repos/nesopie/openpassport/actions/artifacts | jq -r '.artifacts[0].archive_download_url')
# curl -L -H "Authorization: Bearer $1" -o artifact.zip $url
unzip artifact.zip -d circuits