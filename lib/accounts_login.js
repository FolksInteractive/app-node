Meteor.method({
  'login' : function(params, callback){
    // Makes sure we have all the necessary params
    check(params, Object);
    check(params.service);
    //
    // Login with password
    //
    if(params.service.password){      
      var email = params.service.password.email || "";
      var pwd = params.service.password.pwd || "";
      Meteor.loginWithPassword(email, pwd);
    }
    //
    // Login with linkedIn
    //
    if(params.service.linkedin){

    }

    // Do we have to handle a invite request ?
    // Sometimes, the person can be invited with two different email address
    // So we ask him to login again and pas the invitation in params
    if(params.invitation){
      var invitation = params.invitation
      var invitedUser = getUser({'inviteToken' : this.params.token});

      // If a user belongs with the token
      // And is not the user logged in we merge accounts
      // At this point we should have a current user ID
      if(invitedUser && invitedUser._id != this.userId){
        //Merging accounts
        
      }
    }
  }
})