const mongoose = require('mongoose');
var User = require('../models/user');

module.exports.find = async function(username) {
  // you can pass query parameter to get particular record
  User.find({ name: username })
    .then((doc) => {
      console.log(doc);
    })
    .catch((e) => {
      console.log(e);
    });
}

module.exports.findById = async function(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    User.findById(id)
      .then((doc) => {
        if (doc) {
          console.log(doc)
        } else {
          console.log('No data exist for this id');
        }
      })
      .catch((e) => {
        console.log(e);
      });
  } else {
    console.log('Please provide correct Id');
  }
}

module.exports.findOne = async function(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    User.findOne({ _id: id })
      .then((doc) => {
        if (doc) {
          console.log(doc);
        } else {
          console.log('no data exist for this id');
        }
      })
      .catch((e) => {
        console.log(e);
      });
  } else {
    console.log('please provide correct id');
  }
}

module.exports.save = async function(user) {
  let Newuser = new User(user); // this is modal object.
  Newuser.save()
    .then((data) => {
      console.log(data);
    })
    .catch((e) => {
      console.log(e);
    })
}

module.exports.insert = async function(user) {
  let Newuser = new User(user);
  let Newuser1 = new User(user);
  let Newuser2 = new User(user);
  // it srore directly to collection
  User.collection.insert([Newuser, Newuser1, Newuser2])
    .then((data) => {
      console.log(data);
    }).catch((e) => {
      console.log(e);
    })
}

module.exports.create = async function(user) {
  let Newuser = new User(user);
  let Newuser1 = new User(user);
  let Newuser2 = new User(user);
  // it is using schema model for operation `User`
  User.create([Newuser, Newuser1, Newuser2])
    .then((data) => {
      console.log(data);
    }).catch((e) => {
      console.log(e);
    })
}

module.exports.insertOne = async function(user) {
  let Newuser = new User(user);
  User.collection.insertOne(Newuser)
    .then((data) => {
      console.log(data);
    }).catch((e) => {
      console.log(e);
    })
}

module.exports.findOneAndUpdate = async function(id, user) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    User.findOneAndUpdate({ _id: id }, { $set: { name: user.name } }, { new: true }).then((docs) => {
      if (docs) {
        // resolve({ success: true, data: docs });
        console.log(docs);
      } else {
        // reject({ success: false, data: 'no such user exist' });
        console.log(false);
      }
    }).catch((e) => {
      // reject(e);
      console.log(e);
    })
  } else {
    // reject({ success: 'false', data: 'provide correct key' });
    console.log(false);
  }
}

module.exports.findByIdAndUpdate = async function(id, user) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    User.findByIdAndUpdate(id, { $set: { name: user.name } }, { new: true }).then((docs) => {
      if (docs) {
        // resolve({ success: true, data: docs });
        console.log(docs);
      } else {
        // reject({ success: false, data: 'no such user exist' });
        console.log(false);
      }
    }).catch((e) => {
      // reject(e);
      console.log(e);
    })
  } else {
    // reject({ success: 'false', data: 'provide correct key' });
    console.log(false);
  }
}

module.exports.update = async function(id, user) {
  User.update({ _id: id }, { $set: { name: user.name, state: user.state } }, { multi: true, new: true })
    .then((docs) => {
      if (docs) {
        // resolve({ success: true, data: docs });
        console.log(docs);
      } else {
        // reject({ success: false, data: 'no such user exist' });
        console.log(false);
      }
    }).catch((e) => {
      console.log(e);
      // reject(err);
    })
}

module.exports.remove = async function(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    User.remove({ _id: id })
      .then((docs) => {
        if (docs) {
          // resolve({ 'success': true, data: docs });
          console.log(docs);
        } else {
          // reject({ 'success': false, data: 'no such user exist' });
          console.log(false);
        }
      }).catch((e) => {
        // reject(err);
        console.log(e);
      })
  } else {
    // reject({ 'success': false, data: 'please provide correct Id' });
    console.log(false);
  }
}

module.exports.findOneAndRemove = async function(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    User.findOneAndRemove({ _id: id })
      .then((docs) => {
        if (docs) {
          // resolve({ 'success': true, data: docs });
          console.log(docs);
        } else {
          // reject({ 'success': false, data: 'no such user exist' });
          console.log(false);
        }
      }).catch((e) => {
        // reject(err);
        console.log(e);
      })
  } else {
    // reject({ 'success': false, data: 'please provide correct Id' });
    console.log(false);
  }
}
