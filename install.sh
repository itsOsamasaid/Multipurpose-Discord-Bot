#!/bin/bash

# ──  Discord Bot — Dependency Installer ───────────────
echo "=================================================="
echo "  Bot — Installing Dependencies"
echo "=================================================="

# ── System: FFmpeg ────────────────────────────────────────────
echo ""
echo "[1/3] Installing FFmpeg (system)..."
sudo apt update -q
sudo apt install -y ffmpeg
echo "✔ FFmpeg installed."

# ── System: Node.js build tools (needed for canvas) ──────────
echo ""
echo "[2/3] Installing build tools for canvas..."
sudo apt install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
echo "✔ Build tools installed."

# ── Node packages ─────────────────────────────────────────────
echo ""
echo "[3/3] Installing Node.js packages..."
npm install \
  discord.js \
  @discord-player/extractor \
  discord-player \
  discord-player-youtubei \
  youtubei.js@latest \
  @discordjs/voice \
  @discordjs/opus \
  adhan \
  ascii-text-generator \
  canvas \
  chalk \
  dateformat \
  dotenv \
  give-me-a-joke \
  moment \
  ms \
  pretty-ms \
  weather-js \
  @vitalets/google-translate-api \
  sodium-native \
  opusscript

echo ""
echo "=================================================="
echo "  ✔ All dependencies installed!"
echo "  Run the bot with: node index.js"
echo "=================================================="