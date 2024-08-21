mkdir -p node_modules
npm install libamf
npm install cross-fetch
npm install archiver
cp ObjectProxy.js "node_modules/libamf/src/amf/flash/flex/ObjectProxy.js"
cp amf_index.js "node_modules/libamf/src/index.js"
node save.js %*