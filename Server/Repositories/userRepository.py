from Server.Repositories.mongoDbRepository import mongoDbRepository


# @singleton
from Server.serverConsts import serverConsts
from SystemFiles.logger.loggerService import loggerService

server_consts = serverConsts()

class userRepository:
    def __init__(self):
        self.mongoDb_repository = mongoDbRepository()
        self.logger = loggerService()
        self.identifier_data = [server_consts.ID, server_consts.USER_KEY, server_consts.PHONE_NUMBER, server_consts.MAIL_ADDRESS]


    def get_collection(self):
        return self.mongoDb_repository.get_client()[server_consts.USERS_DB][server_consts.USERS_COLLECTION]

    def create_user(self, user_data_dict):
        result = self.get_collection().insert_one(user_data_dict)
        if result.acknowledged:
            self.logger.print_info_message("usersRepository | user added to Data Base")
        else:
            self.logger.print_severe_message("usersRepository | add user to Data Base Failed")


    def update_user_data(self, user_key, dict_update_user):
        result = self.get_collection().update({server_consts.USER_KEY: user_key}, {'$set': dict_update_user})
        update_success = result[server_consts.UPDATED_EXISTING]
        if result[server_consts.UPDATED_EXISTING]:
            self.logger.print_info_message(
                "usersRepository | details of user: " + str(
                    user_key) + " updated in data base")
        else:
            self.logger.print_severe_message(
                "usersRepository | failed update data of user: " + user_key)
        return str(update_success)
    def get_user_from_db(self, request):
        for item in request:
            if item in self.identifier_data:
                match_list = self.get_users_by_generic_value(item, request[item])
                if len(match_list) > 0:
                    self.logger.print_info_message("usersRepository | the user is exist, user_key: " + match_list[0])
                    return match_list[0]
        self.logger.print_info_message("usersRepository | the user is not exist")

        return server_consts.STRING_USER_EXIST

    def get_users_by_generic_value(self, field, value):
        users_collection = self.get_collection()
        cursor = users_collection.find({field: value})
        user_list = []
        for record in cursor:
            user_list.append(record[server_consts.USER_KEY])
        return user_list

    def update_user(self, user_key, request):
        user_data_update = {}
        for item in request:
            user_data_update[item] = request[item]

        user_data_update[server_consts.USER_KEY] = user_key
        return self.update_user_data(user_key, user_data_update)

    def delete_user(self, user_key):
        result = self.get_collection().delete_one({server_consts.USER_KEY: user_key})
        if result.acknowledged:
            self.logger.print_event("usersRepository | user: " + user_key + " deleted from data base")
        else:
            self.logger.print_severe_message("usersRepository | delete user from Data Base Failed. user key: " + user_key)
        return server_consts.STRING_USER_DELETED

    def user_name_exist(self, user_name_hash):
        cursor = self.get_collection().find({server_consts.USER_NAME: user_name_hash})
        if cursor.count() > 0:
            return True
        return False

    def is_user_exist(self, key, value):
        cursor = self.get_collection().find({key: value})
        if cursor.count() > 0:
            return True
        return False

    def verify_user_name_password(self, user_name_hash, password_hash):
        cursor = self.get_collection().find({server_consts.USER_NAME: user_name_hash})
        cursor_list = list(cursor)
        if len(cursor_list) > 0:
            user_details_map = cursor_list[0]
            if password_hash.__eq__(user_details_map[server_consts.PASSWORD]):
                return user_details_map[server_consts.USER_KEY]

        # the user name or password incorrect
        self.logger.print_info_message('usersRepository | the user name or password incorrect')
        return server_consts.STRING_INVALID_USER_NAME_OR_PASSWORD

    def get_user_data(self, user_key):
        cursor = self.get_collection().find({server_consts.USER_KEY: user_key})
        cursor_list = list(cursor)

        # the list exist single element - data of user key
        user_data_dict = cursor_list[0]
        list_of_keys = list(user_data_dict.keys())

        #filter keys
        keys_unwanted_to_send = [server_consts._ID, server_consts.PASSWORD, server_consts.USER_NAME]
        for unwanted_key in keys_unwanted_to_send:
            if list_of_keys.__contains__(unwanted_key):
                del user_data_dict[unwanted_key]
        return user_data_dict

    def get_all_user_distinct(self):
        return self.get_collection().distinct(server_consts.USER_KEY)
