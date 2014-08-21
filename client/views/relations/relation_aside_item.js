Template.relation_aside_item.rendered = function(){
  $('.tc-relation-aside .tc-objectives').mixItUp('append', this.$);
}

Template.relation_aside_item.helpers({
  'progress_state' : function(){
    return this.progress < 100 ? 'pending' : 'completed';
  },

  'completed' : function(){
    Meteor.defer(function(){
      var $objectives = $('.tc-relation-aside .tc-objectives');
      var filter = $objectives.mixItUp('getState').activeFilter;
      $objectives.mixItUp('forceRefresh');
    })
    return this.progress >= 100;
  }
})