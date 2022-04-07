function Logger (UserID, CollectionName, CollectionID, method, UserAgent, CreatedAt, CreatedIp) {
  this.UID = UserID // User ID
  this.name = CollectionName// Collection Name
  this.id = CollectionID // Collection ID
  this.method = method // insert
  this.agent = UserAgent //requestHelper.getUserAgent(request)
  this.at = CreatedAt // new Date()
  this.ip = CreatedIp //requestHelper.getIp(request)
}
module.exports = Logger