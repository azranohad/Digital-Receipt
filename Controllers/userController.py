from flask import Blueprint, request
from Services.userService import userService
from systemFiles.logger.loggerService import loggerService as logger

# logger = loggerService()
users_api = Blueprint('users_api', __name__)

user_service = userService()


@users_api.route('/create_user', methods=['POST'])
def create_user():
    try:
        phone_number = request.form['phone_number']
    except:
        logger.print_api_message("request for create user must contain phone_number field")
        return "request for create user must contain phone_number field"
    logger.print_api_message("received create_user post request | user: " + phone_number)
    user_key = user_service.create_user(phone_number)
    #user_key[0] --> key
    user_service.update_user(user_key[0], request.form)
    #user_key[0] --> message = the user is exist or update
    return user_key[1]


@users_api.route('/update_user', methods=['POST'])
def update_user_data():
    user_key = request.form['user_key']
    user_service.update_user(user_key, request.form)


# unique identifier phone_number/mail_address/ID
@users_api.route('/get_user_key', methods=['GET'])
def get_user_key():
    return user_service.get_user_from_db(request.form)
