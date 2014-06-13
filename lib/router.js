//                                                                            //
//                                   Config                                   //
//                                                                            //
var preloadSubscriptions = [];//['categories', 'settings', 'currentUser'];

Router.configure({
  layoutTemplate: 'layout',
  // loadingTemplate: 'loading',
  // notFoundTemplate: 'not_found',
  waitOn: function () {
    return _.map(preloadSubscriptions, function(sub){
      Meteor.subscribe(sub);
    });
  },


  // load: function() {
  //   $('html, body').animate({
  //     scrollTop: 0
  //   }, 400);
  //   $('.tc-yield').hide().fadeIn(800);
  // }
});
//                                                                            //
//                                   Filters                                  //
//                                                                            //
var filters = {
  isLoggedIn: function(pause) {
    if (!(Meteor.loggingIn() || Meteor.user())) {
      //throwError(i18n.t('Please Sign In First.'));
      this.render('login');
      pause();
    }
  },

  canViewRelation: function(pause) {
    if(!this.ready()) return;

    if(!canViewRelation()){
      // this.render('no_rights');
      pause(); 
    }
  }
}

Router.onBeforeAction(filters.isLoggedIn, {except: []});

//                                                                            //
//                                   Router                                   //
//                                                                            //
Router.map(function() {

  // DASHBOARD
  this.route('root', {
    path : '/',
    template: 'dashboard',
    waitOn : function(){
      return Meteor.subscribe('relations');
    },    
  });

  // ACCEPT INVITE
  this.route('invite_accept', {
    path : '/invite/:token',
    waitOn : function(){
      return Meteor.subscribe('relations');
    },    
    action : function(pause){
      if(Meteor.loggingIn())
        return;

      // Default redirect url
      var url = Router.path('root');

      // Build invitation in an object
      var invitation = {
        "token" : this.params.token,
        "relationId" : this.params.relationId || null,        
      }

      // Find user by token
      var invitedUser = getUser({'inviteToken' : invitation.token});

      // if can't find user with token it means that the token sent doesn't 
      // originally belong to the current user. So we force to login again 
      // to make sure that the user who clicked on the link in the email 
      // is the same as the one logging in.
      if(!invitedUser || Meteor.userId() != invitedUser._id){
        Meteor.logout();
        Session.set('invitation', invitation);
      }else{
        // A relationId is specified in the url redirect to it
        if(this.params.relation)
          url = Router.path('relation', {'relationId' : this.params.relation});
      }

      Router.go(url);
    }
  });

  // INVITE
  this.route('relation_invite',{
    path: '/r/invite',
    template: 'relation_invite'
  });

  // RELATION
  this.route('relation', {
    path: '/r/:relationId',
    template: 'relation',
    onBeforeAction: function(){
      Session.set('currentRelationId', this.params.relationId);
    },
    data: function(){
      return {
        relation : getRelation(Session.get('currentRelationId'))
      }
    },
    waitOn : function(){
      return[
        Meteor.subscribe('relation', Session.get('currentRelationId'))
      ]
    }
  });

  // LOGIN
  this.route('login', {
    path : '/login',
    template: 'login'
  });
});