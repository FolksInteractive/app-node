getMessage = function(messageId){
  return Messages.findOne(messageId)
}
getMessagesByRelationId = function (relationId, options){
  return Messages.find({relationId : relationId}, options);
}

getMessagesByRelation = function (relation, options){
  return getMessagesByRelationId(relation._id, options);
}

getFilesByMessageId = function(messageId){
  var message = getMessage(messageId);
  return getFilesByMessage(message)
}

getFilesByMessage = function(message){
  
  if(!(message.files && message.files.length > 0)) 
    return [];

  return getFiles({'_id' : {'$in' : message.files}});
}

getObjectivesByMessage = function(message){
  if(!message.objectives)
    return [];
  
  return getObjectives({'_id' : {'$in' : message.objectives}});
}

getObjectivesByMessageId = function(messageId){
  return getObjectives({'messageId': messageId});
}