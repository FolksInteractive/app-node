Messages = new Meteor.Collection('messages');

MessageTypes = {
  'NORMAL' : 'normal'
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

    var insertParams = _.pick(params, 'relationId', 'body', 'type');
    insertParams = _.extend(params, {
      'authorId' : this.userId,
      'createdAt' : new Date()
    })

    messageId = Messages.insert(insertParams, function(err){
      console.log('Post Message Method : ', err)
    })

    return messageId;
  } 
})