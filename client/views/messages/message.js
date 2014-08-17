Template.message.rendered = function(){
  $('.tc-timeline-section').mixItUp('append', this.$);
}

Template.message.helpers({
  'time' : function(){
    return moment(this.createdAt).fromNow();
  },

  objectives : function(){
    return getObjectivesByMessage(this);
  },

  files : function(){
    return getFilesByMessage(this);
  },
})