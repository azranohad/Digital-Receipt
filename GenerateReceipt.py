
import csv
import random
from faker import Faker
import datetime as f
from datetime import datetime

class person:

    def __init__(self, userID, gender, ageMin, ageMax):

        self.receipts = []
        self.user_id = userID
        self.gender = gender
        self.age = random.randint(ageMin, ageMax)


    def generateReceipts(self, likedCategoriesHighFreq, likedCategoriesLowFreq, store_id, path):
        #receipts = []
        fake = Faker()
        start_date = f.date(year=2020, month=1, day=1)
        if "superpharm" in path:
            file = open(path)
        else:
            file = open(path, encoding="utf8")

        csvreader = csv.DictReader(file)
        rows = []
        for row in csvreader:
            dictionary_copy = row.copy()
            rows.append(dictionary_copy)
        curr_dt = datetime.now()
        timestamp = int(round(curr_dt.timestamp()))
        random.Random(timestamp).shuffle(rows)
        receipt = []
        flag = 0
        for i in range(5):
            fake_date = fake.date_between(start_date=start_date, end_date='now')
            for j in range(random.randrange(3, 7)):
                random.Random().shuffle(rows)
                for row in rows:
                    if flag == 1:
                        flag = 0
                        break
                    for category in likedCategoriesHighFreq:
                        if category in row["category"]:
                            row_copy = row.copy()
                            row_copy["Date"] = fake_date
                            row_copy["UserID"] = self.user_id
                            row_copy["gender"] = self.gender
                            row_copy["age"] = self.age
                            row_copy["store_id"] = store_id
                            row_copy["frequency"] = random.randint(1, 10)
                            receipt.append(row_copy)
                            flag = 1
                            break
            if i == 2:
                for row in rows:
                    if flag == 1:
                        flag = 0
                        break
                    for category in likedCategoriesLowFreq:
                        if category in row["category"]:
                            row_copy = row.copy()
                            row_copy["Date"] = fake_date
                            row_copy["UserID"] = self.user_id
                            row_copy["gender"] = self.gender
                            row_copy["age"] = self.age
                            row_copy["store_id"] = store_id
                            row_copy["frequency"] = random.randint(1, 10)
                            receipt.append(row_copy)
                            flag = 1
                            break
            self.receipts.append(receipt)
            receipt = []
            random.shuffle(rows)
        # type(file)
        # csvDcit = {}
        # header = []
        # header = next(csvreader)
        #
        # for row in csvreader:
        #     rows.append(row)
        file.close()
        retReceipts = self.receipts
        self.receipts = []
        return retReceipts


person_characters_dict = {}
person_characters_dict["Mom"] = ["female",30,45]
person_characters_dict["YoungSingelMan"] = ["male",23,33]
person_characters_dict["YoungSingelWoman"] = ["female",20,30]
person_characters_dict["MarriedMan"] = [ "male",27,40]
person_characters_dict["FatherTeenKids"] = ["male",35,45]
person_characters_dict["Grandmother"] = [ "female",60,80]
person_characters_dict["Woman"] = ["female",21,55]
person_characters_dict["HygienicWoman"] = ["female",20,60]
person_characters_dict["ManWithDog"] = ["male",20,40]
person_characters_dict["HealthyMan"] = ["male",20,50]
person_characters_dict["MomToBaby"] = ["female",25,40]
person_characters_dict["shoeLover"] = ["female",60,80]
person_characters_dict["nerdMan"] = ["male",20,30]
person_characters_dict["sportPlayer"] = ["male",20,30]
person_characters_dict["houseKepper"] = ["female",35,50]
person_characters_dict["foodLover"] = ["female",25,45]
person_characters_dict["WomanWithCat"] = ["female",25,60]
person_characters_dict["BodyBuilder"] = ["male",25,45]
person_characters_dict["HealthyWoman"] = ["female",20,50]
person_characters_dict["Dad"] = ["male",30,45]


