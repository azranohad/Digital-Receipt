import csv
import os

from Server.Repositories.mongoDbRepository import mongoDbRepository
from datetime import datetime
# @singleton
from Server.Repositories.receiptRepository import receiptRepository
from Server.Repositories.userRepository import userRepository
from Server.serverConsts import serverConsts
from SystemFiles.logger.loggerService import loggerService

server_consts = serverConsts()

class recommendationSystemRepository:
    def __init__(self):
        self.mongoDb_repository = mongoDbRepository()
        self.user_repository = userRepository()
        self.receipt_repository = receiptRepository()
        self.logger = loggerService()

    def get_user_data(self, user_maps, user_key):
        if user_key in user_maps:
            return user_maps.get(user_key)
        return self.user_repository.get_user_data(user_key)

    def get_all_receipt_by_market(self, market):
        self.logger.print_info_message("recommendationSystemRepository | export all items from market - " + market + " - START")
        current_path = os.getcwd()
        path = current_path[:current_path.find(server_consts.FOLDER_PROJECT_NAME) + 16] + "RecommendationSystem\itemsDataFromDB\\"
        header_info = [server_consts.USER_KEY, server_consts.AGE, server_consts.GENDER, 'date', server_consts.ITEM_ID, 'itemDescription', 'brand', 'category', 'amount', 'price']
        file = open(path + str(datetime.now().strftime('%d_%m_%Y')) + '$' + market + '$items_data.csv', 'w', newline='', encoding = "ISO-8859-8", errors="ignore")
        writer = csv.DictWriter(file, fieldnames=header_info)
        writer.writeheader()


        receipts = self.get_receipt_by_value(server_consts.MARKET, market)
        user_maps = {}
        num_of_receipt = len(receipts)
        i = 1
        for receipt in receipts.values():
            item_list_to_return = []
            user_key = receipt.get(server_consts.USER_KEY)
            if user_key in user_maps:
                user_data = user_maps.get(user_key)
            else:
                user_data = self.user_repository.get_user_data(user_key)
                user_maps[user_key] = user_data

            common_data_for_recommendation_system = {
                server_consts.USER_KEY: user_key,
                server_consts.AGE: user_data.get(server_consts.AGE),
                server_consts.GENDER: user_data.get(server_consts.GENDER),
                'date': receipt.get(server_consts.DATE_OF_RECEIPT)
            }
            for item in receipt.get('items'):
                item_for_rec_system = dict(common_data_for_recommendation_system)
                item_for_rec_system.update(item)
                item_list_to_return.append(item_for_rec_system)
            writer.writerows(item_list_to_return)
            print(market + ": " + str(i) + '/' + str(num_of_receipt))
            i += 1

        self.logger.print_info_message("recommendationSystemRepository | export all items from market - " + market + " - FINALLY")



    # function generic search
    def get_receipt_by_value(self, key, value):
        collection = self.mongoDb_repository.get_client()[server_consts.RECEIPTS_DB][server_consts.RECEIPTS_COLLECTION]
        cursor = collection.find({key: value, server_consts.IS_DIGITAL_RECEIPT: True})
        receipt_list = {}
        for record in cursor:
            receipt_list[record[server_consts.ID]] = record
        return receipt_list

    def get_all_distinct_users(self):
        return self.user_repository.get_all_user_distinct()

    def get_all_store_distinct(self):
        return self.receipt_repository.get_distinct_values_by_key(server_consts.MARKET)


# rec = recommendationSystemRepository()
# stores = rec.get_all_store_distinct()
# users = rec.get_all_distinct_users()
# rec.get_all_receipt_by_market('super-pharm')
# rec.get_all_receipt_by_market('walmart')