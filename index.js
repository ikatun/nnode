var babelPresetEnv = [
  require('babel-preset-env'),
  {
    targets: { node: 'current' }
  }
];
var babelPresetFlow = [require('babel-preset-flow')];
var babelPluginTransformObjectRestSpread = [require('babel-plugin-transform-object-rest-spread')];
var babelPluginDecorators = [require('babel-plugin-transform-decorators-legacy').default];
var babelPluginFlowRuntime = [require('babel-plugin-flow-runtime').default];

const enableFlowRuntime = process.env.ENABLE_FLOW_RUNTIME;

require('babel-register')({
  presets: [babelPresetEnv, babelPresetFlow],
  plugins: [babelPluginDecorators, babelPluginTransformObjectRestSpread]
    .concat(enableFlowRuntime ? [babelPluginFlowRuntime] : [])
});
