mkdir node_modules & ^
npm install libamf && ^
npm install cross-fetch && ^
npm install archiver && ^
copy ObjectProxy.js "node_modules/libamf/src/amf/flash/flex/ObjectProxy.js" /y && ^
copy amf_index.js "node_modules/libamf/src/index.js" /y && ^
node save.js %*