superpharm_characters_dict = {}
superpharm_characters_dict["Mom"] = [["אופנה/אופנת נשים","אופנה/ילדים","טיפוח/טיפוח ילדים","יצירה ותחביבים/יצירה לילדים","יצירה ותחביבים/ספרים וחוברות/חוברות פעילות לילדים","יצירה ותחביבים/ספרים וחוברות/ספרי ילדים"],["לבית/ריהוט/רהיטי ילדים/כסאות ושולחנות ילדים"]]
superpharm_characters_dict["YoungSingelMan"] = [["טיפוח/גילוח והסרת שיער/גברים","אופנה/אופנת גברים/ביגוד ספורט לגברים","אופנה/אופנת גברים","אופנה/אופנת גברים/הלבשה תחתונה לגברים"],["אופטיקה/משקפי שמש","ספורט וחוץ"]]
superpharm_characters_dict["YoungSingelWoman"] = [["קוסמטיקה","אופנה/אופנת נשים"],["אופטיקה/משקפי שמש","ספורט וחוץ"]]
superpharm_characters_dict["MarriedMan"] = [["בריאות/תוספי תזונה/דיאטה","אופנה/אופנת גברים","בריאות/תוספי תזונה/בריאות הגבר/פורמולות לגברים"],["אופטיקה/משקפי שמש","קוסמטיקה/בשמים/בשמים לגברים"," קוסמטיקה/בשמים/בשמי בוטיק גברים"]]
superpharm_characters_dict["FatherTeenKids"] = [["בריאות/תוספי תזונה/דיאטה","אופנה/אופנת גברים","בריאות/תוספי תזונה/בריאות הגבר/פורמולות לגברים"],["אופטיקה/משקפי שמש","קוסמטיקה/בשמים/בשמים לגברים"," קוסמטיקה/בשמים/בשמי בוטיק גברים"]]
superpharm_characters_dict["Grandmother"] = [["טיפוח/אמבט וניקוי גוף","קוסמטיקה/טיפוח מותגי קוסמטיקה","קוסמטיקה/ערכות איפור"],["יצירה ותחביבים"]]
superpharm_characters_dict["Woman"] = [["טיפוח/אמבט וניקוי גוף","טיפוח/דרמוקוסמטיקה","קוסמטיקה/ערכות איפור","קוסמטיקה/טיפוח מותגי קוסמטיקה","קוסמטיקה/איפור עיניים","קוסמטיקה/טיפוח ציפורניים"],["קוסמטיקה/בשמים/בשמים לנשים"]]
superpharm_characters_dict["HygienicWoman"] = [["טיפוח/אמבט וניקוי גוף","טיפוח/דרמוקוסמטיקה","טיפוח/היגיינת הפה","טיפוח/טיפוח גוף","טיפוח/טיפוח עיניים","טיפוח/טיפוח פנים"],[]]
superpharm_characters_dict["ManWithDog"] = [[" בריאות/תוספי תזונה/בריאות הגבר/פורמולות לגברים","חשמל ואלקטרוניקה/טלפונים סלולרים ואביזרים","טיפוח/היגיינת הפה","בעלי חיים/כלבים"],["אופטיקה/משקפי שמש",""]]
superpharm_characters_dict["HealthyMan"] = [[" בריאות/תוספי תזונה/בריאות הגבר/פורמולות לגברים","בריאות/תוספי תזונה/ויטמינים","טיפוח/היגיינת הפה","בריאות/אביזרי אורטופדיה","בריאות/רפואה טבעית"],["אופטיקה/משקפי שמש",""], "male"]
superpharm_characters_dict["MomToBaby"] = [["תינוקות ופעוטות/אוכל לתינוקות ומוצרי הנקה והאכלה"," תינוקות ופעוטות/החתלה/חיתולים 3-6"," תינוקות ופעוטות/הלבשה לתינוקות","תינוקות ופעוטות/טיפוח לתינוקות","תינוקות ופעוטות/החתלה/ארגוניות לחיתולים","תינוקות ופעוטות/מוצצים ונשכנים"],[" תינוקות ופעוטות/החתלה/משטחי החתלה וכיסויים"]]
superpharm_characters_dict["shoeLover"] = [["אופנה/אופנת נשים/נעלי נשים","טיפוח/טיפוח גוף","קוסמטיקה/טיפוח מותגי קוסמטיקה"],[]]
superpharm_characters_dict["nerdMan"] = [["אופנה/אופנת גברים","טיפוח/היגיינת הפה","אופנה/אופנת גברים/הלבשה תחתונה לגברים","בריאות/אביזרי אורטופדיה"],["אופטיקה/משקפי שמש"]]
superpharm_characters_dict["sportPlayer"] = [["בריאות/תוספי תזונה/דיאטה","אופנה/אופנת גברים/ביגוד ספורט לגברים","בריאות/תוספי תזונה/ויטמינים"],["ספורט וחוץ/מכשירי כושר ומשקולות","ספורט וחוץ/משחקי ספורט ופנאי/כדורסל/כדורי כדורסל","ספורט וחוץ/משחקי ספורט ופנאי/כדורגל"]]
superpharm_characters_dict["houseKepper"] = [["לבית","אופנה/אופנת נשים"],[]]
superpharm_characters_dict["foodLover"] = [["מזון ומשקאות"],[]]
superpharm_characters_dict["WomanWithCat"] = [["בעלי חיים/חתולים","טיפוח/אמבט וניקוי גוף","טיפוח/דרמוקוסמטיקה","קוסמטיקה/ערכות איפור","קוסמטיקה/טיפוח מותגי קוסמטיקה"],["בעלי חיים/אביזרי האכלה ושתייה/קערות אוכל ושתייה","בעלי חיים/בריאות/אמצעים נגד פרעושים וקרציות לבעלי חיים"]]
superpharm_characters_dict["BodyBuilder"] = [["מזון ומשקאות/מזון בריאות/חטיפי חלבון","בריאות/תוספי תזונה/תזונת ספורט/אבקות חלבון","בריאות/תוספי תזונה/דיאטה","אופנה/אופנת גברים/ביגוד ספורט לגברים","בריאות/תוספי תזונה/ויטמינים"],["ספורט וחוץ/מכשירי כושר ומשקולות"]]
superpharm_characters_dict["HealthyWoman"] = [["בריאות/תוספי תזונה/ויטמינים","טיפוח/היגיינת הפה","בריאות/רפואה טבעית","בריאות/רפואה טבעית/שמני גוף ושמנים ארומטיים","בריאות/תוספי תזונה/דיאטה","מזון ומשקאות/מזון בריאות","בריאות/תוספי תזונה/צמחי מרפא"],[]]
superpharm_characters_dict["Dad"] = [["אופנה/אופנת גברים","צעצועים ומשחקים","מזון ומשקאות/מזון בריאות/חטיפי דגנים מארזים לילדים"],["לבית/ריהוט/רהיטי ילדים/כסאות ושולחנות ילדים"]]


