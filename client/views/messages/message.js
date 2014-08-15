Template.message.rendered = function(){
  $('.scrollable-wrapper').perfectScrollbar('update');
  $('.tc-timeline-section').isotope({
    itemSelector: '.tc-message',
    layoutMode: 'vertical'
  });
}

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
  }
})