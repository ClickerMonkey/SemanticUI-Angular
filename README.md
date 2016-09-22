## SemanticUI-Angular [![Build Status](https://travis-ci.org/ClickerMonkey/SemanticUI-Angular.svg?branch=master)](https://travis-ci.org/ClickerMonkey/SemanticUI-Angular) [![devDependency Status](https://david-dm.org/ClickerMonkey/SemanticUI-Angular/dev-status.svg?branch=master)](https://david-dm.org/ClickerMonkey/SemanticUI-Angular#info=devDependencies)

This library provides over 100 Angular directives for building Semantic UI elements, collections, views & modules.

Check out the [Documentation](http://clickermonkey.github.io/SemanticUI-Angular/examples/) where you can see examples similar to those on http://semantic-ui.com except with angular directives.

### Installing

The easiest way to install this binding is with bower or npm:

- bower: `bower install semantic-ui-angular-jquery`
- npm: `npm install semantic-ui-angular-jquery`

### Modules

Like Semantic UI, you can include only the modules you need - or all of them.

- [semantic-ui](angular-semantic-ui.js) (all modules below)
- [semantic-ui-core](src/sm-core.js) (requirement of following modules)
- [semantic-ui-accordion](src/accordion/sm-accordion.js)
- [semantic-ui-checkbox](src/checkbox/sm-checkbox.js)
- [semantic-ui-radio](src/checkbox/sm-radio.js)
- [semantic-ui-comment](src/comment/sm-comment.js) (requires `semantic-ui-timeago`)
- [semantic-ui-dimmer](src/dimmer/sm-dimmer.js)
- [semantic-ui-dropdown](src/dropdown/sm-dropdown.js)
- [semantic-ui-embed](src/embed/sm-embed.js)
- [semantic-ui-list](src/list/sm-list.js)
- [semantic-ui-menu](src/menu/sm-menu.js)
- [semantic-ui-modal](src/modal/sm-modal.js)
- [semantic-ui-popup](src/popup/sm-popup.js)
- [semantic-ui-progress](src/progress/sm-progress.js)
- [semantic-ui-rating](src/rating/sm-rating.js)
- [semantic-ui-search](src/search/sm-search.js)
- [semantic-ui-shape](src/shape/sm-shape.js)
- [semantic-ui-sidebar](src/sidebar/sm-sidebar.js)
- [semantic-ui-sticky](src/sticky/sm-sticky.js)
- [semantic-ui-tab](src/tab/sm-tab.js)
- [semantic-ui-transition](src/transition/sm-transition.js)
- [semantic-ui-timeago](src/timeago/sm-timeago.js)

### Dependencies

- Semantic-UI (which depends on jQUery)
- AngularJS

### Global DevDependencies

- gulp

### Building

```bash
$ npm install --dev
$ gulp
```

### Contribution

Any form of contribution is welcome, whether it be a bug report, a feature request, a feature implementation, a bug fix, or even an example usage or additional test. The contribution is welcome and appreciated.
