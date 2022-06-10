from Server.Repositories.mongoDbRepository import mongoDbRepository
from datetime import datetime

# @singleton
from systemFiles.logger.loggerService import loggerService


class creditRepository:
    def __init__(self):
        self.mongoDb_repository = mongoDbRepository()
        self.logger = loggerService()


    def insert_credit(self, user_key, credit):
        collection = self.mongoDb_repository.get_client()["Credits"]['credits']
        result = collection.insert_one(credit)
        if result.acknowledged:
            self.logger.print_info_message(
                "creditRepository | insert new credit to user: " + str(user_key))
        else:
            self.logger.print_severe_message(
                "creditRepository | failed insert credit to user: " + user_key)


    def get_by_date(self, user_key, from_date, to_date):
        collection = self.mongoDb_repository.get_client()["Credits"]['credits']
        start = datetime.strptime(from_date, '%d/%m/%Y')
        end = datetime.strptime(to_date, '%d/%m/%Y')
        cursor = collection.find({
        "date_of_credit": {
            "$gte": start,
            "$lt": end
        }, "user_key": user_key})
        credit_list = {}
        for record in cursor:
            credit_list[record['_id']] = record
        return credit_list


    # function generic search
    def get_values_by_key(self, user_key, key):
        coll_db = self.mongoDb_repository.get_client()["Credits"]['credits']
        values_map = {}
        i = 0
        for value in coll_db.distinct(key, {"user_key": user_key}):
            values_map[i] = value
            i += 1
        return values_map


    # function generic search
    def get_credit_by_value(self, user_key, key, value):
        collection = self.mongoDb_repository.get_client()["Credits"]['credits']
        cursor = collection.find({key: value, "user_key": user_key})
        receipt_list = {}
        for record in cursor:
            receipt_list[record['_id']] = record
        return receipt_list


    def get_all_credits_user(self, user_key):
        collection = self.mongoDb_repository.get_client()["Credits"]['credits']
        cursor_sort = collection.find({"user_key": user_key}).sort("date_of_credit", 1)

        credit_list = {}
        for record in cursor_sort:
            credit_list[record['_id']] = record
        return credit_list


    def get_credit_by_name(self, user_key, name_search):
        list_of_names = self.get_values_by_key(user_key, "name_for_client")
        credit_list = {}
        for name in list_of_names.values():
            if name.__contains__(name_search):
                #add all credit that contains this name
                credit_list.update(self.get_credit_by_value(user_key, "name_for_client", name))
        return credit_list