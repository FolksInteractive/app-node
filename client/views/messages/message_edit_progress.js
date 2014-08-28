Template.message_edit_progress.rendered = function(){
  $('select[name=progressObjective]').select2();
  
  $('select[name=progressValue]').select2({
    minimumResultsForSearch: -1
  });
}

Template.message_edit_progress.helpers({
  'objectives' : function(){
    return getObjectives();
  },

  'progress_notes' : function(){
    return getProgressNotesByMessage(this);
  }
})