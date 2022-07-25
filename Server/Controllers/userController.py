from flask import Blueprint, request

from Server.Repositories.userRepository import userRepository
from Server.Services.userService import userService
from Server.serverConsts import serverConsts
from systemFiles.logger.loggerService import loggerService

logger = loggerService()
users_api = Blueprint('users_api', __name__)

user_service = userService()
user_repository = userRepository()
server_consts = serverConsts()


@users_api.route('/create_user', methods=['POST'])
def create_user():
    try:
        phone_number = request.get_json(force=True)[server_consts.PHONE_NUMBER]
    except:
        logger.print_api_message("request for create user must contain phone_number field")
        return server_consts.STRING_CREATE_USER_MUST_CONTAIN_PHONE_NUMBER
    logger.print_api_message("received create_user post request | user: " + phone_number)
    user_key = user_service.create_user(phone_number, request.get_json(force=True))

    return user_key


@users_api.route('/update_user', methods=['POST'])
def update_user_data():
    user_key = request.get_json(force=True)[server_consts.USER_KEY]
    return user_repository.update_user(user_key, request.get_json(force=True))


# unique identifier phone_number/mail_address/ID
@users_api.route('/get_user_key', methods=['GET'])
def get_user_key():
    return user_repository.get_user_from_db(request.get_json(force=True))


@users_api.route('/get_user_data', methods=['GET','POST'])
def get_user_data():
    user_key = request.headers[server_consts.USER_KEY]
    return user_repository.get_user_data(user_key)

@users_api.route('/send_smsCode_to_verify', methods=['GET','POST'])
def send_smsCode_to_verify():
    phone_number = request.get_json(force=True)[server_consts.PHONE_NUMBER]
    return user_service.log_in_phone_number(phone_number)

@users_api.route('/verify_sms_code', methods=['GET','POST'])
def verify_sms_code():
    phone_number = request.get_json(force=True)[server_consts.PHONE_NUMBER]
    temp_password = request.get_json(force=True)[server_consts.TEMP_PASSWORD]
    return user_service.get_user_key_sms_login(phone_number, temp_password)


@users_api.route('/add_user_name_and_password', methods=['POST'])
def add_user_name_and_password():
    user_key = request.get_json(force=True)[server_consts.USER_KEY]
    user_name = request.get_json(force=True)[server_consts.USER_NAME]
    password = request.get_json(force=True)[server_consts.PASSWORD]
    request.get_json(force=True)
    return user_service.add_user_name_and_password(user_key, user_name, password)


@users_api.route('/change_password', methods=['PATCH'])
def change_password():
    user_name = request.get_json(force=True)[server_consts.USER_NAME]
    last_password = request.get_json(force=True)[server_consts.LAST_PASSWORD]
    password = request.get_json(force=True)[server_consts.PASSWORD]

    return user_service.change_password(user_name, last_password, password)


@users_api.route('/login_user_name_and_password', methods=['GET','POST'])
def login_user_name_and_password():
    user_name = request.get_json(force=True)[server_consts.USER_NAME]
    password = request.get_json(force=True)[server_consts.PASSWORD]
    return user_service.login_user_name_and_password(user_name, password)


@users_api.route('/delete_user', methods=['DELETE'])
def delete_user():
    user_key = request.get_json(force=True)[server_consts.USER_KEY]
    return user_service.delete_user(user_key)
