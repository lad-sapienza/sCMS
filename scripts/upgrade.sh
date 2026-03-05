#!/bin/bash
set -euo pipefail

UPSTREAM="https://github.com/lab-archeologia-digitale/sCMS.git"
BRANCH="scms-astro"
TMP_DIR=".tmp_scms_update"
LOG_FILE="update.log"

# Pulizia in caso di run precedenti fallite
rm -rf "$TMP_DIR"

echo "[$(date)] Inizio aggiornamento da $UPSTREAM ($BRANCH)" | tee -a "$LOG_FILE"

# Clone superficiale (molto più veloce di wget+unzip)
git clone --depth=1 --branch "$BRANCH" "$UPSTREAM" "$TMP_DIR"

# Aggiornamento con rsync (esclusioni più robuste)
rsync -av --delete \
  --exclude='.astro' \
  --exclude='.cache' \
  --exclude='.git' \
  --exclude='.dist' \
  --exclude='node_modules' \
  --exclude='usr' \
  --exclude='.env' \
  --exclude='.env.development' \
  --exclude='LICENSE' \
  --exclude='README.md' \
  --exclude="$TMP_DIR" \
  "$TMP_DIR/" . 2>&1 | tee -a "$LOG_FILE"

# Pulizia
rm -rf "$TMP_DIR"

echo "[$(date)] Aggiornamento completato" | tee -a "$LOG_FILE"