Template.relation_aside.rendered = function(){
}

Template.relation_aside.helpers({
  'user' : function(){
    return Meteor.user();
  },

  'objectives_pending' : function(){
    return getObjectives({
      'progress': {'$lt': 100}
    });
  },

  'objectives_completed' : function(){
    return getObjectives({
      'progress': 100
    });
  },

  'contact' : function(){
    return getContact(Session.get('currentRelationId'))
  },

  'count_pending' : function(){
    return countObjectives({
      'progress': {"$lt": 100}
    })
  },

  'count_completed' : function(){
    return countObjectives({
      'progress': 100
    })
  }
});