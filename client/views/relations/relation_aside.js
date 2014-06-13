Template.relation_aside.helpers({
  user : function(){
    return Meteor.user();
  },

  objectives : function(){
    return getObjectives();
  },

  contact : function(){
    return getContact(Session.get('currentRelationId'))
  }
})