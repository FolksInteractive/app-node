Template.message.helpers({
  'createdAt' : function(){
    return "<span data-livestamp='"+this.createdAt+"'>"+
    moment(this.createdAt).fromNow()
      +"</span>";
  },

  objectives : function(){
    return getObjectivesByMessage(this);
  },

  files : function(){
    return getFilesByMessageId(this);
  }
})