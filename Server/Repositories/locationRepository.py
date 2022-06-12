from Server.Services.storeLocationService import storeLocationService
import geopy.distance
from singleton_decorator import singleton
from pymongo import GEO2D
from Server.Repositories.mongoDbRepository import mongoDbRepository
from SystemFiles.logger.loggerService import loggerService


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


@singleton
class locationRepository:
    def __init__(self):
        self.mongo_db_repository = mongoDbRepository()
        self.db_stores = self.mongo_db_repository.get_client()['stores']
        self.store_location_service = storeLocationService()
        self.logger = loggerService()

    # store is array [name/company, coordinates]
    def add_new_store_to_db(self, store):

        if not self.mongo_db_repository.is_collection_exist('stores', store[0]):
            self.db_stores[store[0]].create_index([("loc", GEO2D)])
        self.db_stores[store[0]].insert_one({
            "address": self.store_location_service.get_address_from_coordinates(store[1]),
            "loc": store[1]
        })

    def add_list_of_stores_to_db(self, stores):
        for store in stores:
            self.add_new_store_to_db(store)

    # distance units 1 == 100 km
    def find_nearest_store_to_point(self, point, distance=0.01):
        nearest_stores = []
        for coll in self.db_stores.collection_names():
            for doc in self.db_stores[coll].find(
                    {"loc": {"$near": point, "$maxDistance": distance}}):
                str_info_find = coll + ': ' + doc['address'] + '| distance: ' + str(
                    geopy.distance.distance(point, doc['loc']).km) + ' km'
                self.logger.print_info_message(str_info_find)
                nearest_stores.append(coll)
                break
        str_info = 'nearest stores from location: ' + str(point) + ' stores: ' + str(nearest_stores)
        self.logger.print_info_message(str_info)
        return self.list_to_dict(nearest_stores)

    def list_to_dict(self, _list):
        ret_dict = {}
        i = 1
        for l in _list:
            ret_dict[i] = l
            i+=1
        return ret_dict

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
# store_repo = locationRepository()
# # store_location = get_location_stores_from_csv('stores_location.csv')
# # store_repo.add_list_of_stores_to_db(store_location)
#
# # to test
# store_repo.find_nearest_store_to_point([31.894, 34.808], 0.02)
