var babelPresetEnv = [
  require('babel-preset-env'),
  {
    targets: { node: 'current' }
  }
];
var babelPresetFlow = [require('babel-preset-flow')];
var babelPluginTransformObjectRestSpread = [require('babel-plugin-transform-object-rest-spread')];

require('babel-register')({
  presets: [babelPresetEnv, babelPresetFlow],
  plugins: [babelPluginTransformObjectRestSpread]
});
