Messages = new Meteor.Collection('messages');

MessageTypes = {
  'DISCUSS' : 'discuss',
  'OBJECTIVE': 'objective',
  'PROGRESS': 'progress',
}

Meteor.methods({
  'post_message' : function(params){
    // Makes sure we have all the necessary params
    check(params, Object);
    check(params.relationId, String);
    check(params.body, String);
    check(params.type, String);

    // Must be loggedIn
    if(!this.userId)
      return;

    // Makes sure user can post
    if(!canPostMessageInRelationById(params.relationId, this.userId))
      throw new Meteor.Error(403, "User doesn't have the rights to post message in this relation");

    // Makes sure it is a valid message type
    if(!_.contains(MessageTypes,params.type))
      throw new Meteor.Error(500, "Invalid message type");

    // Insert default message first
    var insertParams = _.pick(params, 'relationId', 'body', 'type', 'files');
    insertParams = _.extend(params, {
      'authorId' : this.userId,
      'createdAt' : new Date()
    });
    messageId = Messages.insert(insertParams)
    //
    //
    // For Objective Message
    //
    if(MessageTypes.OBJECTIVE === params.type){
      check(params.objectives, Array);

      // Insert Objectives and remember their ids
      var objectivesIds = _.map(params.objectives, function(titleParam){
        return Objectives.insert({
          'messageId' : messageId,
          'title' : titleParam,
          'completed' : 0,
          'progress' : 0,
          'createdAt' : new Date(),
          'relationId' : params.relationId 
        })
      });
      // Update message to specify objectives
      Messages.update(messageId, {'$set':{'objectives' : objectivesIds}})
    }
    //
    //
    // For Progress Message
    //

    // Update files to remove draft mode to files
    _.each(params.files, function(fileId){
      Files.update(fileId, {'$set' : {'draft':false}});
    });

    return messageId;
  } 
})