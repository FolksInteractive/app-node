Template.message.helpers({
  'time' : function(){
    return moment(this.createdAt).format("HH:mm");
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
  },

  show : function(){
    return DiscussionFilter.match(this) ? 'tc-show' : 'tc-hide';
  },

  height : function(){
    return $("#"+this._id).height()+"px";
  }
})