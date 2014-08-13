Template.login_oauth.events({
  'click #linkedinLoginBtn' : function(e){
    Meteor.loginWithLinkedin( function(err, user){
      if(err)
        return console.log(err);
      
      if(Router.current().route.name === 'login')
        Router.go('root');
    })
  }
});