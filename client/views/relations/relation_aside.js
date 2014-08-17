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

    console.log($('.tc-timeline-section').children().length);

    DiscussionFilter.criterias.objectiveId = this._id;
  }
});
