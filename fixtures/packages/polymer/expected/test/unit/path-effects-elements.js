import { Polymer } from '../../lib/legacy/polymer-fn.js';
import { html } from '../../polymer.js';
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
Polymer({
  importPath: import.meta.url,
  is: 'x-basic',

  properties: {
    notifyingValue: {
      type: Number,
      notify: true
    },
    computed: {
      computed: 'compute(notifyingValue)'
    }
  },

  compute: function(val) {
    return '[' + val + ']';
  }
});
Polymer({
  importPath: import.meta.url,

  _template: html`
    <x-basic id="basic1" notifying-value="{{obj.value}}" attrvalue\$="{{obj.value}}" othervalue="{{obj.value2}}"></x-basic>
    <x-basic id="basic2" notifying-value="{{obj.value}}" attrvalue\$="{{obj.value}}"></x-basic>
`,

  is: 'x-compose',

  properties: {
    obj: {
      type: Object,
      notify: true
    },
    computed: {
      computed: 'compute(obj.value)'
    }
  },

  observers: [
    'objSubpathChanged(obj.*)',
    'objValueChanged(obj.value)',
  ],

  created: function() {
    this.resetObservers();
  },

  resetObservers: function() {
    this.objSubpathChanged = sinon.spy();
    this.objValueChanged = sinon.spy();
  },

  compute: function(val) {
    return '[' + val + ']';
  }
});
Polymer({
  importPath: import.meta.url,

  _template: html`
    <x-compose id="compose" obj="{{obj}}"></x-compose>
`,

  is: 'x-forward',

  properties: {
    obj: {
      type: Object,
      notify: true
    },
    computed: {
      computed: 'compute(obj.value)'
    }
  },

  observers: [
    'objSubpathChanged(obj.*)',
    'objValueChanged(obj.value)'
  ],

  created: function() {
    this.resetObservers();
  },

  resetObservers: function() {
    this.objSubpathChanged = sinon.spy();
    this.objValueChanged = sinon.spy();
    if (this.$) {
      this.$.compose.resetObservers();
    }
  },

  compute: function(val) {
    return '[' + val + ']';
  }
});
Polymer({
  importPath: import.meta.url,

  _template: html`
    <x-basic id="basic" notifying-value="{{nested.obj.value}}" attrvalue\$="{{nested.obj.value}}"></x-basic>
    <x-compose id="compose" obj="{{nested.obj}}"></x-compose>
    <x-forward id="forward" obj="{{nested.obj}}"></x-forward>
    <div id="boundChild" computed-from-paths="{{computeFromPaths(a, nested.b, nested.obj.c)}}" array-length="{{data.length}}"></div>
`,

  is: 'x-stuff',

  properties: {
    nested: {
      observer: 'nestedChanged'
    },
    computedFromPaths: {
      computed: 'computeFromPaths(a, nested.b, nested.obj.c)'
    },
    computedFromLinkedPaths: {
      computed: 'computeFromLinkedPaths(a, linked1.prop, linked2.prop)'
    },
    computed: {
      computed: 'compute(nested.obj.value)'
    }
  },

  observers: [
    'nestedSubpathChanged(nested.*)',
    'nestedObjChanged(nested.obj)',
    'nestedObjSubpathChanged(nested.obj.*)',
    'nestedObjValueChanged(nested.obj.value)',
    'multipleChanged(a, b, nested.obj.*)',
    'multiplePathsChanged(a, nested.b, nested.obj.c)',
    'arrayChanged(array.splices)',
    'arrayChangedDeep(array.*)',
    'arrayNoCollChanged(arrayNoColl.splices)',
    'arrayOrPropChanged(prop, array.splices)',
    // a has other (computed) effects; x & y don't, which allows testing
    // different code paths in linkPaths tests
    'aChanged(a.*)',
    'xChanged(x.*)',
    'yChanged(y.*)',
  ],

  created: function() {
    this.resetObservers();
  },

  resetObservers: function() {
    this.nestedChanged = sinon.spy();
    this.nestedSubpathChanged = sinon.spy();
    this.nestedObjChanged = sinon.spy();
    this.nestedObjSubpathChanged = sinon.spy();
    this.nestedObjValueChanged = sinon.spy();
    this.multipleChanged = sinon.spy();
    this.multiplePathsChanged = sinon.spy();
    this.arrayChanged = sinon.spy(function(splices) {
      this.arraySplices = splices;
    });
    this.arrayChangedDeep = sinon.spy();
    this.arrayNoCollChanged = sinon.spy();
    this.arrayOrPropChanged = sinon.spy();
    this.aChanged = sinon.spy();
    this.xChanged = sinon.spy();
    this.yChanged = sinon.spy();
    if (this.$) {
      this.$.compose.resetObservers();
      this.$.forward.resetObservers();
    }
  },

  computeFromPaths: function(a, b, c) {
    return a + b + c;
  },

  computeFromLinkedPaths: sinon.spy(function(a, b, c) {
    return a + b + c;
  }),

  compute: function(val) {
    return '[' + val + ']';
  }
});
Polymer({
  importPath: import.meta.url,
  is: 'x-reentry-client',

  properties: {
    prop: {
      notify: true
    }
  },

  observers: ['objChanged(obj.*)'],

  created: function() {
    this.objChanged = sinon.spy(this.objChanged);
  },

  objChanged: function(info) {
    if (info.path !== 'obj') {
      this.prop++;
    }
  }
});
Polymer({
  importPath: import.meta.url,

  _template: html`
    <x-reentry-client obj="{{obj}}" prop="{{prop}}"></x-reentry-client>
`,

  is: 'x-reentry-host',

  properties: {
    obj: {
      value: function() {
        return {prop: 0};
      }
    },
    prop: {
      value: 0
    }
  },

  observers: ['objChanged(obj.*)'],

  created: function() {
    this.objChanged = sinon.spy();
  }
});
Polymer({
  importPath: import.meta.url,
  is: 'x-path-client',
  observers: ['objChanged(obj.*)'],
  objChanged: function() {}
});
Polymer({
  importPath: import.meta.url,

  _template: html`
    <x-path-client id="client" obj="{{obj}}"></x-path-client>
`,

  is: 'x-path-host',

  properties: {
    obj: {
      value: function() {
        return {prop: 0};
      }
    },
    prop: {
      value: 0
    }
  },

  observers: ['objChanged(obj.*)'],

  created: function() {
    this.objChanged = sinon.spy();
  }
});
