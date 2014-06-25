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
    return getFilesByMessage(this);
  },

  new : function(){
    var now = moment();
    var createdAt = moment(this.createdAt);
    var diff = now.diff(createdAt);

    return diff < 5000 ? 'new' : '';
  }  
})