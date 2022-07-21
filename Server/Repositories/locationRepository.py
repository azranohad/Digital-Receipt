from Server.Repositories.stroeRepository import storeRepository
import geopy.distance
from singleton_decorator import singleton
from pymongo import GEO2D
from Server.Repositories.mongoDbRepository import mongoDbRepository
from SystemFiles.logger.loggerService import loggerService
from Server.serverConsts import serverConsts
from geopy.geocoders import Nominatim


server_consts = serverConsts()
geolocator = Nominatim(user_agent="sample app")

def get_location_stores_from_csv(file_path):
    file = open(file_path)
    import csv
    csvreader = csv.reader(file)
    stores = []
    for row in csvreader:
        location_split = row[1].split(',')
        location = [float(location_split[0]), float(location_split[1])]
        stores.append([row[0], location])
    return stores


# @singleton
class locationRepository:
    def __init__(self):
        self.mongoDb_repository = mongoDbRepository()
        self.db_stores = self.mongoDb_repository.get_client()[server_consts.STORES_DB]
        self.logger = loggerService()
        self.store_repository = storeRepository()
        self.DISTANCE = 0.01



    def get_address_from_coordinates(self, coordinates):
        coordinates_str = str(coordinates[0]) + ', ' + (str(coordinates[1]))
        data_from_coordinates = geolocator.reverse(coordinates_str)
        return data_from_coordinates.address

    # store is array [name/company, coordinates]
    def add_new_store_to_db(self, store):

        if not self.mongoDb_repository.is_collection_exist(server_consts.STORES_DB, store[0]):
            self.db_stores[store[0]].create_index([(server_consts.LOCATION, GEO2D)])
        self.db_stores[store[0]].insert_one({
            server_consts.ADDRESS: self.get_address_from_coordinates(store[1]),
            server_consts.LOCATION: store[1]
        })

    def add_list_of_stores_to_db(self, stores):
        for store in stores:
            self.add_new_store_to_db(store)

    # distance units 1 == 100 km
    def find_nearest_store_to_point(self, point):
        nearest_stores = []
        for coll in self.db_stores.collection_names():
            for doc in self.db_stores[coll].find(
                    {server_consts.LOCATION: {"$near": point, "$maxDistance": self.DISTANCE}}):
                str_info_find = coll + ': ' + doc[server_consts.ADDRESS] + '| distance: ' + str(
                    geopy.distance.distance(point, doc[server_consts.LOCATION]).km) + ' km'
                self.logger.print_info_message(str_info_find)
                nearest_stores.append(coll)
                break
        str_info = 'nearest stores from location: ' + str(point) + ' stores: ' + str(nearest_stores)
        self.logger.print_info_message(str_info)
        return nearest_stores


    def get_location_stores_from_csv(self, file_path):
        file = open(file_path)
        import csv
        csvreader = csv.reader(file)
        stores = []
        for row in csvreader:
            location_split = row[1].split(',')
            location = [float(location_split[0]), float(location_split[1])]
            stores.append([row[0], location])
        return stores
# store_repo = locationRepository()
# # store_location = get_location_stores_from_csv('stores_location.csv')
# # store_repo.add_list_of_stores_to_db(store_location)
#
# # to test
# store_repo.find_nearest_store_to_point([31.894, 34.808], 0.02)
