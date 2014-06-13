AutoForm.hooks({

  'loginForm': {

    onSubmit: function (params) {

      Meteor.loginWithPassword(params.email, params.password, function(err){
        if(err)
          return Template.login_form.error(err);

        Template.login_form.success();

      });

      return false;
    }
  }
});

Template.login_form.rendered = function(){
  Session.set('login_error', null);
}

Template.login_form.helpers({

  schema : function(){
    return getLoginSchema();
  },

  hasError : function(){
    return !Session.equals('login_error', null)
  },

  getError : function(){
    return Session.get('login_error');
  },

  success : function(){    
    Session.set('login_error', null);
  },

  error : function(){
    Session.set('login_error', "Invalid email or password");
  }
});