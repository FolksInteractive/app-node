Template.message_edit_controls.events({
  'click .tc-btn-objective' : function(e){
    var params = {
      'messageId':this._id
    }

    Meteor.call('attach_objective', params, function(err){
      if(err)
        console.log(err);
    });
  },

  'click .tc-btn-progress' : function(e){
    var params = {
      'messageId':this._id
    }

    Meteor.call('attach_progress_note', params, function(err){
      if(err)
        console.log(err);
    });
  },

})