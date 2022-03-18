mongorestore --host Cluster0-shard-0/cluster0-shard-00-00-sb5wt.gcp.mongodb.net:27017,cluster0-shard-00-01-sb5wt.gcp.mongodb.net:27017,cluster0-shard-00-02-sb5wt.gcp.mongodb.net:27017 --ssl --username tuanmjnh --password sWeirDXzqysxirxH --authenticationDatabase admin --db tm-store tm-store/
pause

mongorestore --uri mongodb+srv://tuanmjnh:sWeirDXzqysxirxH@cluster0.sb5wt.gcp.mongodb.net --drop --db tm-store tm-store/
