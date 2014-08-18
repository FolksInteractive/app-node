getObjective = function(ObjectiveId){
  return Objectives.findOne(fileId);
}
getObjectives = function(options){
  options = options || {};
  return Objectives.find(options).fetch();
}

countObjectives = function(options){
  options = options || {};
  return Objectives.find(options).count();
}