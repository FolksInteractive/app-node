Template.relation_discussion.rendered = function(){
  $('.tc-timeline-section').mixItUp({
      animation : {
        duration: 400,
        effects: 'fade translateZ(-360px) stagger(34ms)',
        easing: 'ease'
      },
      controls :{
        enable: false
      },
      layout: {
        display: 'block'
      },
      callbacks: {
        onMixEnd: function(state){
          $('.tc-timeline-section')
            .parent('.scrollable-wrapper')
            .perfectScrollbar('update');
        }
      }
  });
}

Template.relation_discussion.helpers({
  timeline : function(){
    return getMessagesByRelation(Session.get('currentRelationId'), {
      'sort': {
        'draftedAt': -1, 
        'postedAt': -1
      }
    }).fetch();
  }
});