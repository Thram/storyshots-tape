# StoryShots with Tape and Enzyme

[![Greenkeeper badge](https://badges.greenkeeper.io/Thram/storyshots-tape.svg)](https://greenkeeper.io/)

StoryShots adds automatic Tape/Enzyme Snapshot Testing for [Storybook](https://storybooks.js.org/).

This addon works with Storybook for:
[React](https://github.com/storybooks/storybook/tree/master/app/react) and
[React Native](https://github.com/storybooks/storybook/tree/master/app/react-native).

```sh
yarn add --dev storyshots-tape
```
or
```sh
npm install --save-dev storyshots-tape
```

## Configure Storyshots

Create a new test file with the name `Storyshots.test.js`. (Or whatever the name you prefer).
Then add following content to it:

```js
import initStoryshots from 'storyshots-tape';

initStoryshots();
```

That's all.

Now run your test command. (Usually, `npm test`.) Then you can see all of your stories are converted as Tape snapshot tests.

## Options

### `configPath`

By default, Storyshots assumes the config directory path for your project as below:

* Storybook for React: `.storybook`
* Storybook for React Native: `storybook`

If you are using a different config directory path, you could change it like this:

```js
initStoryshots({
  configPath: '.my-storybook-config-dir'
});
```

### `suit`

By default, Storyshots groups stories inside a Jest test suit called "Storyshots". You could change it like this:

```js
initStoryshots({
  suit: 'MyStoryshots'
});
```

### `storyKindRegex`

If you'd like to only run a subset of the stories for your snapshot tests based on the story's kind:

```js
initStoryshots({
  storyKindRegex: /^MyComponent$/
});
```

This can be useful if you want to separate the snapshots in directories next to each component. See an example [here](https://github.com/storybooks/storybook/issues/892).

### `storyNameRegex`

If you'd like to only run a subset of the stories for your snapshot tests based on the story's name:

```js
initStoryshots({
  storyNameRegex: /buttons/
});
```
