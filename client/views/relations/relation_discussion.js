Template.relation_discussion.rendered = function(){
  $('.tc-timeline-section').mixItUp({
      animation : {
        duration: 400,
        effects: 'fade translateZ(-360px) stagger(34ms)',
        easing: 'ease'
      },
      layout: {
        display: 'block'
      },
      callbacks: {
        onMixEnd: function(state){
          $('.tc-timeline-section')
            .parent('scrollable-wrapper')
            .perfectScrollbar('update');
        }
      }
  });
}

Template.relation_discussion.helpers({
  timeline : function(){
    console.log('timeline')
    return getMessagesByRelation(Session.get('currentRelationId'), {
      sort: {createdAt: -1}
    }).fetch();

  }
});