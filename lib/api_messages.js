getMessage = function(messageId){
  return Messages.findOne(messageId)
}

getMessages = function (query, options){
  return Messages.find(query, options);
}

getMessagesByRelation = function (relation, options){
  if(_.isObject(relation))
    relation = relation._id;

  return Messages.find({'relationId' : relation}, options);
}

getFilesByMessage = function(message){
  if(_.isString(message))
    message = getMessage(message);

  return getFiles({
    'messageId' : message._id,
    'draft' : message.draft // force to find draft files
  });
}

getObjectivesByMessage = function(message){
  if(_.isString(message))
    message = getMessage(message);

  return getObjectives({
    'messageId' : message._id,
    'draft' : message.draft // force to find draft objectives
  });
}

getCommentsByMessage = function(messageId){
  if(_.isObject(messageId))
    messageId = messageId._id;

  return Comments.find({
    'messageId' : messageId
  });
}

getObjectivesByMessageId = function(messageId){
  return getObjectives({'messageId': messageId});
}