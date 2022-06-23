from singleton_decorator import singleton
from geopy.geocoders import Nominatim
from datetime import date

from Server.Repositories.locationRepository import locationRepository
from Server.Repositories.userRepository import userRepository
from SystemFiles.logger.loggerService import loggerService

geolocator = Nominatim(user_agent="sample app")

# @singleton
class storeLocationService:
    def __init__(self):
        self.user_repository = userRepository()
        self.logger = loggerService()
        self.location_repository = locationRepository()

    def get_address_from_coordinates(self, coordinates):
        coordinates_str = str(coordinates[0]) + ', ' + (str(coordinates[1]))
        data_from_coordinates = geolocator.reverse(coordinates_str)
        return data_from_coordinates.address


    #True - possible send recommendation
    def possible_send_recommended(self, user_key):
        today = str(date.today())
        if self.user_repository.get_user_data(user_key).keys().__contains__('last_recommendation_date'):
            last_recommendation_date = self.user_repository.get_user_data(user_key)['last_recommendation_date']
            if last_recommendation_date != today:
                return True
        else:
            self.user_repository.update_user(user_key, {"last_recommendation_date" : today})
            return True

        return False



    # distance units 1 == 100 km
    def find_nearest_store_to_point(self, user_key, str_location):

        location_xy = str_location.split(',')
        location = [float(location_xy[0]), float(location_xy[1])]
        nearest_stores = self.location_repository.find_nearest_store_to_point(location)
        for store in nearest_stores:
            nearest_stores.remove(store)
            nearest_stores.append(store.lower())
        if nearest_stores:
            if self.possible_send_recommended(user_key):
                return self.list_to_dict(nearest_stores)

        return str(False)


    def list_to_dict(self, _list):
        ret_dict = {}
        i = 1
        for l in _list:
            ret_dict[i] = l
            i+=1
        return ret_dict

