#!/bin/bash
set -x
bash /app/replace-variables.sh
exec npm run start