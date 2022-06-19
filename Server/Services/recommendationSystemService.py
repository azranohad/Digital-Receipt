from Server.Repositories.receiptRepository import receiptRepository
from SystemFiles.logger.loggerService import loggerService


class recommendationSystemService:
    def __init__(self):
        self.receipt_repository = receiptRepository()
        self.logger = loggerService()

    # return list of items from favorite stores
    def get_general_recommendation(self, user_key):
        list_of_favorite_stores = self.receipt_repository.get_most_common_store_for_user(user_key)

        list_of_recommendation_items = []  # items from favorite stores add logic
        return list_of_recommendation_items


    # return list of items from store
    def get_store_recommendations(self, user_key, store_name):


        list_of_recommendation_items = []  # items from favorite stores add logic
        return list_of_recommendation_items


