getObjective = function(ObjectiveId){
  return Objectives.findOne(fileId);
}
getObjectives = function(options){
  options = options || {};

  options = _.defaults(options, {
    "draft" : false
  });

  return Objectives.find(options);
}

countObjectives = function(options){
  options = options || {};
  return getObjectives(options).count();
}