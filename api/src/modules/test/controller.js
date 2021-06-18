const name = 'test'
module.exports.get = async (req, res, next) => {
  try {
    return res.status(200).json({ data: true, method: 'get' })
  } catch (e) {
    return res.status(500).send('invalid')
  }
}
module.exports.post = async (req, res, next) => {
  try {
    return res.status(200).json({ data: true, method: 'post' })
  } catch (e) {
    return res.status(500).send('invalid')
  }
}
module.exports.put = async (req, res, next) => {
  try {
    return res.status(200).json({ data: true, method: 'put' })
  } catch (e) {
    return res.status(500).send('invalid')
  }
}
module.exports.patch = async (req, res, next) => {
  try {
    return res.status(200).json({ data: true, method: 'patch' })
  } catch (e) {
    return res.status(500).send('invalid')
  }
}
module.exports.delete = async (req, res, next) => {
  try {
    return res.status(200).json({ data: true, method: 'delete' })
  } catch (e) {
    return res.status(500).send('invalid')
  }
}
