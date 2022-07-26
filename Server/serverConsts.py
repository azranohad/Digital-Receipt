

class serverConsts:

    #User
    USER_KEY = 'user_key'
    PHONE_NUMBER = 'phone_number'
    PASSWORD = 'password'
    USER_NAME = 'user_name'
    LAST_PASSWORD = 'last_password'
    TEMP_PASSWORD = 'temp_password'
    AGE = 'age'
    GENDER = 'gender'
    LAST_RECOMMENDATION_DATE = 'last_recommendation_date'
    ID = 'ID'
    MAIL_ADDRESS = 'mail_address'


    #Geolocation
    GOE_LOCATOR_AGENT = "sample app"

    #MongoDB
    UPDATED_EXISTING = 'updatedExisting'

    #Credits AND Receipts
    RECEIPT_DATA = 'receipt_data'
    RECEIPT_ID = 'receipt_id'
    IS_DIGITAL_RECEIPT = 'is_digital_receipt'
    DATE_OF_RECEIPT = 'date_of_receipt'
    IMAGE = 'image'
    IMAGE_ID = 'image_id'
    IMAGE_NAME = 'image_name'
    MARKET = 'market'
    _ID = '_id'
    JPG = '.jpg'
    EXPIRATION_DATE = "expiration_date"
    NAME_FOR_CLIENT = "name_for_client"
    FROM_DATE = "from_date"
    TO_DATE = "to_date"
    CREDIT_ID = "creditID"
    CREDIT_DATA = "credit_data"
    IS_DIGITAL_CREDIT = "isDigitalCredit"
    NAME_SEARCH = "name_search"
    SCAN_DATE = "scan_date"
    DATE_OF_CREDIT = "date_of_credit"
    TOTAL_PRICE = "total_price"
    ITEMS = "items"
    URL_SCAN_IMAGE = "url_scan_image"

    #Stores
    STORE_NAME = 'store_name'
    ITEM_ID = 'itemID'

    #Location
    LATITUDE = 'latitude'
    LONGTITUDE = 'longitude'
    ADDRESS = "address"
    LOCATION = "loc"

    #Database AND Collection Names
    CREDITS_DB = 'Credits'
    CREDITS_COLLECTION = 'credits'
    RECEIPTS_DB = 'Receipts'
    RECEIPTS_COLLECTION = 'receipts'
    USERS_DB = 'Users'
    USERS_COLLECTION = 'users'
    STORES_DB = 'stores'
    LOCATIONS_DB = 'Locations'
    ITEMS_DB = 'Items'
    ITEMS_COLLECTION = 'items'

    #General
    FOLDER_PROJECT_NAME = "Digital-Receipt"


    #Strings return values:
    STRING_USER_EXIST = "the user is not exist"
    STRING_USER_DELETED = "user deleted from data base"
    STRING_INVALID_USER_NAME_OR_PASSWORD = 'the user name or password incorrect'
    SMS_CODE_WRONG = 'The code is wrong'
    STRING_MUST_INCLUDE_EIGHT_CHARS = 'the password must include 8 chars or more'
    STRING_MUST_INCLUDE_LOWER_CASE = 'the password must include Lowercase Characters'
    STRING_MUST_INCLUDE_UPPER_CASE = 'the password must include Uppercase Characters'
    STRING_MUST_INCLUDE_NUM = 'the password must include Numbers'
    STRING_MUST_INCLUDE_SYMBOL = 'the password must include Symbol'
    STRING_VALID_PASSWORD = 'Valid Password'
    STRING_USER_KEY_NOT_EXIST = 'user key is not exist'
    STRING_USER_NAME_IS_TAKEN = 'That username is taken. Try another'
    STRING_USER_NAME_AND_PASSWORD_CORRECT = 'created user name and password success'
    STRING_PASSWORD_IS_NOT_VALID = 'the password is not valid'
    STRING_PASSWORD_UPDATED = 'the password updated'
    STRING_CREATE_USER_MUST_CONTAIN_PHONE_NUMBER = "request for create user must contain phone_number field"

