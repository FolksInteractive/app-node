Relations = new Meteor.Collection('relations');

RelationRoles = {
  CLIENT : 'client',
  VENDOR : 'vendor'
}
Meteor.methods({
  'relation_invite': function(params){
    // Makes sure we have all the necessary params
    check(params, Object);
    check(params.email, String);
    check(params.role, String);

    // Must be loggedIn
    if(!this.userId)
      return;

    var user = getUser(this.userId);

    // Make sure a valid role type
    if(!_.contains(RelationRoles,params.role))
      throw new Meteor.Error(500, "Invalid role");

    // Make sure a valid email address
    if(!_.isEmail(params.email))
      throw new Meteor.Error(500, "Invalid email address");


    // Generate invitation token
    var token = Random.secret();

    // Check if user already exists
    var contact = Meteor.users.findOne({"emails.address" : params.email});
    var contactId = (contact) ? contact._id : null;
    
    //if user already exist
    if(contactId){
      var checkParams = {
        clientId : -1,
        vendorId : -1
      };

      if(params.role == RelationRoles.CLIENT){
        checkParams.clientId = contactId;
        checkParams.vendorId = this.userId;
      }

      if(params.role == RelationRoles.VENDOR){
        checkParams.vendorId = contactId;
        checkParams.clientId = this.userId;
      }

      //Check there is a similar relation (same client and vendor)
      var existingRelation = Relations.findOne(checkParams);

      if(existingRelation)
        return existingRelation._id;
    }
    
    // If user doesn't exist
    else{

      // Create user
      contactId = Meteor.users.insert({
        'emails': [{
          'address' : params.email,
          'verified' : false
        }],
        'active' : false,
        'inviteToken' : token,
        'createdAt' : new Date()
      });
    }

    console.log('Creating relation ...');
    // Prepare insert params
    var relationParams = {
      'createdAt' : new Date(),
      'inviteToken' : token
    }

    // assigning users role in the relation
    if(params.role == RelationRoles.CLIENT){
      relationParams.clientId = contactId;
      relationParams.vendorId = this.userId;
    }

    if(params.role == RelationRoles.VENDOR){
      relationParams.vendorId = contactId;
      relationParams.clientId = this.userId;
    }
    // Insert new Relation
    var relationId = Relations.insert(relationParams);

    // Send email with token
    if(Meteor.isServer){
      var to = params.email;
      var subject = getFullname(user)+" invites you to TimeCrumbs";
      var data = {
        contact : getFullname(contact),
        user : getFullname(user),
        url : getRelationInviteUrl(relationId, token)
      }
      var html = renderOnServer("emails-templates/invite.html", data);

      Meteor.call('send_email', to, subject, html);
    }

    return relationId;
  }
});