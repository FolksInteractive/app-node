ProgressNotes = new Meteor.Collection('progress_notes');

Meteor.methods({
  'attach_progress_note' : function(params){    
    check(params, {
      'messageId' : String,
    });

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

    var insertParams = {
      'draft' : true,
      'relationId' : message.relationId,
      'messageId'  : message._id,
      'createdAt' : new Date(),
    }

    return ProgressNotes.insert(insertParams);

  },
  
  'write_progress_note' : function(params){
    check(params, {
      'progressNoteId' : String,
      'objectiveId' : Match.Optional(String),
      'value' : Match.Optional(String),
    });

    // Must be loggedIn
    if(!this.userId)
      throw new Meteor.Error(403)
    
    // Looking for the progressNote
    var progressNote = ProgressNotes.findOne({
      '_id' : params.progressNoteId
    });

    if(!progressNote)
      throw new Meteor.Error(403, "Can't find progress note.");

    var message = Messages.findOne(progressNote.messageId);

    if(message.authorId != this.userId)
      throw new Meteor.Error(403, "User doesn't have the rights to edit this message.");

    return ProgressNotes.update(params.progressNoteId, {
      '$set' : _.pick(params, ['objectiveId', 'value'])
    });
  },

  'remove_progress_note' : function(params){
    check(params, {
      'progressNoteId' : String
    });

    // Must be loggedIn
    if(!this.userId)
      throw new Meteor.Error(403)
    
    // Looking for the progressNote
    var progressNote = ProgressNotes.findOne({
      '_id' : params.progressNoteId
    });

    if(!progressNote)
      throw new Meteor.Error(403, "Can't find progress note.");

    var message = Messages.findOne(progressNote.messageId);

    if(message.authorId != this.userId)
      throw new Meteor.Error(403, "User doesn't have the rights to edit this message.");

    return ProgressNotes.remove(params.progressNoteId);
  }
})