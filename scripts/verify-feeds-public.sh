#!/bin/bash
KEY=f6d85301e44f65e1a5393ba937c0bdff
for site in "$@"; do
  url="https://rsshub.zigzagyang.monster/college/${site}?key=${KEY}"
  out=$(curl -s "$url")
  code=$(curl -s -o /dev/null -w '%{http_code}' "$url")
  items=$(echo "$out" | grep -o '<item>' | wc -l | tr -d ' ')
  latest=$(echo "$out" | grep -o '<pubDate>[^<]*' | head -1)
  echo "== $site : HTTP $code, items=$items, $latest"
done
