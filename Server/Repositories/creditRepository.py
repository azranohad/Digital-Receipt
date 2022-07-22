import random
import string

from Server.Repositories.mongoDbRepository import mongoDbRepository
from datetime import datetime

# @singleton
from Server.serverConsts import serverConsts
from datetime import datetime

from SystemFiles.logger.loggerService import loggerService

server_consts = serverConsts()


class creditRepository:
    def __init__(self):
        self.mongoDb_repository = mongoDbRepository()
        self.logger = loggerService()

    def get_collection(self):
        return self.mongoDb_repository.get_client()[server_consts.CREDITS_DB][server_consts.CREDITS_COLLECTION]

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
            server_consts.EXPIRATION_DATE: {
                "$gte": start,
                "$lt": end
            }, server_consts.USER_KEY: user_key})
        credit_list = {}
        for record in cursor:
            credit_list[record[server_consts.ID]] = record
        return credit_list

    # function generic search
    def get_values_by_key(self, user_key, key):
        coll_db = self.get_collection()
        values_map = {}
        i = 0
        for value in coll_db.distinct(key, {server_consts.USER_KEY: user_key}):
            values_map[i] = value
            i += 1
        return values_map

    # function generic search
    def get_credit_by_value(self, user_key, key, value):
        collection = self.get_collection()
        cursor = collection.find({key: value, server_consts.USER_KEY: user_key})
        credit_list = {}
        for record in cursor:
            credit_list[record[server_consts.ID]] = record
        return credit_list
    
    
    def list_to_dict(self, list):
        dict = {}
        for item in list:
            dict[item.get(server_consts.ID)] = item
        return dict
    
    
    def get_all_credits_user(self, user_key):
        collection = self.get_collection()
        cursor_sort = collection.find({server_consts.USER_KEY: user_key}).sort(server_consts.DATE_OF_CREDIT, 1)

        credit_dict = {}
        for record in cursor_sort:
            credit_dict[record[server_consts.ID]] = record
        try:
            return self.list_to_dict(sorted(credit_dict.values(), key=lambda x: x[server_consts.DATE_OF_CREDIT], reverse=True))
        except:
            return credit_dict


    def get_credit_by_name(self, user_key, name_search):
        list_of_names = self.get_values_by_key(user_key, server_consts.NAME_FOR_CLIENT)
        credit_list = {}
        for name in list_of_names.values():
            if name.__contains__(name_search):
                # add all credit that contains this name
                credit_list.update(self.get_credit_by_value(user_key, server_consts.NAME_FOR_CLIENT, name))
        return credit_list

    def update_credit(self, user_key, _id, request):
        dict_update_credit = {}
        for item in request:
            dict_update_credit[item] = request[item]

        dict_update_credit.pop(server_consts.ID)
        dict_update_credit.pop(server_consts.USER_KEY)
        return self.update_credit_data_impl(user_key, _id, dict_update_credit)

    def update_credit_data_impl(self, user_key, _id, dict_update_credit):
        result = self.get_collection().update({server_consts.USER_KEY: user_key, server_consts.ID: _id}, {'$set': dict_update_credit})
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
        result = self.get_collection().delete_one({server_consts.ID: credit_id, server_consts.USER_KEY: user_key})
        status = result.acknowledged
        if status:
            self.logger.print_event("creditRepository | credit: " + credit_id + " deleted from data base")
        else:
            self.logger.print_severe_message(
                "creditRepository | delete credit from Data Base Failed. user key: " + user_key)
        return str(status)

# repo = creditRepository()
# users = ["33310727751848c19a8877140d3ce3ac", "c590e1226f184638bb3753188e37917a", "a02b5a3e82ba4235a23381d4586bd60c", "a32b34ee98ed4b5e88f022a4cd683ba5"]
#
# for user in users:
#     repo.insert_credit(user, {
#         server_consts.USER_KEY: user,
#         server_consts.MARKET: "super-pharm",
#         server_consts.DATE_OF_CREDIT: datetime.today() + timedelta(days=-600),
#         server_consts.EXPIRATION_DATE:  datetime.today() + timedelta(days=30),
#         "total_price": 150,
#         server_consts.CREDIT_ID: ''.join(random.choice(string.digits) for i in range(13)),
#         "isDigitalCredit": True
#     })
