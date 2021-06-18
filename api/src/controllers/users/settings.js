const Model = require('../../models/users/settings');
const mongo = require('mongoose');

const name = 'user-setting';
module.exports.name = name;
module.exports.get = async function (req, res, next) {
  try {
    const find = await Model.find({ userId: req.verify._id });
    if (find && find.length) return res.status(200).json(find[0]);
    const data = new Model({ userId: req.verify._id });
    const rs = await data.save();
    if (rs) return res.status(200).json(rs);
    else return res.status(200).json([]);
  } catch (e) {
    // console.log(e);
    return res.status(500).send('invalid');
  }
};

module.exports.put = async function (req, res, next) {
  try {
    // if (!req.params.id) return res.status(500).send('Incorrect Id!')
    if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid');
    Model.updateOne(
      { userId: req.verify._id },
      {
        $set: {
          language: req.body.language,
          font: req.body.font,
          dense: req.body.dense,
          format: req.body.format,
          darkMode: req.body.darkMode
        }
      },
      (e, rs) => {
        // { multi: true, new: true },
        if (e) return res.status(500).send(e);
        return res.status(200).json(rs);
      }
    );
  } catch (e) {
    console.log(e);
    return res.status(500).send('invalid');
  }
};
