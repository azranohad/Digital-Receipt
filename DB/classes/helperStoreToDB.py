
import csv
import string
import random
import uuid
import dateutil
from dateutil.parser import parse
import names

from Server.Repositories.receiptRepository import receiptRepository
from Server.Services.userService import userService


def create_product_dict(row, store_name):

    category = []
    if store_name=='walmart':
        category = row[4].split('|')
    else:
        category = row[4].split('/')
    product_dict = {
        "itemID": row[1],
        "itemDescription": row[0],
        "brand": row[3],
        "category": category,
        "amount": 1,
        "price": float(row[2]),
    }
    return product_dict

def get_user_details(row):
    user_details_dict = {
        "phone_number": '062' + ''.join(random.choice(string.digits) for i in range(7)),
        "age": int(row[8]),
        "gender": row[7],
        "private_name": names.get_first_name(gender=row[7]),
        "family_name": names.get_last_name()
    }
    # user_service.create_user(user_details_dict.get("phone_number"), user_details_dict)
    return user_details_dict

def load_receipt_and_user_to_db(file_name, store_name):
    # file_name.csv
    file = open(file_name, encoding = "ISO-8859-8", errors="ignore")
    csv_reader = csv.reader(file)


    next(csv_reader)

    # 0-product_name	1-product_id	2-price_brand	3-category	4-date	5-user_id	6-gender	7-age	8-store_id	9-frequency
    for row in csv_reader:
        if not users.__contains__(row[6]):
            users[row[6]] = {}
            users.get(row[6])['details'] = get_user_details(row)

        user_map = users.get(row[6])
        if not user_map.__contains__((store_name, row[5])):
            user_map[(store_name, row[5])] = []

        user_map[(store_name, row[5])].append(create_product_dict(row, store_name))

        print(row)
    y = 4

def create_receipt(details, store_name, date, items, total_price):


    receipt_data = {
        "user_key": details.get('user_key'),
        "_id": uuid.uuid4().hex,
        "buyer_name": details.get('private_name') + ' ' + details.get('family_name'),
        "market": store_name,
        "date_of_receipt": date,
        "items": items,
        "name_for_client": items[0].get('itemDescription'),
        "total price": total_price,
        "receiptID": ''.join(random.choice(string.digits) for i in range(13)),
        "is_digital_receipt": True
    }
    return receipt_data

def get_total_price(items):
    total_price = 0

    for item in items:
        total_price += item.get('price')


    return total_price


def insert_list_of_receipts(user_receipts):
    receipt_key = []
    for key in user_receipts.keys():
        if key != 'details':
            receipt_key.append(key)


    for receipt in receipt_key:
        date = dateutil.parser.parse(receipt[1])
        total_price = get_total_price(user_receipts.get(receipt))
        user_details = user_receipts.get('details')
        receipt_repository.insert_receipt(user_details.get('user_key'), create_receipt(user_details, receipt[0], date, user_receipts.get(receipt), total_price))






user_service = userService()
receipt_repository = receiptRepository()
# user_key = "ec2eac3508b24882bc45b09dfeee2ee3"
# x = receipt_repository.get_receipt_by_value(user_key, "market", "super-pharm")
# t = receipt_repository.get_by_date(user_key, "01/03/1995", "29/10/2023")
# markets = receipt_repository.get_values_by_key(user_key, "market")
# y = 3
users = {}
# load_receipt_and_user_to_db("superpharm_receipts.csv", 'super-pharm')
# load_receipt_and_user_to_db("walmart_receipts.csv", 'walmart')
#
# i = 1
# num_of_users = len(users)
# for user in users.values():
#     print('user: ' + str(i)+'/' + str(num_of_users))
#     user_key = user_service.create_user(user.get('details').get("phone_number"), user.get('details'))
#     #insert user_key to user details
#     user.get('details')['user_key'] = user_key[0]
#     insert_list_of_receipts(user)
#     i += 1
#
#
#
# x = 3