# nnode - a nicer node
So nice, you'd meet it with your parents.

`nnode` executes .js files with node + babel.

It works just ike `node`, only `n`icer.

`run-me.js`
```
import path from 'path';
const x = { look: 'at', me: 'please' };
const { look, me } = x;
console.log(`I'm ${at}ing at you`);
```

If you try running `node run-me.js`
-- `SyntaxError: Unexpected token import`

That's not very nice, try something nicer, like `nnode run-me.js`:
-- `Look at please`

You can also `require('nnode')` which works just [require('babel-register')](https://babeljs.io/docs/usage/babel-register) without needing to setup .babelrc and installing babel presets, plugins and other non-niceties.
Useful when running stuff with `pm2` or `nodemon`.

