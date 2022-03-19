from DataObjects.receiptData import receiptData
from Services.parseReceiptDataService import parseReceiptDataService
from Services.preProcessReceiptService import preProcessReceiptService
from Services.scanImageService import scanImageService


class scanReceiptManager():
    def __init__(self, user_details):
        self.receipt_data = receiptData()
        self.pre_processing_image = preProcessReceiptService()
        self.scan_image_service = scanImageService()
        self.parse_receipt_data_service = parseReceiptDataService()
        self.user_details = user_details

    #call from controller
    def action_scan_receipt_manager(self, image):
        process_image = self.pre_processing_image.gussianBlurProcess(image)
        raw_string_receipt = self.scan_image_service.scan_image_to_string(process_image).lower()
        raw_data_receipt = self.scan_image_service.scan_image_to_data(process_image)

        self.parse_data_from_receipt_image(raw_string_receipt, raw_data_receipt)
        #s#elf.receipt_data.itemsList, self.receipt_data.total_price = self.parse_receipt_data_service.parse_items(process_image)
        return self.receipt_data
        #load data receipt to json and send to data base
        #send image to data base
        #return response to controller


    def parse_data_from_receipt_image(self, raw_string_receipt, raw_data_receipt):
        lines = raw_string_receipt.splitlines()
        self.receipt_data.date = self.parse_receipt_data_service.parse_date(raw_string_receipt, lines)
        self.receipt_data.market = self.parse_receipt_data_service.parse_market(lines)
        self.receipt_data.receiptID = self.parse_receipt_data_service.parse_receipt_id(lines)
        self.receipt_data.itemsList, self.receipt_data.total_price = self.parse_receipt_data_service.parse_items(raw_data_receipt,self.receipt_data.market)



