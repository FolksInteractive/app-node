Files = new FS.Collection("files", {
  stores: [
    new FS.Store.FileSystem("files", {})
  ],
});

Files.allow({
  insert : function(userId, file){
    return canPostMessageInRelationById(file.relationId, userId);
  },

  update : function(userId, file, fieldNames, modifier){
    return canPostMessageInRelationById(file.relationId, userId);
  },

  download : function(userId, file){
    return canViewRelationById(file.relationId, userId);
  }
});

Meteor.methods({
  'remove_file' : function(fileId){
    
    var file = getFile(fileId);

    if(!canEditRelationById(file.relationId, this.userId))
      throw new Meteor.Error(403, "Access denied this relation");

    // If it is not a file in draft
    if(file.messageId)
      Message.update(messageId, {'$pull' : {'files' : file._id}});

    Files.remove(file._id)
  }
})