walmart_characters_dict = {}
walmart_characters_dict["Mom"] = [["Clothing|Women","Beauty","Toys"],["Video Games"]]
walmart_characters_dict["YoungSingelMan"] = [["Clothing|Men"],["Cell Phones|Cellphone Accessories"]]
walmart_characters_dict["YoungSingelWoman"] = [["Clothing|Women","Beauty|Makeup"],["Health|Home Health Care|Daily Living Aids","Jewelry|Jewelry Boxes & Organizers|Jewelry Boxes & Organizers"]]
walmart_characters_dict["MarriedMan"] = [["Clothing|Men","Office|Desk & Workspace Organizers","Clothing|Men|Mens Sweatshirts & Hoodies|Mens Sweatshirts & Hoodies"],["Home|Decor","Home Improvement"]]
walmart_characters_dict["FatherTeenKids"] = [["Clothing|Kids Clothing","Clothing|Men"],["Arts, Crafts & Sewing|Art Supplies|Painting|Paints|Airbrush Paints","Home Improvement","Video Games|Video Game Accessories|Accessories for Nintendo, PC, Xbox and PlayStation Systems"]]
walmart_characters_dict["Grandmother"] = [["Beauty|Skin Care","Clothing|Women","Toys"],["Home|Decor","Home Improvement"]]
walmart_characters_dict["Woman"] = [["Clothing|Women","Beauty|Makeup","Health|Superfoods & Cleanses|Superfoods|Acai","Health|Superfoods & Cleanses|Superfoods"],["Home|Decor","Home Improvement"]]
walmart_characters_dict["HygienicWoman"] = [["Beauty|Makeup|Lips","Beauty|Makeup|Nails","Beauty|Makeup|Tools & Accessories","Beauty|Skin Care","Beauty|Hair Care"],[]]
walmart_characters_dict["ManWithDog"] = [["Clothing|Men","Pets|Dogs"],["Electronics|Computers|Computer Accessories|Laptop Bags, Cases & Sleeves"]]
walmart_characters_dict["HealthyMan"] = [["Health|Vitamins & Supplements|Herbal Supplements|All Herbal Supplements","Health|Vitamins & Supplements|Homeopathic Remedies|All Homeopathic Remedies","Clothing|Men","Health|Superfoods & Cleanses|Superfoods|Acai","Health|Superfoods & Cleanses|Superfoods"],["Electronics|Computers|Computer Accessories|Laptop Bags, Cases & Sleeves"]]
walmart_characters_dict["MomToBaby"] = [["Baby"],[]]
walmart_characters_dict["shoeLover"] = [["Clothing|Shoes|Womens Shoes|All Womens Shoes","Clothing|Women"],["Clothing|Shoes|Womens Shoes|Womens Casual Shoes"]]
walmart_characters_dict["nerdMan"] = [["Electronics|Computers|Computer Accessories|Laptop Bags, Cases & Sleeves","Electronics|Computers|Computer Accessories|Computer Cables & Connectors","Clothing|Men"],["Video Games|Video Game Accessories|Accessories for Nintendo, PC, Xbox and PlayStation Systems"]]
walmart_characters_dict["sportPlayer"] = [["Sports & Outdoors","Clothing|Men"],[]]
walmart_characters_dict["houseKepper"] = [["Home|","Clothing|Women"],[]]
walmart_characters_dict["foodLover"] = [["Food|"],[]]
walmart_characters_dict["WomanWithCat"] = [["Pets|Cats","Beauty|Makeup"],[]]
walmart_characters_dict["BodyBuilder"] = [["Sports & Outdoors","Clothing|Men","Health|Vitamins & Supplements","Health|Protein & Fitness|Ancient Nutrition"],["Health|Protein & Fitness|Ancient Nutrition"]]
walmart_characters_dict["HealthyWoman"] = [["Clothing|Women","Beauty|Skin Care","Health|Vitamins & Supplements"],[]]
walmart_characters_dict["Dad"] = [["Office|","Clothing|Men","Toys"], ["Video Games"]]


