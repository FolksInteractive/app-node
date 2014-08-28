Template.message_edit_objectives.helpers({
  objectives : function(){
    return getObjectivesByMessage(this);
  },
});

Template.message_edit_objectives.events({
  'click #addObjectiveBtn' : function(e, template){
    var params = {
      'messageId':this._id
    }

    Meteor.call('draft_objective', params, function(err){
      if(err)
        console.log(err);
    });
  },

  'keyup .tc-edit-objective:last input' : function(e){
    Meteor.call('draft_objective', {'messageId': this.messageId})
  }
})

Template.message_edit_objective_line.events({

  // Remove an objective line
  'click .tc-edit-objective .tc-remove' : function(e){
    Meteor.call('remove_objective', {'objectiveId' : this._id})
  },

  'keyup/change/keydown input' : _.debounce(function(e, template){
    var params = {
      'objectiveId' : this._id,
      'title' : _.trim($(e.target).val())
    }

    Meteor.call('write_objective', params, function(err){
      if(err)
        return console.log(err);
    })
  }, 800)
})