getProgressNote = function(progressNoteId){
  return ProgressNotes.findOne(progressNoteId);
}
getProgressNotes = function(options){
  options = options || {};

  options = _.defaults(options, {
    "draft" : false
  });

  return ProgressNotes.find(options);
}

countProgressNotes = function(options){
  options = options || {};
  return getProgressNotes(options).count();
}