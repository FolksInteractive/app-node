getLoginSchema = function(){
  return new SimpleSchema({
    email: {
      type: String,
      regEx: SimpleSchema.RegEx.Email
    },

    password: {
      type: String,
      min: 5,
      max: 12
    }
  })
}