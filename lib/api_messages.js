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
  var messageId = _.isObject(message) ? message._id : message;
  return getFiles({'messageId' : messageId});
}

getObjectivesByMessage = function(message){
  if(!message.objectives)
    return [];
  
  return getObjectives({'_id' : {'$in' : message.objectives}});
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