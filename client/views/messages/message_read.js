Template.message_read.helpers({
  objectives : function(){
    return getObjectivesByMessage(this);
  },

  'progress_notes' : function(){
    return getProgressNotesByMessage(this);
  },

  'objective_title': function(){
    return getObjective({'_id' : this.objectiveId}).title
  },

  files : function(){
    return getFilesByMessage(this);
  },
})