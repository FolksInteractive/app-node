Template.message.rendered = function(){
}

Template.message.helpers({
  'time' : function(){
    return moment(this.postedAt).fromNow();
  },

  'delay' : function(){
    var animationDelay = 'animation-delay: '+(this.index*50)+'ms'
    return '-webkit-'+animationDelay+'; '+animationDelay;
  },

  'isEmptyDraft' : function(){
    if(!this.draft) return false;

    return !(
      this.body ||
      getObjectivesByMessage(this).count() > 0 ||
      getProgressNotesByMessage(this).count() > 0 ||
      getFilesByMessage(this).count() > 0
    );
  }
})