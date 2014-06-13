AutoForm.hooks({
  'registerForm' : {
    onSubmit : function(params){
      //Meteor.createUser()
    }
  }
});

Template.register_form.rendered = function(){
  Session.set('login_error', null);
}

Template.register_form.helpers({

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