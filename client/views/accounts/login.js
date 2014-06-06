AutoForm.hooks({

  'loginForm': {

    onSubmit: function (params) {

      Meteor.loginWithPassword(params.email, params.password, function(err){
        if(err)
          return Session.set('formError', "Invalid email or password");

        Session.set('formError', null);
      });

      return false;
    }
  }
});

Template.login.rendered = function(){
  Session.set('formError', null);
}

Template.login.helpers({

  loginSchema : function(){
    return getLoginSchema();
  },

  hasError : function(){
    return !Session.equals('formError', null)
  },

  errorMessage : function(){
    return Session.get('formError');
  }
});