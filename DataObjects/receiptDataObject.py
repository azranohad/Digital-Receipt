from enum import Enum 


class receiptData():
    def __init__(self):
        self.buyerID = None
        self.market = None
        self.date = None
        self.address = None
        self.itemsList = []
        self.total_price = None
        self.methodOfPayment = methodsOfPayment
        self.CreditCardID = None
        self.receiptID = None

class itemObject():
    def __init__(self, itemDescription, price, amount=None, itemID=None):
        self.date_buy = None
        self.itemID = itemID
        self.itemDescription = itemDescription
        self.amount = amount
        self.price = price

class methodsOfPayment(Enum):
    CASH = 1
    CREDIT_CARD = 2