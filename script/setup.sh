#!/bin/bash

echo "Running setup script for gobierto-gencat-engine"

GOBIERTO_ENGINES_PATH=$DEV_DIR/gobierto/vendor/gobierto_engines

if [ -z "$DEV_DIR" ]
then
  echo "Please set DEV_DIR in your .bash_profile before running this script";
else
  echo "Using DEV_DIR: $DEV_DIR"
  echo "Using GOBIERTO_ENGINES_PATH: $GOBIERTO_ENGINES_PATH"

  echo "Creating necessary directories..."
  mkdir -p $GOBIERTO_ENGINES_PATH/gobierto-gencat-engine

  echo "Creating symlinks..."
  ln -s $DEV_DIR/gobierto-gencat-engine/app $GOBIERTO_ENGINES_PATH/gobierto-gencat-engine/app

  echo "[OK]"
fi
