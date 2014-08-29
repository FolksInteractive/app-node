Template.message_edit_objectives.helpers({
  'objectives' : function(){
    return getObjectivesByMessage(this);
  },
});

Template.message_edit_objectives.events({
  'change li:last input' : function(e){
    Meteor.call('attach_objective', {'messageId': this.messageId})
  }
})

Template.message_edit_objective_line.events({

  // Remove an objective line
  'click .tc-remove' : function(e){
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