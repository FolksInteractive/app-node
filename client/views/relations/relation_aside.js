Template.relation_aside.rendered = function(){
  $('.tc-relation-aside .tc-objectives-section').perfectScrollbar();
}

Template.relation_aside.helpers({
  'user' : function(){
    return Meteor.user();
  },

  'objectives' : function(){
    return getObjectives();
  },

  'contact' : function(){
    return getContact(Session.get('currentRelationId'))
  },

})


Template.relation_aside.events({
  'click .tc-objectives li' : function(e){
    e.preventDefault();

    DiscussionCriterias.objectives = {'$in' : [this._id]}
  }
});
