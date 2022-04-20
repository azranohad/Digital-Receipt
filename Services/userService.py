import uuid
from singleton_decorator import singleton
from DataObjects.userDataObject import userDataObject
from Repositories.usersRepository import usersRepository
from systemFiles.logger.loggerService import loggerService


@singleton
class userService:
    def __init__(self):
        self.users_repository = usersRepository()
        self.logger = loggerService()
        self.identifier_data = ['ID', 'user_key', 'phone_number', 'mail_address']

    def create_user(self, phone_number):
        user_data = userDataObject()
        user_data.phone_number = phone_number
        user_from_db = self.get_user_by_generic_value("phone_number", phone_number)
        if len(user_from_db) > 0:
            self.logger.print_info_message("the user is exist in system, details of user updated")


        #return user key from user_from_db
            return user_from_db[0], "the user is exist in system"
        user_data.user_key = uuid.uuid4().hex
        user_data_dict = {
            "user_key": user_data.user_key,
            "phone_number": str(phone_number),
        }
        self.users_repository.create_user(user_data_dict)
        return user_data.user_key, "created a new user"

    def get_user_from_db(self, request):
        for item in request:
            if item in self.identifier_data:
                match_list = self.get_user_by_generic_value(item, request[item])
                if len(match_list) > 0:
                    self.logger.print_info_message("the user is exist, user_key: " + match_list[0])
                    return match_list[0]
        self.logger.print_info_message("the user is not exist")
        return "the user is not exist"

    def get_user_by_generic_value(self, field, value):
        users_collection = self.users_repository.get_collection()
        cursor = users_collection.find({field: value})
        user_list = []
        for record in cursor:
            user_list.append(record['user_key'])
        return user_list

    def update_user(self, user_key, request):
        user_data_update = {}
        for item in request:
            user_data_update[item] = request[item]

        user_data_update['user_key'] = user_key
        self.users_repository.update_user_data(user_key, user_data_update)




