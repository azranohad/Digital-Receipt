import pymongo
from singleton_decorator import singleton

@singleton
class mongoDbRepository:
    def get_client(self):
        conn_str = "mongodb+srv://Laos:Laos147258@recless.uqvqh.mongodb.net/RecLess?retryWrites=true&w=majority"
        return pymongo.MongoClient(conn_str)
    def is_collection_exist(self, db, coll):
        if coll in self.get_client()[db].collection_names():
            return True
        return False


