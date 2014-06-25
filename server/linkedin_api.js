var apiUrl = "https://api.linkedin.com/v1"
var fields = ['id', 'firstName', 'lastName', 'emailAddress', 'pictureUrl', 'headline', 'location', 'industry'];
var getAccessToken = function(userId){
  check(userId, String);

  var user = getUser(userId);
  return user.services.linkedin.accessToken || '';
}

Meteor.methods({
  'IN_message' : function(from, to, subject, body){

    if(!this.userId)
      return;
    
    var url = apiUrl+'/people/~/mailbox';

    var message = {
      'subject': subject,
      'body': body,
      'recipients': {
        'values': [
          { 
            'person': { '_path': '/people/~'}
          }
        ]
      }
    }

    var response = Meteor.http.post(url, {
      'data' : message,
      'params': {
        'oauth2_access_token': getAccessToken(this.userId),
        'format': 'json'  
      },
      'headers': {
        'content-type' : 'application/json'
      }
    })
  },

  'IN_connections' : function(){
    if(!this.userId)
      return;

    var url = apiUrl+'/people/~/connections:(' + fields.join(',') + ')';

    var connections = Meteor.http.get(url, {
      params: {
        'oauth2_access_token': getAccessToken(this.userId),
        'format': 'json'
      }
    }).data.values;


    return _.map(connections, normalizeLinkedinUser);
  },

  'IN_profile' : function(connectionId){

    if(!this.userId)
      return;

    var id = connectionId || '~';

    var url = apiUrl+'/people/'+id+':(' + fields.join(',') + ')';

    var profile = Meteor.http.get(url, {
      params: {
        'oauth2_access_token': getAccessToken(this.userId),
        'format': 'json'
      }
    }).data;
    
    return normalizeLinkedinUser(profile);
  }
});