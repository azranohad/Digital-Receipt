from enum import Enum
from scipy.spatial.distance import hamming


class ReceiptData():
    def __init__(self):
        self.buyerID = None
        self.company = None
        self.date = None
        self.address = None
        self.itemsList = []
        self.total_price = None
        self.methodOfPayment = methodsOfPayment
        self.CreditCardID = None
        self.receiptID = None

    def create_receipt_data_from_text(text):
        lines = text.splitlines()
        a = 'ohadddddddd'
        b = 'ohadddd'
        result = hamming(a, b) * len(a)
        x = 3


class itemObject():
    def __init__(self, itemID, itemDescription, amount, price):
        self.itemID = itemID
        self.itemDescription = itemDescription
        self.amount = amount
        self.price = price

class methodsOfPayment(Enum):
    CASH = 1
    CREDIT_CARD = 2
