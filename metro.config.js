const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Define the alias for tslib to fix the "__extends undefined" error on Web
const ALIASES = {
  tslib: "tslib/tslib.es6.js",
};

// Add the resolveRequest logic
config.resolver.resolveRequest = (context, moduleName, platform) => {
  return context.resolveRequest(
    context,
    ALIASES[moduleName] ?? moduleName,
    platform
  );
};

module.exports = config;
