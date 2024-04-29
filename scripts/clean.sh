#!/bin/sh

rm -rf .nx
rm -rf dist
rm -rf node_modules
rm -rf tmp

rm -rf projects/**/.cache
rm -rf projects/**/*.timestamp*.mjs
rm -rf projects/**/build
rm -rf projects/**/dist
rm -rf projects/**/node_modules