Template.message_edit_progress.helpers({
  'progress_notes' : function(){
    return getProgressNotesByMessage(this);
  }
});

var values = [0, 10, 20 , 30, 40, 50, 60, 70, 80, 90, 100];
var $objectiveSelect = 'select[name=progressObjective]';
var $valueSelect = 'select[name=progressValue]';

Template.message_edit_progress_line.rendered = function(){
  $objectiveSelect = this.$('select[name=progressObjective]');
  $valueSelect = this.$('select[name=progressValue]');

  $objectiveSelect.select2();  
  $valueSelect.select2({ minimumResultsForSearch: -1 });
}

Template.message_edit_progress_line.helpers({
  'objectives' : function(){
    var self = this;
    return getObjectives().map(function(objective){
      return _.extend(objective, {
        'selected' : (self.objectiveId == objective._id) ? 'selected' : ''
      })
    });
  },
  'values' : function(){
    var self = this;
    return _.map(values, function(value){
      return {
        'value' : value,
        'selected' : (self.value == value) ? 'selected' : ''
      }
    });
  }
});

Template.message_edit_progress_line.events({
  'change select' : function(e, template){
    Meteor.call('write_progress_note', {
      'progressNoteId' : this._id, 
      'objectiveId': $objectiveSelect.val(),
      'value' : $valueSelect.val()
    })
  },
  // Remove an objective line
  'click .tc-remove' : function(e){
    Meteor.call('remove_progress_note', {'progressNoteId' : this._id})
  },
});