Template.relation_objectives.helpers({

  'objectives' : function(){
    return getObjectives();
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

Template.relation_objectives.helpers({
  'progress_state' : function(){
    return this.progress < 100 ? 'pending' : 'completed';
  },

  'active_state' : function(){
    return Session.equals('selectedObjectiveId', this._id) ? 'active' : '';
  },

  'completed' : function()  {
    return this.progress >= 100;
  },
})

Template.objective_item.events({
  'click li' : function(e){
    e.preventDefault();

    Session.set('selectedObjectiveId', this._id);
  },
});
