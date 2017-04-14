'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _React = React;
var Component = _React.Component;
var _ReactRedux = ReactRedux;
var Provider = _ReactRedux.Provider;
var connect = _ReactRedux.connect;
var _Redux = Redux;
var createStore = _Redux.createStore;
var applyMiddleware = _Redux.applyMiddleware;
var _ReactReduxForm = ReactReduxForm;
var Control = _ReactReduxForm.Control;
var Errors = _ReactReduxForm.Errors;
var Form = _ReactReduxForm.Form;
var combineForms = _ReactReduxForm.combineForms;
var actions = _ReactReduxForm.actions;

var thunk = ReduxThunk.default;

var initialUserState = {
  username: 'test@email.com',
  password: '',
  passwordConfirm: ''
};

var store = createStore(combineForms({
  user: initialUserState
}), applyMiddleware(thunk, reduxLogger()));

var UserForm = function (_Component) {
  _inherits(UserForm, _Component);

  function UserForm(props) {
    _classCallCheck(this, UserForm);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.handleSubmit = _this.handleSubmit.bind(_this);
    return _this;
  }

  UserForm.prototype.handleSubmit = function handleSubmit() {
    var dispatch = store.dispatch;

    var user = store.getState().user;

    console.log(user);
  };

  UserForm.prototype.render = function render() {
    var _this2 = this;

    var getUserClassName = function getUserClassName(field) {
      var userForm = store.getState().forms.user;
      var isTouched = userForm[field].touched;
      var isValid = userForm[field].valid;

      return 'form-control' + (isTouched || _this2.props.submitFailed ? ' active' : '') + (!isValid ? ' invalid' : '');
    };

    var MyTextInput = function MyTextInput(props) {
      var _props$name$split = props.name.split('.');

      var name = _props$name$split[1];

      var className = getUserClassName(name);

      return React.createElement('input', _extends({
        className: className,
        autoComplete: 'off'
      }, props));
    };

    var showErrors = function showErrors(field) {
      var form = store.getState().forms.user.$form;

      return !field.pristine || form.submitFailed;
    };

    return React.createElement(
      Form,
      { model: 'user' },
      React.createElement(
        'div',
        { className: 'form-group' },
        React.createElement(
          'label',
          null,
          'Username'
        ),
        React.createElement(Control.text, {
          model: '.username',
          component: MyTextInput,
          validators: {
            required: function required(val) {
              return val && val.length;
            },
            validEmail: validator.isEmail
          }
        }),
        React.createElement(Errors, {
          className: 'errors',
          model: 'user.username',
          show: showErrors,
          messages: {
            required: 'Username is required',
            validEmail: 'Need Valid email address'
          }
        })
      ),
      React.createElement(
        'div',
        { className: 'form-group' },
        React.createElement(
          'label',
          null,
          'Password'
        ),
        React.createElement(Control.text, {
          model: '.password',
          component: MyTextInput,
          validators: {
            required: function required(val) {
              return val && val.length;
            },
            length: function length(val) {
              return val.length == 0 || val.length > 4;
            }
          }
        }),
        React.createElement(Errors, {
          className: 'errors',
          model: 'user.password',
          show: showErrors,
          messages: {
            required: 'Password is required',
            length: 'Longer than 4 chars'
          }
        })
      ),
      React.createElement(
        'div',
        { className: 'form-group' },
        React.createElement(
          'label',
          null,
          'Confirm Password'
        ),
        React.createElement(Control.text, {
          model: '.passwordConfirm',
          component: MyTextInput,
          validators: {
            required: function required(val) {
              return val && val.length;
            },
            matches: function matches(val) {
              return val === store.getState().user.password;
            }
          }
        }),
        React.createElement(Errors, {
          className: 'errors',
          model: 'user.passwordConfirm',
          show: showErrors,
          messages: {
            required: 'Confirm Password is required',
            matches: 'Passwords do not match'
          }
        })
      ),
      React.createElement(
        'button',
        { onClick: this.handleSubmit, className: 'btn btn-primary' },
        'Submit'
      )
    );
  };

  return UserForm;
}(Component);

var BasicForm = connect(function (state) {
  var submitFailed = state.forms.user.$form.submitFailed;

  return { submitFailed: submitFailed };
})(UserForm);

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  App.prototype.render = function render() {
    return React.createElement(
      'div',
      { className: 'container' },
      React.createElement(
        Provider,
        { store: store },
        React.createElement(BasicForm, null)
      ),
      React.createElement(
        'a',
        { href: '' },
        React.createElement(
          'p',
          { className: 'note' },
          'Forgot Password'
        )
      )
    );
  };

  return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('app'));