superpharm_receipts_list = []
walmart_receipts_list = []

j = 0
for i in range(50):
    for characterKey in person_characters_dict.keys():

        characters = person_characters_dict[characterKey]
        p = person(j,characters[0],int(characters[1]),int(characters[2]))
        superpharm_character = superpharm_characters_dict[characterKey]
        walmart_character = walmart_characters_dict[characterKey]
        superpharm_receipts_list.extend(p.generateReceipts(superpharm_character[0], superpharm_character[1], 1,'C:\\Users\\amiti\\superpharmcsv.csv'))
        walmart_receipts_list.extend(p.generateReceipts(walmart_character[0], walmart_character[1], 2,'C:\\Users\\amiti\\walmart.csv'))
        #receipts_list.extend(person(j,character[2],character[3]).generateReceipts(character[0],character[1],1))

        j = j + 1
#person1 = person(1, "male", 50)
#receipts = person1.generateReceipts(["אופנה/אופנת גברים"],["אופטיקה/משקפי שמש"])
superpharm_file = open('C:\\Users\\amiti\\superpharm_receipts.csv', 'w', newline='')
walmart_file = open('C:\\Users\\amiti\\walmart_receipts.csv', 'w',encoding="utf8", newline='')

# create the csv writer
pharm_writer = csv.writer(superpharm_file)

for receipt in superpharm_receipts_list:
    for row in receipt:
        pharm_writer.writerow(row.values())

superpharm_file.close()

walmart_writer = csv.writer(walmart_file)

for receipt in walmart_receipts_list:
    for row in receipt:
        walmart_writer.writerow(row.values())

walmart_file.close()