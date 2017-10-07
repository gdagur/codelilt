// var url = 'mongodb://localhost:27017/nodeapp3';

// // if OPENSHIFT env variables are present, use the available connection info:
// if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
//   url = "mongodb://"+process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
//   process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
//   process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
//   process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
//   process.env.OPENSHIFT_APP_NAME;
// }
// module.exports = {
// 	//'url' : 'mongodb://<dbuser>:<dbpassword>@novus.modulusmongo.net:27017/<dbName>'
// 	'url' : url
// }

var mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL;                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                     
if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {                                                                                                                                                                                                         
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),                                                                                                                                                                                            
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],                                                                                                                                                                                                   
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],                                                                                                                                                                                                   
      mongoDatabase = 'nodeapp3',                                                                                                                                                                                                   
      mongoPassword = process.env[mongoServiceName + '_PASSWORD']                                                                                                                                                                                                    
      mongoUser = process.env[mongoServiceName + '_USER'];                                                                                                                                                                                                           
                                                                                                                                                                                                                                                                     
  if (mongoHost && mongoPort && mongoDatabase) {                                                                                                                                                                                                                     
    mongoURLLabel = mongoURL = 'mongodb://';                                                                                                                                                                                                                          
    if (mongoUser && mongoPassword) {                                                                                                                                                                                                                                
      mongoURL += mongoUser + ':' + mongoPassword + '@';                                                                                                                                                                                                             
    }
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;                                                                                                                                                                                              
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
  }
} 


module.exports = {
// 	//'url' : 'mongodb://<dbuser>:<dbpassword>@novus.modulusmongo.net:27017/<dbName>'
'url' : mongoURL
}