import pymongo
# from singleton_decorator import singleton
import os

# @singleton
class mongoDbRepository:
    def get_client(self):
        CONN_STR = "mongodb+srv://Laos:Laos147258@recless.uqvqh.mongodb.net/RecLess?retryWrites=true&w=majority"
        return pymongo.MongoClient(CONN_STR)

    def is_collection_exist(self, db, coll):
        if coll in self.get_client()[db].collection_names():
            return True
        return False


