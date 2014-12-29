#!/bin/sh
mkdir -p dist/

cat src/angular-websocket.js > dist/angular-websocket.js
cat src/angular-websocket-mock.js > dist/angular-websocket-mock.js

./node_modules/.bin/uglifyjs src/angular-websocket.js > dist/angular-websocket.min.js

echo "* built source files \ndist/angular-websocket.js\ndist/angular-websocket.min.js\ndist/angular-websocket-mock.js\n"
