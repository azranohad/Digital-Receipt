from flask import request, Blueprint

from Server.Services.recommendationSystemService import recommendationSystemService
from Server.serverConsts import serverConsts
from systemFiles.logger.loggerService import loggerService

recommendation_system_api = Blueprint('recommendation_system_api', __name__)

logger = loggerService()
recommendation_system_service = recommendationSystemService()
server_consts = serverConsts()


#   /recommendation_system_controller

# return dict of items from favorite stores
@recommendation_system_api.route('/get_general_recommendation', methods=['GET'])
def get_general_recommendation():
    user_key = request.headers[server_consts.USER_KEY]
    logger.print_api_message("recommendationSystemController | received get_general_recommendation GET request | user: " + user_key)
    response = recommendation_system_service.get_general_recommendation(user_key)
    return response


# return dict of items from store
@recommendation_system_api.route('/get_recommendation_for_store', methods=['GET'])
def get_recommendation_for_store():
    user_key = request.headers[server_consts.USER_KEY]
    store_name = request.headers[server_consts.STORE_NAME]
    logger.print_api_message("recommendationSystemController | received get_store_recommendations GET request | user: " + user_key)

    response = recommendation_system_service.get_store_recommendations(user_key, store_name)
    return response


@recommendation_system_api.route('/get_recommendation_for_store_phone_number', methods=['GET'])
def get_recommendation_for_store_phone_number():
    phone_number = request.headers[server_consts.PHONE_NUMBER]
    store_name = request.headers[server_consts.STORE_NAME]
    logger.print_api_message("recommendationSystemController | received get_recommendation_for_store_phone_number GET request | phone_number: " + phone_number)

    response = recommendation_system_service.get_store_recommendations_by_phone_number(phone_number, store_name)
    return response


