function getBabelConfiguration(nodeVersion, entryPointPath, omitExtensions) {
  var language = entryPointPath.endsWith('.ts') || entryPointPath.endsWith('.tsx') ? 'ts' : 'js';

  var presets = [];
  if (language === 'js') {
    presets.push([require('@babel/preset-flow').default]);
  }

  if (language === 'ts') {
    presets.push([
      require('./build/babel-preset-typescript').default
    ]);
  }

  presets.push([
    require('@babel/preset-env').default,
    {
      targets: {node: nodeVersion || 'current'}
    }
  ]);

  var plugins = [];

  if (language === 'ts') {
    require('reflect-metadata');
    plugins.push([require('@babel/plugin-syntax-decorators').default, {legacy: true}]);
    plugins.push([require('./build/typescript-babel-decorators.js').default]);
  }

  if (language === 'js') {
    plugins.push([require('@babel/plugin-proposal-decorators').default, { legacy: true }]);
  }

  plugins.push([require('@babel/plugin-proposal-class-properties').default, { loose: true }]);

  var enableLocalBabelRc = process.env.ENABLE_LOCAL_BABEL_RC;

  var configuration = {
    presets: presets,
    plugins: plugins,
    babelrc: !!enableLocalBabelRc,
    extensions: ['.es6', '.es', '.jsx', '.js', '.mjs', '.ts', '.tsx']
  };

  if (omitExtensions) {
    delete configuration.extensions;
  }

  return configuration;
}

module.exports = getBabelConfiguration;
