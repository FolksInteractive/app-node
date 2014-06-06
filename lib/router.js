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
  }
});
//                                                                            //
//                                   Filters                                  //
//                                                                            //
var filters = {
  isLoggedIn: function(pause) {
    if (!(Meteor.loggingIn() || Meteor.user())) {
      //throwError(i18n.t('Please Sign In First.'));
      this.render('signin');
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
//                                                                            //
//                                   Router                                   //
//                                                                            //
Router.map(function() {
  this.route('root', {
    path : '/',
    waitOn : function(){
      return Meteor.subscribe('relations');
    },
    action : function(){
      // Wait for user data to get in    
      if(!Meteor.user() || !this.ready()) return;
      
      // Finds a relation
      var relation = getFirstRelation(Meteor.userId());

      //TODO If no relation found redirect to relation wizard
      // Redirect to the first relation found
      return Router.go('relation', {'relationId' : relation._id});
    }
  });

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
});