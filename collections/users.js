if(Meteor.isServer){
  Accounts.onCreateUser(function(options, user) {

    // Check if user is created via an invite or by himself

    //If by himself and a token is provided, merge to existing , activate : true

    // If invite, let it go

    return user;
  });
}