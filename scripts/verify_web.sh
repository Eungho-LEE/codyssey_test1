#!/usr/bin/env bash
# Supplemental validation at the migrated project location. Keeps both servers.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p docs/records
exec > >(tee docs/records/supplement-web.txt) 2>&1
echo 'Assistant supplemental verification, separate from the original practice'
date -Is
set -x
pwd
test -f Dockerfile
test -f site/index.html
docker build --progress=plain -t e11-web:verify .
docker run -d --name e11-review-web -p 127.0.0.1:8090:80 --label codyssey.supplement=true e11-web:verify
docker run -d --name e11-web-8081 -p 127.0.0.1:8081:80 --label codyssey.supplement=true e11-web:1.0
for port in 8090 8081; do
  for attempt in 1 2 3 4 5; do
    if curl --fail --silent "http://localhost:$port" > /dev/null; then break; fi
    sleep 1
  done
  curl --fail -i "http://localhost:$port"
done
curl --fail --silent http://localhost:8090 | grep 'version-2'
curl --fail --silent http://localhost:8081 | grep 'version-1'
docker ps --filter name=e11-review-web
docker ps --filter name=e11-web-8081
echo 'PASS: 8090 rebuilt source is version-2; 8081 original image is version-1.'
