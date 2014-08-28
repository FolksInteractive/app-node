getProgressNote = function(ObjectiveId){
  return Objectives.findOne(fileId);
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