import uuid
from datetime import datetime

from Server.Repositories.mongoDbRepository import mongoDbRepository
# @singleton
from Server.serverConsts import serverConsts
import dateutil
from dateutil.parser import parse

from SystemFiles.logger.loggerService import loggerService

server_consts = serverConsts()

class receiptRepository:
    def __init__(self):
        self.mongoDb_repository = mongoDbRepository()
        self.logger = loggerService()

    def get_collection(self):
        return self.mongoDb_repository.get_client()[server_consts.RECEIPTS_DB][server_consts.RECEIPTS_COLLECTION]

    def get_most_common_store_for_user(self, user_key, number_of_stores=2):

        cursor = self.get_collection().aggregate([
            {"$match":{server_consts.USER_KEY:user_key}},
            {"$sortByCount":"$market"},
            {"$limit":number_of_stores}
        ])

        list_of_favorite_stores = []
        for store in cursor:
            list_of_favorite_stores.append(store.get(server_consts.ID))

        return list_of_favorite_stores


    def insert_receipt(self, user_key, receipt):
        collection = self.get_collection()
        result = collection.insert_one(receipt)
        status = result.acknowledged
        if status:
            self.logger.print_info_message(
                "receiptRepository | insert new receipt to user: " + str(user_key))
        else:
            self.logger.print_severe_message(
                "receiptRepository | failed insert receipt to user: " + user_key)
        return str(status)
    def get_by_date(self, user_key, from_date, to_date):
        collection = self.get_collection()
        start = datetime.strptime(from_date, '%d/%m/%Y')
        end = datetime.strptime(to_date, '%d/%m/%Y')
        cursor = collection.find({
        server_consts.DATE_OF_RECEIPT: {
            "$gte": start,
            "$lt": end
        }, server_consts.USER_KEY: user_key})
        receipt_list = {}
        for record in cursor:
            receipt_list[record[server_consts.ID]] = record
        return receipt_list

    # function generic search
    def get_values_by_key(self, user_key, key):
        values_map = {}
        i = 0
        for value in self.get_collection().distinct(key, {server_consts.USER_KEY: user_key}):
            values_map[i] = value
            i += 1
        return values_map

    # function generic search
    def get_receipt_by_value(self, user_key, key, value):
        cursor = self.get_collection().find({key: value, server_consts.USER_KEY: user_key})
        receipt_list = {}
        for record in cursor:
            receipt_list[record[server_consts.ID]] = record
        return receipt_list

    def list_to_dict(self, list):
        dict = {}
        for item in list:
            dict[item.get(server_consts.ID)] = item
        return dict

    def get_all_receipts_user(self, user_key):
        collection = self.get_collection()
        cursor_sort = collection.find({server_consts.USER_KEY: user_key}).sort(server_consts.DATE_OF_RECEIPT, 1)

        receipt_list = {}
        for record in cursor_sort:
            receipt_list[record[server_consts.ID]] = record
        try:
            return self.list_to_dict(sorted(receipt_list.values(), key=lambda x: x[server_consts.DATE_OF_RECEIPT],  reverse=True))
        except:
            return receipt_list

    def get_receipt_by_name(self, user_key, name_search):
        list_of_names = self.get_values_by_key(user_key, server_consts.NAME_FOR_CLIENT)
        receipt_list = {}
        for name in list_of_names.values():
            if name.__contains__(name_search):
                #add all receipt that contains this name
                receipt_list.update(self.get_receipt_by_value(user_key, server_consts.NAME_FOR_CLIENT, name))
        return receipt_list

    def update_receipt(self, user_key, _id, request):
        dict_update_receipt = {}
        for item in request:
            dict_update_receipt[item] = request[item]
        if server_consts.DATE_OF_RECEIPT in request.keys():
            dict_update_receipt[server_consts.DATE_OF_RECEIPT] = dateutil.parser.parse(request.get(server_consts.DATE_OF_RECEIPT))
        dict_update_receipt.pop(server_consts.ID)
        dict_update_receipt.pop(server_consts.USER_KEY)
        return self.update_receipt_data_impl(user_key, _id, dict_update_receipt)

    def update_receipt_data_impl(self, user_key, _id, dict_update_receipt):
        result = self.get_collection().update({server_consts.USER_KEY: user_key, server_consts.ID: _id}, {'$set': dict_update_receipt})
        is_updated_existing = result['updatedExisting']
        if is_updated_existing:
            self.logger.print_info_message(
                "receiptRepository | details (" + str(dict_update_receipt.keys()) + ") of receeipt: " + str(
                    _id) + " updated in data base")
        else:
            self.logger.print_severe_message(
                "receiptRepository | failed update data of receipt: " + _id)

        return str(is_updated_existing)


    def delete_receipt(self, user_key, receipt_id):
        result = self.get_collection().delete_one({server_consts.ID: receipt_id, server_consts.USER_KEY: user_key})
        status = result.acknowledged
        if status:
            self.logger.print_event("receiptRepository | receipt: " + receipt_id + " deleted from data base")
        else:
            self.logger.print_severe_message("receiptRepository | delete receipt from Data Base Failed. user key: " + user_key)
        return str(status)



    def get_distinct_values_by_key(self, key):
        return self.get_collection().distinct(key)

# repo = receiptRepository()
# users = ["33310727751848c19a8877140d3ce3ac", "c590e1226f184638bb3753188e37917a", "a02b5a3e82ba4235a23381d4586bd60c", "a32b34ee98ed4b5e88f022a4cd683ba5"]
# stores = ["K.S.P", "H&O", "Terminal X", "Adidas", "Nike", "Foot Locker", "FOX"]
# for user in users:
#     receipts = repo.get_all_receipts_user(user)
#     for rec in receipts.values():
#         if stores.__contains__(rec.get(server_consts.MARKET)):
#             repo.delete_receipt(user, rec.get(server_consts.ID))
# x = 3
#
#
# for user in users:
#     for store in stores:
#         repo.insert_receipt(user, {
#             server_consts.USER_KEY: user,
#             server_consts.MARKET: store,
#             "total_price" : 157.0,
#             server_consts.DATE_OF_RECEIPT : dateutil.parser.parse('15/04/2022')
#         })
#
#
# x = 3

