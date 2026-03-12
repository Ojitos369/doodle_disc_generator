#!/bin/bash
# export $(grep -v '^#' /usr/src/app/.env | xargs)
while IFS= read -r line; do
    # echo "in line $line"
    if [[ "$line" != \#* && "$line" == *=* ]]; then
        key=$(echo "$line" | cut -d= -f1)
        value=$(echo "$line" | cut -d= -f2- | sed 's/^"//;s/"$//')
        export "$key=$value"
    fi
done < /usr/src/app/.env
/usr/local/bin/python /usr/src/app/scripts/test.py