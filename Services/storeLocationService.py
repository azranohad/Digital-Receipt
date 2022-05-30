from singleton_decorator import singleton
from geopy.geocoders import Nominatim
geolocator = Nominatim(user_agent="sample app")
from sklearn.cluster import KMeans

# @singleton
class storeLocationService:

    def get_address_from_coordinates(self, coordinates):
        coordinates_str = str(coordinates[0]) + ', ' + (str(coordinates[1]))
        data_from_coordinates = geolocator.reverse(coordinates_str)
        return data_from_coordinates.address
