#!/bin/bash

VARIABLES=("NEXT_PUBLIC_API_URL")

for VAR in "${VARIABLES[@]}"; do
    if [ -z "${!VAR}" ]; then
        echo "$VAR is not set. Please set it and rerun the script."
        exit 1
    fi
done

find /app/public /app/.next -type f -name "*.js" |
while read -r file; do
  for VAR in "${VARIABLES[@]}"; do
    sed -i "s|DUMMY_$VAR|${!VAR}|g" "$file"
  done
done