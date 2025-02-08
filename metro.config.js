const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Allow Metro to resolve .cjs files
defaultConfig.resolver.sourceExts.push('cjs');

module.exports = defaultConfig;
