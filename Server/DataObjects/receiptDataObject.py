
class receiptData():
    def __init__(self):
        self.buyerName = None
        self.user_key = None
        self.market = None
        self.date_of_receipt = None
        self.address = None
        self.items = []
        self.total_price = None
        self.CreditCardID = None
        self.receiptID = None
        self.url_scan_image = None
        self.isDigitalReceipt = None

class creditData:
    def __init__(self):
        self.buyerName = None
        self.user_key = None
        self.market = None
        self.date_of_credit = None
        self.expiration_date = None
        self.total_price = None
        self.url_scan_image = None
        self.creditID = None
        self.isDigitalCredit = None


class itemObject:
    def __init__(self, itemDescription, price, amount=None, itemID=None):
        self.itemID = itemID
        self.itemDescription = itemDescription
        self.amount = amount
        self.price = price
