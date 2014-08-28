Files = new FS.Collection("files", {
  stores: [
    new FS.Store.FileSystem("files", {
      'path' : '/app-storage'
    })
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

    // Must be loggedIn
    if(!this.userId)
      throw new Meteor.Error(403)
    
    if(!canEditRelationById(file.relationId, this.userId))
      throw new Meteor.Error(403, "Access denied this relation");
    
    Files.remove(file._id);
  }
})