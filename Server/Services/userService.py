import string
import uuid
import random
import re
import hashlib

from cachetools import TTLCache

from Server.DataObjects.userDataObject import userDataObject
from Server.Features.SMSSender.smsService import smsService
from Server.Repositories.userRepository import userRepository
from Server.serverConsts import serverConsts
from systemFiles.logger.loggerService import loggerService

server_consts = serverConsts()

# @singleton


class userService:
    def __init__(self):
        self.user_repository = userRepository()
        self.logger = loggerService()
        self.sms_service = smsService()
        self.login_password_cache = TTLCache(maxsize=100000, ttl=300)

    def create_user(self, phone_number, user_data_details):
        user_data = userDataObject()
        user_data.phone_number = phone_number

        if self.user_repository.is_user_exist(server_consts.PHONE_NUMBER, phone_number):
            self.logger.print_info_message("userService | the user is exist in system, details of user updated")
            # return user key from user_from_db

            return self.user_repository.get_users_by_generic_value(server_consts.PHONE_NUMBER, phone_number)[0]

        user_data.user_key = uuid.uuid4().hex
        user_data_dict = {
            server_consts.USER_KEY: user_data.user_key,
            server_consts.PHONE_NUMBER: str(phone_number),
        }
        self.user_repository.create_user(user_data_dict)
        self.user_repository.update_user(user_data.user_key, user_data_details)
        return user_data.user_key


    # phone = str phone number to send sms
    def log_in_phone_number(self, phone_number):
        if not self.user_repository.is_user_exist(server_consts.PHONE_NUMBER, phone_number):
            self.create_user(phone_number, {})
        # generate random 6 digits to temp password
        temp_password = ''.join(random.choice(string.digits) for i in range(6))
        self.login_password_cache[phone_number] = temp_password
        self.sms_service.send_temp_password_login(phone_number, temp_password)

        # temp for test
        return temp_password

        # message that sms send
        # return True

    def verify_sms_temp_password(self, phone_number, temp_pass_from_user):
        return self.login_password_cache.get(phone_number) == temp_pass_from_user

    def get_user_key_sms_login(self, phone_number, temp_pass_from_user):
        if self.verify_sms_temp_password(phone_number, temp_pass_from_user):
            self.logger.print_event('userService | verify sms code for phone number: ' + str(phone_number))
            return self.user_repository.get_users_by_generic_value(server_consts.PHONE_NUMBER, phone_number)[0]

        self.logger.print_event('userService | mismatch sms code for phone number: ' + str(phone_number))
        return server_consts.SMS_CODE_WRONG

    def check_the_validity_of_a_password(self, password):
        flag = 0
        comment = ''
        while True:
            if (len(password) < 8):
                flag = -1
                comment = server_consts.STRING_MUST_INCLUDE_EIGHT_CHARS
                break
            elif not re.search("[a-z]", password):
                flag = -1
                comment = server_consts.STRING_MUST_INCLUDE_LOWER_CASE
                break
            elif not re.search("[A-Z]", password):
                flag = -1
                comment = server_consts.STRING_MUST_INCLUDE_UPPER_CASE
                break
            elif not re.search("[0-9]", password):
                flag = -1
                comment = server_consts.STRING_MUST_INCLUDE_NUM
                break
            elif not re.search("[_@$!#%^&*~]", password):
                flag = -1
                comment = server_consts.STRING_MUST_INCLUDE_SYMBOL
                break
            elif re.search("\s", password):
                flag = -1
                break
            else:
                self.logger.print_info_message("userService | Valid Password")
                return server_consts.STRING_VALID_PASSWORD

        if flag == -1:
            self.logger.print_info_message("userService | Not a Valid Password" + comment)
            return comment

    def get_hash_string(self, string_to_hash):
        return hashlib.sha256(string_to_hash.encode('utf-8')).hexdigest()

    def add_user_name_and_password(self, user_key, user_name, password):
        if not self.user_repository.is_user_exist(server_consts.USER_KEY, user_key):
            return server_consts.STRING_USER_KEY_NOT_EXIST

        valid_password = self.check_the_validity_of_a_password(password)
        if valid_password != server_consts.STRING_VALID_PASSWORD:
            return valid_password

        user_name_hash = self.get_hash_string(user_name)
        password_hash = self.get_hash_string(password)

        if self.user_repository.user_name_exist(user_name_hash):
            self.logger.print_info_message('userService | That username is taken')
            return server_consts.STRING_USER_NAME_IS_TAKEN

        self.user_repository.update_user_data(user_key, {
            server_consts.USER_NAME: user_name_hash,
            server_consts.PASSWORD: password_hash
        })
        return server_consts.STRING_USER_NAME_AND_PASSWORD_CORRECT

    def change_password(self, user_name, last_password, password):
        user_key = self.user_repository.verify_user_name_password(self.get_hash_string(user_name),
                                                                  self.get_hash_string(last_password))
        if user_key == server_consts.STRING_INVALID_USER_NAME_OR_PASSWORD:
            # the user name or password incorrect
            return server_consts.STRING_INVALID_USER_NAME_OR_PASSWORD

        if not self.check_the_validity_of_a_password(password):
            self.logger.print_info_message('userService | the password is not valid')
            return server_consts.STRING_PASSWORD_IS_NOT_VALID

        self.user_repository.update_user_data(user_key, {
            server_consts.PASSWORD: self.get_hash_string(password)
        })
        self.logger.print_info_message('userService | the password of user: ' + user_key + ' updated')
        return server_consts.STRING_PASSWORD_UPDATED

    def login_user_name_and_password(self, user_name, password):
        # return tuple (boolean, message)
        return self.user_repository. \
            verify_user_name_password(self.get_hash_string(user_name),
                                      self.get_hash_string(password))

    def delete_user(self, user_key):
        return self.user_repository.delete_user(user_key)
