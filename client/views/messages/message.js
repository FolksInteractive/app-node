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
})