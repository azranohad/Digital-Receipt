from flask import request, Blueprint
from Server.Repositories.locationRepository import locationRepository

#'/location_controller'

from Server.Services.storeLocationService import storeLocationService
from SystemFiles.logger.loggerService import loggerService

location_api = Blueprint('location_api', __name__)
logger = loggerService()
location_repository = locationRepository()
store_location_service = storeLocationService()

@location_api.route('/get_nearest_store', methods=['GET'])
def get_nearest_store():
    str_location = request.get_json(force=True)['location']
    user_key = request.get_json(force=True)['user_key']
    logger.print_api_message("received get_nearest_store post request | location: " + str_location)

    return store_location_service.find_nearest_store_to_point(user_key, str_location)

@location_api.route('/get_store_credit_nearest_to_location', methods=['GET'])
def get_store_credit_nearest_to_location():
    str_location = request.get_json(force=True)['location']
    user_key = request.get_json(force=True)['user_key']
    logger.print_api_message("received get_nearest_store post request | location: " + str_location)

    return store_location_service.find_nearest_store_to_point(user_key, str_location)
