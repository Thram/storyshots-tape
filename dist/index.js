"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.default = testStorySnapshots;

var _snapshotter = require("snapshotter");

var _snapshotter2 = _interopRequireDefault(_snapshotter);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _enzyme = require("enzyme");

var _tape = require("tape");

var _tape2 = _interopRequireDefault(_tape);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _readPkgUp = require("read-pkg-up");

var _readPkgUp2 = _interopRequireDefault(_readPkgUp);

var _addons = require("@storybook/addons");

var _addons2 = _interopRequireDefault(_addons);

var _require_context = require("./require_context");

var _require_context2 = _interopRequireDefault(_require_context);

var _storybookChannelMock = require("./storybook-channel-mock");

var _storybookChannelMock2 = _interopRequireDefault(_storybookChannelMock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var storybook = void 0;
var configPath = void 0;

var babel = require("babel-core");

var pkg = _readPkgUp2.default.sync().pkg;
var isStorybook = pkg.devDependencies && pkg.devDependencies["@storybook/react"] || pkg.dependencies && pkg.dependencies["@storybook/react"];
var isRNStorybook = pkg.devDependencies && pkg.devDependencies["@storybook/react-native"] || pkg.dependencies && pkg.dependencies["@storybook/react-native"];

function testStorySnapshots() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _addons2.default.setChannel((0, _storybookChannelMock2.default)());

  if (isStorybook) {
    storybook = require("@storybook/react");
    var loadBabelConfig = require("@storybook/react/dist/server/babel_config").default;
    var configDirPath = _path2.default.resolve(options.configPath || ".storybook");
    configPath = _path2.default.join(configDirPath, "config.js");

    var content = babel.transformFileSync(configPath, babelConfig).code;
    var contextOpts = {
      filename: configPath,
      dirname: configDirPath
    };
    var babelConfig = loadBabelConfig(configDirPath);

    (0, _require_context2.default)(content, contextOpts);
  } else if (isRNStorybook) {
    storybook = require("@storybook/react-native");
    configPath = _path2.default.resolve(options.configPath || "storybook");
    require.requireActual(configPath);
  } else {
    throw new Error("storyshots is intended only to be used with storybook");
  }

  var suit = options.suit || "Storyshots Tape";
  var stories = storybook.getStorybook();

  // Added not to break existing storyshots configs (can be removed in a future major release)
  options.storyNameRegex = options.storyNameRegex || options.storyRegex;

  (0, _tape2.default)(suit, function (mainAssert) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      var _loop = function _loop() {
        var group = _step.value;

        if (options.storyKindRegex && !group.kind.match(options.storyKindRegex)) {
          return "continue";
        }
        mainAssert.test("|- " + group.kind, function (kindAssert) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            var _loop2 = function _loop2() {
              var story = _step2.value;

              if (options.storyNameRegex && !story.name.match(options.storyNameRegex)) {
                return "continue";
              }

              kindAssert.test("|    " + story.name, function (assert) {
                var context = { kind: group.kind, story: story.name };
                var renderedStory = story.render(context);
                var tree = (0, _enzyme.shallow)(renderedStory);
                (0, _snapshotter2.default)(assert, tree, group.kind + " - " + story.name);
                assert.end();
              });
            };

            for (var _iterator2 = (0, _getIterator3.default)(group.stories), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var _ret2 = _loop2();

              if (_ret2 === "continue") continue;
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        });
      };

      for (var _iterator = (0, _getIterator3.default)(stories), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _ret = _loop();

        if (_ret === "continue") continue;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  });
}