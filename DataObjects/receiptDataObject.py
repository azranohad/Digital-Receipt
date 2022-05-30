from enum import Enum 


class receiptData():
    def __init__(self):
        self.buyerName = None
        self.buyerID = None
        self.market = None
        self.date_of_receipt = None
        self.address = None
        self.items = []
        self.total_price = None
        self.methodOfPayment = methodsOfPayment
        self.CreditCardID = None
        self.receiptID = None
        self.isDigitalReceipt = None

class itemObject():
    def __init__(self, itemDescription, price, amount=None, itemID=None):
        self.itemID = itemID
        self.itemDescription = itemDescription
        self.amount = amount
        self.price = price

class methodsOfPayment(Enum):
    CASH = 1
    CREDIT_CARD = 2