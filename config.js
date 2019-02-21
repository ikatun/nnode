function getBabelConfiguration(nodeVersion, entryPointPath, omitExtensions) {
  var language = entryPointPath.endsWith('.ts') || entryPointPath.endsWith('.tsx') ? 'ts' : 'js';

  var presets = [];
  if (language === 'js') {
    presets.push([require('@babel/preset-flow').default]);
  }

  if (language === 'ts') {
    presets.push([
      require('@babel/preset-typescript').default
    ]);
  }

  presets.push([
    require('@babel/preset-env').default,
    {
      targets: {node: nodeVersion || 'current'}
    }
  ]);

  var babelPluginDecorators = [require('@babel/plugin-proposal-decorators').default, { legacy: true }];
  var babelPluginProposalClassProperties = [require('@babel/plugin-proposal-class-properties').default, { loose: true }];

  var enableLocalBabelRc = process.env.ENABLE_LOCAL_BABEL_RC;

  var configuration = {
    presets: presets,
    plugins: [babelPluginDecorators, babelPluginProposalClassProperties],
    babelrc: !!enableLocalBabelRc,
    extensions: ['.es6', '.es', '.jsx', '.js', '.mjs', '.ts', '.tsx']
  };

  if (omitExtensions) {
    delete configuration.extensions;
  }

  return configuration;
}

module.exports = getBabelConfiguration;
