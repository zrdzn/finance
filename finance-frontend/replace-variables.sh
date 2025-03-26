#!/bin/bash

VARIABLES=("NEXT_PUBLIC_API_URL")

for VAR in "${VARIABLES[@]}"; do
    if [ -z "${!VAR}" ]; then
        echo "$VAR is not set. Please set it and rerun the script."
        exit 1
    fi
    echo "Preparing to replace DUMMY_$VAR with ${!VAR}"
done

echo "Replacing variables in files..."

find /app /app/public /app/.next -type f \( \
    -name "*.html" \
    -o -name "*.js" \
    -o -name "*.json" \
    -o -name "*.css" \
\) -print0 | while IFS= read -r -d '' file; do
    for VAR in "${VARIABLES[@]}"; do
        if grep -q "DUMMY_$VAR" "$file"; then
            echo "Replacing $VAR in: $file"
            sed -i.bak "s|DUMMY_$VAR|${!VAR}|g" "$file"
            rm -f "$file.bak"
        fi
    done
done

echo "Environment variable replacement complete"