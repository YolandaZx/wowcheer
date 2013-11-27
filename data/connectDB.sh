mongo_username='root'
mongo_password='wowcheer'
dbname='wowcheer'
dbusername='root'
dbpwd='wowcheer'

#Connect to db using given name and password
mongo admin --username $mongo_username --password $mongo_password

#Create db and add admin user
#db = db.getSiblingDB("$dbname")
#db.addUser( { user: "$dbusername", pwd: "$dbpwd", roles: [ "readWrite", "dbAdmin" ]} )
