Template.login_oauth.events({
  'click #linkedinLoginBtn' : function(e){
    Meteor.loginWithLinkedin( function(err, other){
      if(err)
        return console.log(err);

      console.log(other);
      
      if(Router.current().route.name === 'login')
        Router.go('root');
    })
  }
});