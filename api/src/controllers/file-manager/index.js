const formidable = require('formidable'),
  io = require('../../utils/io'),
  request = require('../../utils/request');

const name = 'file-manager';
module.exports.name = name;
module.exports.get = async function (req, res, next) {
  try {
    const result = [];
    io.getAllFolder(result, process.env.UPLOAD_DIR);
    if (result) res.status(201).json(result).end();
    else res.status(404).json({ msg: 'exist', params: 'data' }).end();
  } catch (e) {
    console.log(e);
    return res.status(500).send('invalid');
  }
};

module.exports.getDirectories = async function (req, res, next) {
  try {
    req.query.dir = req.query.dir || process.env.UPLOAD_PATH;
    const result = io.getAllDirectories({ dir: req.query.dir });
    if (result) {
      res
        .status(201)
        .json([
          {
            id: 0,
            name: 'Root',
            fullName: '',
            directory: '',
            fullPath: '',
            icon: 'folder',
            children: result,
          },
        ])
        .end();
    } else res.status(404).json({ msg: 'exist', params: 'data' }).end();
  } catch (e) {
    console.log(e);
    // return res.status(500).send(e)
    return res.status(500).json({ error: e, dir: process.env.PUBLIC_DIR });
  }
};

module.exports.getFiles = async function (req, res, next) {
  try {
    req.query.dir = req.query.dir || process.env.UPLOAD_PATH;
    const result = io.getFiles({ dir: req.query.dir, host: request.getHost(req) });
    if (result) res.status(201).json(result).end();
    else res.status(404).json({ msg: 'exist', params: 'data' }).end();
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
};

module.exports.post = async function (req, res, next) {
  try {
    const form = new formidable.IncomingForm();
    const create_dir = await io.createDir({ dir: req.headers['upload-path'] });
    const rename = req.headers['upload-rename'] === 'true' ? true : false;
    form.uploadDir = create_dir.path;
    form.keepExtensions = true;
    // form.multiples = true
    form.maxFileSize = 5 * 1024 * 1024; // Max 5MB

    // form.on('fileBegin', function(name, file) {
    // })
    form.on('file', (field, file) => {
      // rename the incoming file to the file's name
      if (rename) {
        const tmp = file.path.split('\\');
        file.name = tmp[tmp.length - 1].replace('upload_', '');
      }
      io.rename(file.path, `${form.uploadDir}/${file.name}`);
    });

    form.on('error', (e) => {
      console.log('an error has occured with form upload');
      req.resume();
    });

    form.on('aborted', (e) => {
      console.log('user aborted upload');
    });

    form.on('end', (fields, files) => {});

    form.onPart = function (part) {
      if (part.filename) {
        // || part.filename.match(/\.(jpg|jpeg|png)$/i)
        this.handlePart(part);
      } else {
        console.log(part.filename + ' is not allowed');
      }
    };

    form.parse(req, (_, fields, files) => {
      const rs = []; // await dbapi.create(body)
      let file = Object.keys(files);
      if (file.length > 0) {
        file = files[file];
        rs.push({
          name: file.name,
          fullName:
            request.getHost(req) +
            '/' +
            process.env.UPLOAD_DIR +
            '/' +
            req.headers['upload-path'] +
            '/' +
            file.name,
          size: file.size,
          ext: io.getExtention(file.name),
          icon: 'file',
          path: `${process.env.UPLOAD_DIR}/${req.headers['upload-path']}`,
          type: file.type,
        });
      }
      if (rs) res.status(201).json(rs).end();
      else res.status(404).json({ msg: 'exist', params: 'data' }).end();
    });
    // const tmp_file = {
    //   path: req.headers['upload-path'],
    //   size: file.size,
    //   originalname: file.name,
    //   filename: rename ? file.path : `${req.headers['upload-path']}/${file.name}`,
    //   extension: io.getExtention(file.name),
    //   mimetype: file.type
    // }
    // result.push(tmp_file)
    // for (const e of req.files) {
    //   result.push({
    //     path: req.headers.path,
    //     size: e.size,
    //     originalname: e.filename,
    //     filename: `${req.headers.path}/${e.filename}`,
    //     extension: io.getExtention(e.filename),
    //     mimetype: e.mimetype
    //   })
    // }
    // console.log(result)
    // if (result) res.status(201).json(result).end()
    // else res.status(404).json({ msg: 'exist', params: 'data' }).end()
  } catch (e) {
    return res.status(500).send('invalid');
  }
};
