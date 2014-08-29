getObjective = function(objectiveId){
  return Objectives.findOne(objectiveId);
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