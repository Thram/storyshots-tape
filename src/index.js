import compareToSnapshot from "snapshotter";
import React from "react";
import { shallow } from "enzyme";
import test from "tape";
import path from "path";
import readPkgUp from "read-pkg-up";
import addons from "@storybook/addons";
import runWithRequireContext from "./require_context";
import createChannel from "./storybook-channel-mock";

let storybook;
let configPath;

const babel = require("babel-core");

const pkg = readPkgUp.sync().pkg;
const isStorybook =
  (pkg.devDependencies && pkg.devDependencies["@storybook/react"]) ||
  (pkg.dependencies && pkg.dependencies["@storybook/react"]);
const isRNStorybook =
  (pkg.devDependencies && pkg.devDependencies["@storybook/react-native"]) ||
  (pkg.dependencies && pkg.dependencies["@storybook/react-native"]);

export default function testStorySnapshots(options = {}) {
  addons.setChannel(createChannel());

  if (isStorybook) {
    storybook = require("@storybook/react");
    const loadBabelConfig = require("@storybook/react/dist/server/babel_config")
      .default;
    const configDirPath = path.resolve(options.configPath || ".storybook");
    configPath = path.join(configDirPath, "config.js");

    const content = babel.transformFileSync(configPath, babelConfig).code;
    const contextOpts = {
      filename: configPath,
      dirname: configDirPath
    };
    const babelConfig = loadBabelConfig(configDirPath);

    runWithRequireContext(content, contextOpts);
  } else if (isRNStorybook) {
    storybook = require("@storybook/react-native");
    configPath = path.resolve(options.configPath || "storybook");
    require.requireActual(configPath);
  } else {
    throw new Error("storyshots is intended only to be used with storybook");
  }

  const suit = options.suit || "Storyshots Tape";
  const stories = storybook.getStorybook();

  // Added not to break existing storyshots configs (can be removed in a future major release)
  options.storyNameRegex = options.storyNameRegex || options.storyRegex;

  test(suit, mainAssert => {
    for (const group of stories) {
      if (options.storyKindRegex && !group.kind.match(options.storyKindRegex)) {
        continue;
      }
      mainAssert.test(`|- ${group.kind}`, kindAssert => {
        for (const story of group.stories) {
          if (
            options.storyNameRegex && !story.name.match(options.storyNameRegex)
          ) {
            continue;
          }

          kindAssert.test(`|    ${story.name}`, assert => {
            const context = { kind: group.kind, story: story.name };
            const renderedStory = story.render(context);
            const tree = shallow(renderedStory);
            compareToSnapshot(assert, tree, `${group.kind} - ${story.name}`);
            assert.end();
          });
        }
      });
    }
  });
}
