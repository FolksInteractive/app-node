 
normalizeLinkedinUser = function(options){
  normalized = {};

  // Normalizing properties name
  normalized.profile = {
    'firstname' : options.firstName,
    'lastname' : options.lastName,
    'headline' : options.headline || null,
    'pictureUrl' : options.pictureUrl || null,
    'location' : options.location || null,
  };

  normalized.linkedinId = options.id

  if(options.emailAddress)
    normalized.emails = [{
      'address' : options.emailAddress,
      'verified' : false
    }];

  return normalized;
}