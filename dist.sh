#!/bin/sh
mkdir -p dist/

echo "* Copy files"
cat src/angular-websocket.js > dist/angular-websocket.js
cat src/angular-websocket-mock.js > dist/angular-websocket-mock.js

echo "dist/angular-websocket.js"
echo "dist/angular-websocket-mock.js"
echo

echo "* Build source files"

./node_modules/.bin/uglifyjs src/angular-websocket.js > dist/angular-websocket.min.js \
--source-map dist/angular-websocket.min.js.map \
--source-map-url angular-websocket.min.js.map \
--mangle \
--compress \
--stats

echo
echo "dist/angular-websocket.min.js"
echo "dist/angular-websocket.min.js.map"
echo

cp dist/* .

echo "Copy dist to root"
echo
