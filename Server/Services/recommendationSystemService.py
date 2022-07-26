from RecommendationSystem.recommender import Recommender
from Server.Repositories.receiptRepository import receiptRepository
from Server.Repositories.stroeRepository import storeRepository
from Server.Repositories.userRepository import userRepository
from Server.serverConsts import serverConsts
from SystemFiles.logger.loggerService import loggerService

server_consts = serverConsts()

class recommendationSystemService:
    def __init__(self):
        self.receipt_repository = receiptRepository()
        self.store_repository = storeRepository()
        self.user_repository = userRepository()
        self.rec = Recommender()
        self.logger = loggerService()

    # return list of items from favorite stores
    def get_general_recommendation(self, user_key):
        list_of_favorite_stores = self.receipt_repository.get_most_common_store_for_user(user_key)
        list_of_recommendation_items = self.rec.general_recommendation(user_key, list_of_favorite_stores)
        return self.get_dict_recommended_items(list_of_recommendation_items)



    # return list of items from store
    def get_store_recommendations(self, user_key, store_name):
        list_of_recommendation_items = self.rec.store_recommendation(user_key, store_name)
        return self.get_dict_recommended_items(list_of_recommendation_items)


    def get_dict_recommended_items(self, list_of_recommendation_items):
        items_data = {}
        for itemID in list_of_recommendation_items[:5]:
            item_data = self.store_repository.get_item_data_by_itemID(itemID)
            item_data.pop(server_consts._ID)
            items_data[str(item_data.get(server_consts.ITEM_ID))] = item_data
        return items_data

    def get_store_recommendations_by_phone_number(self, phone_number, store_name):
        user_key = self.user_repository.get_users_by_generic_value(server_consts.PHONE_NUMBER, phone_number)[0]
        return self.get_store_recommendations(user_key, store_name)



