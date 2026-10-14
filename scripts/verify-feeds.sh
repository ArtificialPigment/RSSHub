#!/bin/bash
# verify feeds via local 1200
KEY=f6d85301e44f65e1a5393ba937c0bdff
for site in "$@"; do
  out=$(curl -s "http://127.0.0.1:1200/college/${site}?key=${KEY}")
  code=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:1200/college/${site}?key=${KEY}")
  items=$(echo "$out" | grep -o '<item>' | wc -l | tr -d ' ')
  title=$(echo "$out" | grep -o '<title>[^<]*' | head -2 | tail -1)
  latest=$(echo "$out" | grep -o '<pubDate>[^<]*' | head -1)
  echo "== $site : HTTP $code, items=$items"
  echo "   feed: $title"
  echo "   latest: $latest"
done
