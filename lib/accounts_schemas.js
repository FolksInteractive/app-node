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

getRegisterSchema = function(){
  return new SimpleSchema({
    firstname: {
      type: String,
      min : 2,
      max: 50
    },

    lastname: {
      type: String,
      min : 2,
      max: 50
    },

    email: {
      type: String,
      regEx: SimpleSchema.RegEx.Email
    },

    password: {
      type: String,
      min: 5,
      max: 12
    },

    confirmPassword: {
      type: String,
      min: 5,
      max: 12,
      custom: function () {
        if (this.value !== this.field('password').value) {
          return "passwordMismatch";
        }
      }
    }

  });
}