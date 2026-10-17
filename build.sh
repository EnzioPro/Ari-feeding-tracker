#!/bin/sh
# Wraps app.html into a standalone index.html for self-hosting as an installable app.
cd "$(dirname "$0")"
{
  echo '<!doctype html><html lang="en"><head><meta charset="utf-8">'
  echo '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'
  echo '<link rel="manifest" href="manifest.json"><link rel="icon" href="icon.svg"><link rel="apple-touch-icon" href="icon.svg">'
  echo '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}[hidden]{display:none!important}</style>'
  echo '<script src="firebase-config.js"></script>'
  echo '</head><body>'
  cat app.html
  echo '</body></html>'
} > index.html
