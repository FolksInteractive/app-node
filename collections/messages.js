Messages = new Meteor.Collection('messages');

MessageTypes = {
  'DISCUSS' : 'discuss',
  'OBJECTIVE': 'objective',
  'PROGRESS': 'progress',
}

Meteor.methods({
  'discard_message': function(params){
    check(params, {
      'messageId': String,
      'wait': Match.Optional(Number),
    });

    // Must be loggedIn
    if(!this.userId)
      throw new Meteor.Error(403)

    var message = Messages.findOne(params.messageId);

    if(!message)
      throw new Meteor.Error(403)

    if(!message.draft)
      throw new Meteor.Error(403, "User cannot discard a non-drafted message.");


    if(message.authorId != this.userId)
      throw new Meteor.Error(403, "User doesn't have the rights to discard this message.");

    var confirmDiscard = function(){
      Messages.remove(message._id);
      Files.remove({'messageId': message._id});
      Objectives.remove({'messageId': message._id});
    }

    var wait = params.wait || 0;
    if(!this.isSimulation && wait > 0){ 
      Meteor.setTimeout(confirmDiscard, wait);
    }else if( wait == 0){
      confirmDiscard();
    }else{
      // No latency compensation to let animation happening
    }

  },




  'draft_message': function(params){
    check(params, {
      'relationId' : Match.Where(function (id) {
        check(id, String);
        return !!Relations.findOne(id);
      }),
      'type' : Match.Where(function (type) {
        check(type, String);
        return isValidMessageType(type);
      })
    })

    // Must be loggedIn
    if(!this.userId)
      throw new Meteor.Error(403)

    // Makes sure user can post
    if(!canPostMessageInRelationById(params.relationId, this.userId))
      throw new Meteor.Error(403, "User doesn't have the rights to post message in this relation");

    params = _.extend(params, {
      'authorId' : this.userId,
      'draft' : true,
      'draftedAt' : new Date()
    })

    return Messages.insert(params);

  },




  'post_message' : function(params){
    check(params, {
      'messageId' : String,
      'body' : String,
      // Message Type Objective Params
      'objectives' : Match.Optional([String]),
      // Message Type Progress Param
      'progress' : Match.Optional({
        'objectiveId' : String,
        'value' : Number
      })
    })

    // Must be loggedIn
    if(!this.userId)
      throw new Meteor.Error(403)

    // Looking for a draft message created by the user
    var message = Messages.findOne({
      '_id' : params.messageId,
      'authorId' : this.userId,
      'draft' : true
    });

    if(!message)
      throw new Meteor.Error(403, "Can't find draft message.");


    // Insert default message first
    var insertParams = _.pick(params, 'body');
    insertParams = _.extend(params, {
      'draft' : false,
      'postedAt' : new Date()
    });

    Messages.update(message._id, {'$set' : insertParams});

    //
    //
    // For Objective Message
    //
    if(MessageTypes.OBJECTIVE === message.type){

      // Insert Objectives and remember their ids
      var objectivesIds = _.map(params.objectives, function(title){
        return Objectives.insert({
          'messageId' : message._id,
          'title' : title,
          'progress' : 0,
          'createdAt' : new Date(),
          'relationId' : message.relationId 
        })
      });
      // Update message to specify objectives
      Messages.update(message._id, {'$set':{'objectives' : objectivesIds}})
    }
    //
    //
    // For Progress Message
    //
    if(MessageTypes.PROGRESS === message.type){

      // Update objective progress
      Objectives.update(params.progress.objectiveId, {
        '$set':{
          'progress': params.progress.value
      }});  

      // Update message with progress data
      Messages.update(message._id, {
        '$set':{
          'objectiveId' : params.progress.objectiveId, 
          'progress': params.progress.value
      }});      
    }

    return message._id;
  } 
})