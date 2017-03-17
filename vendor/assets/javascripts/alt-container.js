'use strict';
 
var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
 
var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
 
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
 
function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
 
 
var object_assign = function( O, dictionary ) {
  var target, src;
 
  // Let target be ToObject(O).
  target = Object( O );
 
  // Let src be ToObject(dictionary).
  src = Object( dictionary );
 
  // For each own property of src, let key be the property key
  // and desc be the property descriptor of the property.
  Object.getOwnPropertyNames( src ).forEach(function( key ) {
    target[ key ] = src[ key ];
  });
 
  return target;
};
 
var id = function id(it) {
  return it;
};
var getStateFromStore = function getStateFromStore(store, props) {
  return typeof store === 'function' ? store(props).value : store.getState();
};
var getStateFromKey = function getStateFromKey(actions, props) {
  return typeof actions === 'function' ? actions(props) : actions;
};
 
var getStateFromActions = function getStateFromActions(props) {
  if (props.actions) {
    return getStateFromKey(props.actions, props);
  } else {
    return {};
  }
};
 
var getInjected = function getInjected(props) {
  if (props.inject) {
    return Object.keys(props.inject).reduce(function (obj, key) {
      obj[key] = getStateFromKey(props.inject[key], props);
      return obj;
    }, {});
  } else {
    return {};
  }
};
 
var reduceState = function reduceState(props) {
  return object_assign({}, getStateFromStores(props), getStateFromActions(props), getInjected(props));
};
 
var getStateFromStores = function getStateFromStores(props) {
  var stores = props.stores;
  if (props.store) {
    return getStateFromStore(props.store, props);
  } else if (props.stores) {
    // If you pass in an array of stores then we are just listening to them
    // it should be an object then the state is added to the key specified
    if (!Array.isArray(stores)) {
      return Object.keys(stores).reduce(function (obj, key) {
        obj[key] = getStateFromStore(stores[key], props);
        return obj;
      }, {});
    }
  } else {
    return {};
  }
};
 
// TODO need to copy some other contextTypes maybe?
// what about propTypes?
 
var AltContainer = (function (_React$Component) {
  _inherits(AltContainer, _React$Component);
   
  AltContainer.contextTypes = {
    flux: React.PropTypes.object,
  }
 
  AltContainer.childContextTypes =  {
    flux: React.PropTypes.object,
  }
 
  _createClass(AltContainer, [{
    key: 'getChildContext',
    value: function getChildContext() {
      var flux = this.props.flux || this.context.flux;
      return flux ? { flux: flux } : {};
    }
  }]);
 
  function AltContainer(props) {
    _classCallCheck(this, AltContainer);
 
    _get(Object.getPrototypeOf(AltContainer.prototype), 'constructor', this).call(this, props);
 
    if (props.stores && props.store) {
      throw new ReferenceError('Cannot define both store and stores');
    }
 
    this.storeListeners = [];
 
    this.state = reduceState(props);
  }
 
  _createClass(AltContainer, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this._destroySubscriptions();
      this.setState(reduceState(nextProps));
      this._registerStores(nextProps);
      if (this.props.onWillReceiveProps) {
        this.props.onWillReceiveProps(nextProps, this.props, this.context);
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._registerStores(this.props);
      if (this.props.onMount) this.props.onMount(this.props, this.context);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._destroySubscriptions();
      if (this.props.onWillUnmount) {
        this.props.onWillUnmount(this.props, this.context);
      }
    }
  }, {
    key: '_registerStores',
    value: function _registerStores(props) {
      var _this = this;
 
      var stores = props.stores;
 
      if (props.store) {
        this._addSubscription(props.store);
      } else if (props.stores) {
        if (Array.isArray(stores)) {
          stores.forEach(function (store) {
            return _this._addSubscription(store);
          });
        } else {
          Object.keys(stores).forEach(function (formatter) {
            _this._addSubscription(stores[formatter]);
          });
        }
      }
    }
  }, {
    key: '_destroySubscriptions',
    value: function _destroySubscriptions() {
      this.storeListeners.forEach(function (storeListener) {
        return storeListener();
      });
    }
  }, {
    key: '_addSubscription',
    value: function _addSubscription(getStore) {
      var store = typeof getStore === 'function' ? getStore(this.props).store : getStore;
 
      this.storeListeners.push(store.listen(this.altSetState.bind(this)));
    }
  }, {
    key: 'altSetState',
    value: function altSetState() {
      this.setState(reduceState(this.props));
    }
  }, {
    key: 'getProps',
    value: function getProps() {
      var flux = this.props.flux || this.context.flux;
      var transform = typeof this.props.transform === 'function' ? this.props.transform : id;
      return transform(object_assign(flux ? { flux: flux } : {}, this.state));
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return this.props.shouldComponentUpdate ? this.props.shouldComponentUpdate(this.getProps(), nextProps, nextState) : true;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;
 
      var Node = 'div';
      var children = this.props.children;
 
      // Custom rendering function
      if (typeof this.props.render === 'function') {
        return this.props.render(this.getProps());
      } else if (this.props.component) {
        return React.createElement(this.props.component, this.getProps());
      }
 
      // Does not wrap child in a div if we don't have to.
      if (Array.isArray(children)) {
        return React.createElement(Node, null, children.map(function (child, i) {
          return React.cloneElement(child, object_assign({ key: i }, _this2.getProps()));
        }));
      } else if (children) {
        return React.cloneElement(children, this.getProps());
      } else {
        return React.createElement(Node, this.getProps());
      }
    }
  }]);
 
  return AltContainer;
})(React.Component);