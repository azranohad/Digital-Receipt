from Server.Repositories.mongoDbRepository import mongoDbRepository
from datetime import datetime

# @singleton
from systemFiles.logger.loggerService import loggerService


class creditRepository:
    def __init__(self):
        self.mongoDb_repository = mongoDbRepository()
        self.logger = loggerService()

    def get_collection(self):
        return self.mongoDb_repository.get_client()["Credits"]['credits']

    def insert_credit(self, user_key, credit):
        collection = self.get_collection()
        result = collection.insert_one(credit)
        if result.acknowledged:
            self.logger.print_info_message(
                "creditRepository | insert new credit to user: " + str(user_key))
        else:
            self.logger.print_severe_message(
                "creditRepository | failed insert credit to user: " + user_key)


    def get_by_date(self, user_key, from_date, to_date):
        collection = self.get_collection()
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
        coll_db = self.get_collection()
        values_map = {}
        i = 0
        for value in coll_db.distinct(key, {"user_key": user_key}):
            values_map[i] = value
            i += 1
        return values_map


    # function generic search
    def get_credit_by_value(self, user_key, key, value):
        collection = self.get_collection()
        cursor = collection.find({key: value, "user_key": user_key})
        credit_list = {}
        for record in cursor:
            credit_list[record['_id']] = record
        return credit_list


    def get_all_credits_user(self, user_key):
        collection = self.get_collection()
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

    def update_credit(self, user_key, _id, request):
        dict_update_credit = {}
        for item in request:
            dict_update_credit[item] = request[item]

        dict_update_credit.pop('_id')
        dict_update_credit.pop('user_key')
        return self.update_credit_data_impl(user_key, _id, dict_update_credit)


    def update_credit_data_impl(self, user_key, _id, dict_update_credit):
        result = self.get_collection().update({'user_key': user_key,'_id': _id}, {'$set': dict_update_credit})
        is_updated_existing = result['updatedExisting']
        if is_updated_existing:
            self.logger.print_info_message(
                "creditRepository | details (" + str(dict_update_credit.keys()) + ") of receeipt: " + str(
                    _id) + " updated in data base")
        else:
            self.logger.print_severe_message(
                "creditRepository | failed update data of credit: " + _id)

        return str(is_updated_existing)


    def delete_credit(self, user_key, credit_id):
        result = self.get_collection().delete_one({'_id': credit_id, 'user_key': user_key})
        status = result.acknowledged
        if status:
            self.logger.print_event("creditRepository | credit: " + credit_id + " deleted from data base")
        else:
            self.logger.print_severe_message("creditRepository | delete credit from Data Base Failed. user key: " + user_key)
        return "credit deleted from data base"