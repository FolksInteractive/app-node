Comments = new Meteor.Collection('comments');

Meteor.methods({
  'reply': function(params) {
    check(params, {
      'body': NonEmptyString,
      'messageId': String,
    });

    if(!Meteor.user())
      throw new Meteor.Error(403);

    params = _.extend(params, {
      'createdAt' : new Date(),
      'userId': Meteor.userId()
    });

    return Comments.insert(params);
  }
});