getMessage = function(messageId){
  return Messages.findOne(messageId)
}
getMessagesByRelation = function (relation, options){
  if(_.isObject(relation))
    relation = relation._id;

  return Messages.find({'relationId' : relation}, options);
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