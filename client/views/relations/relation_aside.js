Template.relation_aside.rendered = function(){
  $('.tc-relation-aside .tc-objectives').mixItUp({
      animation : {
        duration: 400,
        effects: 'fade translateY(-360px) stagger(34ms)',
        easing: 'ease'
      },
      layout: {
        display: 'block'
      },
      load:{
        filter: '.pending'
      },
      selectors: {
        filter: '.tc-overview-item'
      },
      callbacks: {
        onMixEnd: function(state){
          $('.tc-relation-aside')
            .find('.scrollable-wrapper')
            .perfectScrollbar('update');
        }
      }
  });
}

Template.relation_aside.helpers({
  'user' : function(){
    return Meteor.user();
  },

  'objectives' : function(){
    return getObjectives();
  },

  'contact' : function(){
    return getContact(Session.get('currentRelationId'))
  },

  'count_pending' : function(){
    return countObjectives({progress: {"$lt": 100}})
  },

  'count_completed' : function(){
    return countObjectives({progress: 100})
  }
})


Template.relation_aside.events({
  'click .tc-objectives li' : function(e){
    e.preventDefault();

    console.log($('.tc-timeline-section').children().length);

    DiscussionFilter.criterias.objectiveId = this._id;
  },
});


