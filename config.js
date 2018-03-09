function getBabelConfiguration(nodeVersion) {
  var babelPresetEnv = [
    require('babel-preset-env'),
    {
      targets: { node: nodeVersion || 'current' }
    }
  ];
  var babelPresetFlow = [require('babel-preset-flow')];
  var babelPluginTransformObjectRestSpread = [require('babel-plugin-transform-object-rest-spread')];
  var babelPluginDecorators = [require('babel-plugin-transform-decorators-legacy').default];
  var babelPluginFlowRuntime = [require('babel-plugin-flow-runtime').default];
  var babelPluginImportGlob = [require('babel-plugin-import-glob')];

  var enableFlowRuntime = process.env.ENABLE_FLOW_RUNTIME;

  return {
    presets: [babelPresetEnv, babelPresetFlow],
    plugins: [babelPluginImportGlob, babelPluginDecorators, babelPluginTransformObjectRestSpread]
      .concat(enableFlowRuntime ? [babelPluginFlowRuntime] : [])
  }
}

module.exports = getBabelConfiguration;

var defaultConfig = getBabelConfiguration('current');
exports.presets = defaultConfig.presets;
exports.plugins = defaultConfig.plugins;
