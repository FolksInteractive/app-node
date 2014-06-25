AutoForm.hooks({

  'loginForm': {

    onSubmit: function (params) {

      Meteor.loginWithPassword(params.email, params.password, function(err){
        console.log(err);
        if(err)
          return Template.login_form.setError(err);

        Template.login_form.clearError();

        // If an invitation is waiting accept it
        if(!Session.get('invitation'))
          return;
        
        var invitation = Session.get('invitation');

        if(invitation.relationId)
          Meteor.call('relation_accept', invitation, function(err){
            console.log(err);
            
            if(!err)
              Session.set('invitation', null);
          });
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

  setError : function(){
    Session.set('login_error', "Invalid email or password");
  },

  clearError : function(){
    Session.set('login_error', null);    
  }
});