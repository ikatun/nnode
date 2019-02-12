function getBabelConfiguration(nodeVersion) {
  var babelPresetEnv = [
    require('@babel/preset-env').default,
    {
      targets: { node: nodeVersion || 'current' }
    }
  ];
  var babelPresetFlow = [require('@babel/preset-flow').default];
  var babelPluginDecorators = [require('@babel/plugin-proposal-decorators').default, { legacy: true }];
  var babelPluginProposalClassProperties = [require('@babel/plugin-proposal-class-properties').default, { loose: true }];

  var enableLocalBabelRc = process.env.ENABLE_LOCAL_BABEL_RC;

  return {
    presets: [babelPresetFlow, babelPresetEnv],
    plugins: [babelPluginDecorators, babelPluginProposalClassProperties],
    babelrc: !!enableLocalBabelRc
  }
}

module.exports = getBabelConfiguration;

var defaultConfig = getBabelConfiguration('current');
exports.presets = defaultConfig.presets;
exports.plugins = defaultConfig.plugins;
