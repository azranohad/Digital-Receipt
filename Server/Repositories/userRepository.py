from Server.Repositories.mongoDbRepository import mongoDbRepository
from SystemFiles.logger.loggerService import loggerService


# @singleton
class userRepository:
    def __init__(self):
        self.mongoDb_repository = mongoDbRepository()
        self.logger = loggerService()
        self.identifier_data = ['ID', 'user_key', 'phone_number', 'mail_address']


    def get_collection(self):
        return self.mongoDb_repository.get_client()["Users"]["Users"]

    def get_temp_password_coll(self):
        return self.mongoDb_repository.get_client()["login"]["temp_pass"]

    def create_user(self, user_data_dict):
        result = self.get_collection().insert_one(user_data_dict)
        if result.acknowledged:
            self.logger.print_info_message("usersRepository | user added to Data Base")
        else:
            self.logger.print_severe_message("usersRepository | add user to Data Base Failed")


    def update_user_data(self, user_key, dict_update_user):
        result = self.get_collection().update({'user_key': user_key}, {'$set': dict_update_user})
        if result['updatedExisting']:
            self.logger.print_info_message(
                "usersRepository | details (" + str(dict_update_user.keys()) + ") of user: " + str(
                    user_key) + " updated in data base")
        else:
            self.logger.print_severe_message(
                "usersRepository | failed update data of user: " + user_key)

    def get_user_from_db(self, request):
        for item in request:
            if item in self.identifier_data:
                match_list = self.get_users_by_generic_value(item, request[item])
                if len(match_list) > 0:
                    self.logger.print_info_message("the user is exist, user_key: " + match_list[0])
                    return match_list[0]
        self.logger.print_info_message("the user is not exist")

        return "the user is not exist"

    def get_users_by_generic_value(self, field, value):
        users_collection = self.get_collection()
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
        self.update_user_data(user_key, user_data_update)

    def delete_user(self, user_key):
        result = self.get_collection().delete_one({'user_key': user_key})
        if result.acknowledged:
            self.logger.print_event("usersRepository | user: " + user_key + " deleted from data base")
        else:
            self.logger.print_severe_message("usersRepository | delete user from Data Base Failed. user key: " + user_key)
        return "user deleted from data base"

    def user_name_exist(self, user_name_hash):
        cursor = self.get_collection().find({'user_name': user_name_hash})
        if cursor.count() > 0:
            return True
        return False

    def user_key_exist(self, user_key):
        cursor = self.get_collection().find({'user_key': user_key})
        if cursor.count() > 0:
            return True
        return False

    def verify_user_name_password(self, user_name_hash, password_hash):
        cursor = self.get_collection().find({'user_name': user_name_hash})
        cursor_list = list(cursor)
        if len(cursor_list) > 0:
            user_details_map = cursor_list[0]
            if password_hash.__eq__(user_details_map['password']):
                return user_details_map['user_key']

        # the user name or password incorrect
        self.logger.print_info_message('usersRepository | the user name or password incorrect')
        return 'the user name or password incorrect'

    def get_user_data(self, user_key):
        cursor = self.get_collection().find({'user_key': user_key})
        cursor_list = list(cursor)

        # the list exist single element - data of user key
        user_data_dict = cursor_list[0]
        list_of_keys = list(user_data_dict.keys())

        #filter keys
        keys_unwanted_to_send = ['_id', 'password', 'user_name']
        for unwanted_key in keys_unwanted_to_send:
            if list_of_keys.__contains__(unwanted_key):
                del user_data_dict[unwanted_key]
        return user_data_dict
