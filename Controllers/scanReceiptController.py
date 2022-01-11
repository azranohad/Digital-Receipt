from Features.Scan_receipt.scanReceiptManager import scanReceiptManager


class scanReceiptController():

    def scan_receipt(self, image, user_details):
        scan_receipt_manager = scanReceiptManager(user_details)
        response = scan_receipt_manager.action_scan_receipt_manager(image)

        return response