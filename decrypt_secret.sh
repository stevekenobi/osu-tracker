#!/bin/sh

# Decrypt the file

# --batch to prevent interactive command
# --yes to assume "yes" for questions
gpg --quiet --batch --yes --decrypt --passphrase="$LARGE_SECRET_PASSPHRASE" \
--output google_service_account.json google_service_account.json.gpg
