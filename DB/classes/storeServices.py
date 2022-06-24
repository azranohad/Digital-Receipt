import csv
import os
import re

from Server.Repositories.stroeRepository import storeRepository
from SystemFiles.logger.loggerService import loggerService


class storeService:
    def __init__(self):
        self.store_repository = storeRepository()
        self.logger = loggerService()

    def create_item(self, name, item_id, brand, price, category, store_name):
        return {
            "itemID": item_id,
            "itemDescription": name,
            'brand': brand,
            'price': float(price),
            'category': split_category_by_store(category, store_name),
            'market': store_name
        }




def split_category_by_store(category, store_name):
    if store_name == 'walmart':
        category_list = category.split('|')
    else:
        category_list = category.split('/')

    return category_list

def insert_items_from_csv(file_name, store_name):


    # file = open(file_name, encoding = "ISO-8859-8", errors="ignore")
    file = open(file_name, encoding = "UTF- 8", errors="ignore")
    csv_reader = csv.reader(file)
    init_header_dict(next(csv_reader))


    i = 0
    for row in csv_reader:
        temp_item = store_service.create_item(row[0], row[1], row[3], row[2], row[4], store_name)
        if row[5] == "":
            temp_item['url_image'] = row[5]
        store_service.store_repository.insert_item_to_db(temp_item)
        print(str(i) + ' - ' + str(row))
        i += 1
    y = 4


def init_header_dict(header):
    columns = ['name', 'id', 'brand', 'price', 'category']
    i = 0
    for col in header:
        for col_name in columns:
            if col_name is col:
                header_dict[col_name] = i
        i += 1

header_dict = {}
store_service = storeService()
# project_folder = re.split(r'.(?=Digital-Receipt)', os.getcwd())[0]
# base_path = os.path.join(project_folder, 'Digital-Receipt', 'DB', 'Items')
# superpharm_path = os.path.join(base_path, 'superpharm1.csv')
# insert_items_from_csv(superpharm_path, 'super-pharm')
# walmart_path = os.path.join(base_path, 'walmart.csv')
insert_items_from_csv("C:\\Users\\azran\\PycharmProjects\\Digital-Receipt\\DB\\Items\\walmart.csv", 'walmart')
# insert_items_from_csv('C:\\Users\\azran\\PycharmProjects\\Digital-Receipt\\DB\\Items\\superpharm1.csv', 'super-pharm')