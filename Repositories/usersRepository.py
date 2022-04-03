from singleton_decorator import singleton
from Repositories.mongoDbRepository import mongoDbRepository
from systemFiles.logger.loggerService import loggerService


@singleton
class usersRepository:
    def __init__(self):
        self.mongoDb_repository = mongoDbRepository()
        self.logger = loggerService()

    def get_collection(self):
        return self.mongoDb_repository.get_client()["Users"]["Users"]


    def create_user(self, user_data_dict):
        self.get_collection().insert_one(user_data_dict)
        self.logger.print_event("user added to Data Base")


    def update_user_data(self, user_key, dict_update_user):
        self.get_collection().update({'user_key': user_key}, dict_update_user)
        self.logger.print_info_message("details (" + str(dict_update_user.keys()) + ") of user: " + str(user_key) + " updated in data base")
