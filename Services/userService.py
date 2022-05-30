import string
import uuid
import random
import re
import hashlib

from cachetools import TTLCache
from singleton_decorator import singleton
from DataObjects.userDataObject import userDataObject
from Features.SMSSender.smsService import smsService
from Repositories.userRepository import userRepository
from SystemFiles.logger.loggerService import loggerService


# @singleton
class userService:
    def __init__(self):
        self.user_repository = userRepository()
        self.logger = loggerService()
        self.sms_service = smsService()
        self.login_password_cache = TTLCache(maxsize=100000, ttl=70)

    def create_user(self, phone_number, user_data_details):
        user_data = userDataObject()
        user_data.phone_number = phone_number
        user_from_db = self.user_repository.get_users_by_generic_value("phone_number", phone_number)
        if len(user_from_db) > 0:
            self.logger.print_info_message("the user is exist in system, details of user updated")

            # return user key from user_from_db
            return user_from_db[0], "the user is exist in system"
        user_data.user_key = uuid.uuid4().hex
        user_data_dict = {
            "user_key": user_data.user_key,
            "phone_number": str(phone_number),
        }
        self.user_repository.create_user(user_data_dict)
        self.user_repository.update_user(user_data.user_key, user_data_details)
        return user_data.user_key, "created a new user"

    # phone = str phone number to send sms
    def log_in_phone_number(self, phone):
        # generate random 6 digits to temp password
        temp_password = ''.join(random.choice(string.digits) for i in range(6))
        self.login_password_cache[phone] = temp_password
        # self.sms_service.send_temp_password_login(phone, temp_password)

        # temp for test
        return temp_password

        # message that sms send
        # return True

    def verify_sms_temp_password(self, phone, temp_pass_from_user):
        return self.login_password_cache.get(phone) is temp_pass_from_user

    def get_user_key_sms_login(self, phone, temp_pass_from_user):
        if self.verify_sms_temp_password(phone, temp_pass_from_user):
            self.logger.print_event('verify sms code for phone number: ' + str(phone))
            return self.user_repository.get_users_by_generic_value('phone_number', phone)[0]

        self.logger.print_event('mismatch sms code for phone number: ' + str(phone))
        return False

    def check_the_validity_of_a_password(self, password):
        flag = 0
        comment = ''
        while True:
            if (len(password) < 8):
                flag = -1
                comment = 'the password must include 8 chars or more'
                break
            elif not re.search("[a-z]", password):
                flag = -1
                comment = 'the password must include Lowercase Characters'
                break
            elif not re.search("[A-Z]", password):
                flag = -1
                comment = 'the password must include Uppercase Characters'
                break
            elif not re.search("[0-9]", password):
                flag = -1
                comment = 'the password must include Numbers'
                break
            elif not re.search("[_@$!#%^&*~]", password):
                flag = -1
                comment = 'the password must include Symbol'
                break
            elif re.search("\s", password):
                flag = -1
                break
            else:
                self.logger.print_info_message("userService | Valid Password")
                return True, 'Valid Password'

        if flag == -1:
            self.logger.print_info_message("userService | Not a Valid Password" + comment)
            return False, comment

    def get_hash_string(self, string_to_hash):
        return hashlib.sha256(string_to_hash.encode('utf-8')).hexdigest()

    def add_user_name_and_password(self, user_key, user_name, password):
        if not self.user_repository.user_key_exist(user_key):
            return False, 'user key is not exist'

        valid_password = self.check_the_validity_of_a_password(password)
        if not valid_password[0]:
            return False, valid_password[1]

        user_name_hash = self.get_hash_string(user_name)
        password_hash = self.get_hash_string(password)

        if self.user_repository.user_name_exist(user_name_hash):
            self.logger.print_info_message('userService | That username is taken')
            return False, 'That username is taken. Try another'

        self.user_repository.update_user_data(user_key, {
            'user_name': user_name_hash,
            'password': password_hash
        })
        return True, 'create user name and password success'

    def change_password(self, user_name, last_password, password):
        user_key = self.user_repository.verify_user_name_password(self.get_hash_string(user_name),
                                                                  self.get_hash_string(last_password))
        if user_key[0] == False:
            # the user name or password incorrect
            return False, 'the user name or password incorrect'

        if not self.check_the_validity_of_a_password(password):
            self.logger.print_info_message('userService | the password is not valid')
            return False, 'the password is not valid'

        self.user_repository.update_user_data(user_key[1], {
            'password': self.get_hash_string(password)
        })
        self.logger.print_info_message('userService | the password of user: ' + user_key[1] + ' updated')
        return True, 'the password updated'

    def login_user_name_and_password(self, user_name, password):
        # return tuple (boolean, message)
        return self.user_repository. \
            verify_user_name_password(self.get_hash_string(user_name),
                                      self.get_hash_string(password))

    def delete_user(self, user_key):
        self.user_repository.delete_user(user_key)
