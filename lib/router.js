//                                                                            //
//                                   Config                                   //
//                                                                            //
var preloadSubscriptions = ["userStatus", "relations"];//['categories', 'settings', 'currentUser'];

Router.configure({
  layoutTemplate: 'layout',
  // loadingTemplate: 'loading',
  // notFoundTemplate: 'not_found',
  waitOn: function () {
    return _.map(preloadSubscriptions, function(sub){
      Meteor.subscribe(sub);
    });
  },
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
  },
}

Router.onBeforeAction(filters.isLoggedIn, {except: []});

//                                                                            //
//                                   Controllers                              //
//                                                                            //
RelationController = RouteController.extend({
  onBeforeAction: function(){
    Session.set('currentRelationId', this.params.relationId);
  },

  
  waitOn : function(){
    return[
      Meteor.subscribe('relation', Session.get('currentRelationId'))
    ]
  },


  data: function(){
    if(!this.ready() || Meteor.loggingIn()) return;

    // Find a draft message or creates it
    var draft = Messages.findOne({
      'authorId' : Meteor.userId(),
      'draft' : true,
      'relationId': Session.get('currentRelationId')
    });

    if(!draft){
      Meteor.call('draft_message', {
        'relationId': Session.get('currentRelationId')
      }, function(err, draftId){
        draft = Messages.findOne(draftId);
      });
    }

    return {
      relation : getRelation(Session.get('currentRelationId')),
      draft : draft
    }
  },

  layoutTemplate: 'relation_layout'
});

//                                                                            //
//                                   Router                                   //
//                                                                            //
Router.map(function() {

  // ROOT
  this.route('root', {
    path : '/',
    action : function(){
      if(!this.ready() || Meteor.loggingIn()) return;

      if(getRelations().length <= 0)
        return Router.go("relation_invite");

      
      Router.go("relation", {'relationId' : getRelations()[0]._id});
    }  
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
        "relationId" : this.params.relation || null,
      }

      // Find user by token
      var invitedUser = getUser({'inviteToken' : invitation.token});

      // if can't find user with token it means that the token sent doesn't 
      // originally belong to the current user. So we force to login again 
      // to make sure that the user who clicked on the link in the email 
      // is the same as the one logging in.
      if(!invitedUser || Meteor.userId() != invitedUser._id){
        Session.set('invitation', invitation);
        Meteor.logout();
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
    template: 'relation_discussion',
    controller: RelationController
  });

  this.route('relation_objectives', {
    path: '/r/:relationId/objectives',
    template: 'relation_objectives',
    controller: RelationController
  });


  this.route('relation_images', {
    path: '/r/:relationId/images',
    template: 'relation_images',
    controller: RelationController
  });


  this.route('relation_files', {
    path: '/r/:relationId/files',
    template: 'relation_files',
    controller: RelationController
  });

  // LOGIN
  this.route('login', {
    path : '/login',
    template: 'login'
  });
});