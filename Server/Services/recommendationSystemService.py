from Server.Repositories.receiptRepository import receiptRepository
# from SystemFiles.logger.loggerService import loggerService
from SystemFiles.logger.loggerService import loggerService
from RecommendationSystem.rec import Recomender


class recommendationSystemService:
    def __init__(self):
        self.receipt_repository = receiptRepository()
        self.logger = loggerService()

    # return list of items from favorite stores
    def get_general_recommendation(self, user_key):
        rec = Recomender()
        list_of_favorite_stores = self.receipt_repository.get_most_common_store_for_user(user_key)
        list_of_recommendation_items = rec.general_recommendation(user_key, list_of_favorite_stores)
        return list_of_recommendation_items


    # return list of items from store
    def get_store_recommendations(self, user_key, store_name):
        rec = Recomender()
        list_of_recommendation_items = rec.store_recommendation(user_key, store_name)
        return list_of_recommendation_items


# r = recommendationSystemService()
# print(r.get_store_recommendations('893fc2e900d94cf084f8186f1486e9ce', 'liron'))
