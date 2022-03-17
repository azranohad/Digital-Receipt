import gridfs
import pymongo


class mongoDbRepository:
    def get_client(self):
        conn_str = "mongodb+srv://Laos:Laos147258@recless.uqvqh.mongodb.net/RecLess?retryWrites=true&w=majority"
        return pymongo.MongoClient(conn_str)

    def get_db(self, db_name):
        client = self.get_client()
        dblist = client.list_database_names()
        if db_name in dblist:
            return client[db_name]
        else:
            return None


    def get_gridfs(self, database_name):
        database = self.get_client()[database_name]
        return gridfs.GridFS(database)

    def create_db(self, db_name):
        return self.get_client()[db_name]

    def get_collection_from_db(self, db_name, collection_name):
        db = self.get_db(db_name)
        collist = db.list_database_names()
        if collection_name in collist:
            return collist[collection_name]
        else:
            return None

    def create_collection(self, db_name, collection_name):
        db = self.get_db(db_name)
        return db[collection_name]



