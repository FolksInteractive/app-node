getMessagesByRelationId = function (relationId, options){
  return Messages.find({relationId : relationId}, options);
}

getMessagesByRelation = function (relation, options){
  return getMessagesByRelationId(relation._id, options);
}