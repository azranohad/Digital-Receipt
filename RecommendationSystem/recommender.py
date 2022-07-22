import pandas as pd
from tqdm import tqdm
from sklearn.cluster import KMeans
import seaborn as sns
import matplotlib.pyplot as plt
from datetime import date
from datetime import datetime
import numpy as np
import time
import os
import csv
from os.path import exists

SLASH_DATE_FORMAT = "%d/%m/%Y"
SLASH = "/"
DATE_FORMAT = '%Y-%m-%d'
RFM_SCORE_COLUMN = "RFM_score"
LABLE_COLUMN = "lable"
AGE_COLUMN = "age"
GENDER_COLUMN = "gender"
USER_KEY_COLUMN = "user_key"
SUB_CLUSTER = ['sub_0a', 'sub_0b', 'sub_1a', 'sub_1b', 'sub_2a', 'sub_2b']
MALE = "male"
FEMALE = "female"
ITEM_ID_COLUMN = "itemID"
CSV_FORMAT_FILE = ".csv"
DOLAR_SEPARATOR = "$"
TYPE_FILE = '_recommendation.csv'

class LearningRecommendations:

    def __init__(self):
        self.sub_topitem = {}
        self.user_to_sub_list = {}
        self.sub_ids_list = []

    def learn(self, data):
        today = date.today()
        # dd/mm/YY
        day_format = today.strftime(SLASH_DATE_FORMAT)
        date_time = day_format.split(SLASH)
        day = date_time[0]
        month = date_time[1]
        year = date_time[2]

        R = [] # Recency
        for i in tqdm(range(len(data))):
            formated_day = data.date[i].split(" ")[0]
            try:
                formated_day = datetime.strptime(formated_day, DATE_FORMAT)
            except:
                formated_day = datetime.strptime(formated_day, SLASH_DATE_FORMAT)
            formated_day = formated_day.strftime(SLASH_DATE_FORMAT)
            c = formated_day.split(SLASH)
            f_date = date(int(year), int(month), int(day))
            l_date = date(int(c[2]), int(c[1]), int(c[0]))
            delta = f_date - l_date
            R.append(delta.days)
        data["R"] = R

        RFM_score = []
        for i in tqdm(range(len(data))):
            RFM_score.append(self.score(data.R[i], data.amount[i], data.price[i]))
        data[RFM_SCORE_COLUMN] = RFM_score

        temp_main = data
        temp = data[[RFM_SCORE_COLUMN]]

        temp_with_zeros = temp.fillna(0)
        kmeans = KMeans(n_clusters=3, random_state=0)
        kmeans.fit(temp_with_zeros)

        labels = kmeans.labels_
        temp_main[LABLE_COLUMN] = labels

        # sns.lmplot('age','RFM_score',data=temp_main,fit_reg=False,hue="label",scatter_kws={"marker":"D","s":10})
        # plt.xlabel('age')
        # plt.ylabel('RFM_score')
        # plt.show()

        # segmenting 3 different dataframes wrt the labels
        class0 = temp_main[temp_main[LABLE_COLUMN] == 0]
        class1 = temp_main[temp_main[LABLE_COLUMN] == 1]
        class2 = temp_main[temp_main[LABLE_COLUMN] == 2]

        temp_0 = class0[[GENDER_COLUMN, AGE_COLUMN]]
        temp_1 = class1[[GENDER_COLUMN, AGE_COLUMN]]
        temp_2 = class2[[GENDER_COLUMN, AGE_COLUMN]]

        chk_0 = self.convert(temp_0).values
        chk_1 = self.convert(temp_1).values
        chk_2 = self.convert(temp_2).values

        kmeans0 = KMeans(n_clusters=2, random_state=0).fit(chk_0)
        kmeans1 = KMeans(n_clusters=2, random_state=0).fit(chk_1)
        kmeans2 = KMeans(n_clusters=2, random_state=0).fit(chk_2)

        class0[LABLE_COLUMN] = kmeans0.labels_
        class1[LABLE_COLUMN] = kmeans1.labels_
        class2[LABLE_COLUMN] = kmeans2.labels_

        # segmentaion under class0 clusters into furthur segment
        sub_0a = class0[class0[LABLE_COLUMN] == 0]
        sub_0b = class0[class0[LABLE_COLUMN] == 1]
        # segmentaion under class1 clusters into furthur segment
        sub_1a = class1[class1[LABLE_COLUMN] == 0]
        sub_1b = class1[class1[LABLE_COLUMN] == 1]
        # segmentaion under class2 clusters into furthur segment
        sub_2a = class2[class2[LABLE_COLUMN] == 0]
        sub_2b = class2[class2[LABLE_COLUMN] == 1]


        sub_cluster_variable = [sub_0a, sub_0b,
                                sub_1a, sub_1b,
                                sub_2a, sub_2b]

        hold = []
        self.sub_topitem = {}
        for i in tqdm(range(len(SUB_CLUSTER))):
            item, count = self.topitem(sub_cluster_variable[i])
            self.sub_topitem[SUB_CLUSTER[i]] = item
            hold.append(count)


        x = data.user_key.unique()
        ids_0a = sub_0a.user_key.unique()
        ids_0b = sub_0b.user_key.unique()
        ids_1a = sub_1a.user_key.unique()
        ids_1b = sub_1b.user_key.unique()
        ids_2a = sub_2a.user_key.unique()
        ids_2b = sub_2b.user_key.unique()
        self.sub_ids_list = [ids_0a, ids_0b, ids_1a, ids_1b, ids_2a, ids_2b]

        self.user_to_sub_list = {i: [] for i in x}

        for i in x:
            if (i in ids_0a):
                self.user_to_sub_list[i].append(SUB_CLUSTER[0])
            if (i in ids_0b):
                self.user_to_sub_list[i].append(SUB_CLUSTER[1])
            if (i in ids_1a):
                self.user_to_sub_list[i].append(SUB_CLUSTER[2])
            if (i in ids_1b):
                self.user_to_sub_list[i].append(SUB_CLUSTER[3])
            if (i in ids_2a):
                self.user_to_sub_list[i].append(SUB_CLUSTER[4])
            if (i in ids_2b):
                self.user_to_sub_list[i].append(SUB_CLUSTER[5])

        # return sub_topitem, sub_ids_list, user_to_sub_list

    def score(self, r, f, m):
        # return (-r + 100 * f - m)
        return (r - 60 * f + 3 * m)

    def convert(self, df):
        gender = {MALE: 0, FEMALE: 1}
        temp = df[GENDER_COLUMN].map(gender)
        df[GENDER_COLUMN] = temp
        return df

    def topitem(self, df):
        PId = list(df.itemID.unique())
        store = {}
        for i in tqdm(range(len(PId))):
            store[PId[i]] = df[df[ITEM_ID_COLUMN] == PId[i]].amount.sum()

        max_value = max(store.values()) * 0.9
        top_item = [key for key in store.keys() if store[key] >= max_value]
        return (top_item, max_value)


class Recommender:

    def __init__(self):
        self.users = {}
        self.sub_topitem = {}
        self.sub_ids_list = {}
        self.user_to_sub_list = {}
        self.stores_name = []

    def get_store_name(self, store):
        return store.split(DOLAR_SEPARATOR)[1]

    def store_exist(self, store_name):
        dir_path = os.path.dirname(os.path.abspath(__file__))
        file_name = store_name + TYPE_FILE
        file_path = os.path.join(dir_path, file_name)
        if os.path.exists(file_path):
            return True
        else:
            return False


    def rec(self, id, sub_topitem, user_to_sub_list, sub_ids_list2, users_first_store):
        recommendation_list = []
        try:
            sub = user_to_sub_list[id]
            for valOfClass in sub:
                recommendation_list += sub_topitem[valOfClass]
        except:
            recommendation_list = self.similar_user_or_cold_rec(id, sub_topitem, user_to_sub_list, sub_ids_list2,
                                                               users_first_store)
        recommendation_list = list(dict.fromkeys(recommendation_list))
        return recommendation_list

    def similar_user_or_cold_rec(self, iddd, sub_topitem, user_to_sub_list, sub_ids_list2,
                                 users_first_store):
        recommendation_list = []
        try:
            # get the similar user (same sub-class with this user) from other store
            similar_users = []
            for sub_id in sub_ids_list2:
                if iddd in sub_id:
                    f = sub_id.tolist()
                    similar_users += f
            similar_users = list(dict.fromkeys(similar_users))

            # only those in the first store
            for user in similar_users:
                if user not in users_first_store:
                    similar_users.remove(user)

            # add the sub-classes that the similar users are in
            sub_list_similsr_users = []
            for user in similar_users:
                sub_list_similsr_users += user_to_sub_list[user]

            # search for the sub-class that has the most similar users
            res = {}
            for i in sub_list_similsr_users:
                res[i] = sub_list_similsr_users.count(i)

            max_sub = max(res, key=res.get)

            # recommend the recommendations of that sub-class
            recommendation_list += sub_topitem[max_sub]
        except:
            reccomenderItems = []
            for sub in sub_topitem:
                reccomenderItems.append(sub_topitem[sub][0])
                recommendation_list.append(sub_topitem[sub][0])
            print(reccomenderItems)

        return recommendation_list

    def learn(self, file_of_stores, users):
        dir_path = os.path.abspath(os.getcwd())
        name_of_stores = [self.get_store_name(i) for i in file_of_stores]
        for store in name_of_stores:
            file_name = store + CSV_FORMAT_FILE  ##########################
            data = pd.read_csv(file_name, encoding="ISO-8859-8")
            self.users[store] = data[USER_KEY_COLUMN]
            recommender = LearningRecommendations()
            recommender.learn(data)
            self.sub_topitem[store], self.sub_ids_list[store], self.user_to_sub_list[
                store] = recommender.sub_topitem, recommender.sub_ids_list, recommender.user_to_sub_list

        for store in name_of_stores:
            dir_path = os.path.dirname(os.path.abspath(__file__))

            file_name = store + TYPE_FILE
            rec_path = os.path.join(dir_path, file_name)
            f = open(rec_path, 'w',newline="\n")
            writer = csv.writer(f)
            second_store = []
            second_store += name_of_stores
            second_store.remove(store)
            for user in users:
                rec = self.rec_to_id(user, store, second_store)
                writer.writerow([user, rec])

            f.close()

    def rec_to_id(self, id, store, stores_list):
        for s in stores_list:
            try:
                recommendation = self.rec(id, self.sub_topitem[store], self.user_to_sub_list[store], self.sub_ids_list[s],
                             self.users[store])
                return recommendation
            except:
                pass

    def store_recommendation(self, user, store_name):
        if self.store_exist(store_name):
            dir_path = os.path.dirname(os.path.abspath(__file__))
            file_name = store_name + TYPE_FILE
            file_path = os.path.join(dir_path, file_name)
            f = open(file_path)
            reader = csv.reader(f)
            for row in reader:
                if (row[0] == user):
                    return self.clear_items(row[1])


    def general_recommendation(self, user, stores_list):
        rec = []
        for store in stores_list:
            if self.store_exist(store):
                rec += self.store_recommendation(user, store)
        return rec












    def clear_items(self, row):
        tmp = list(row.split(","))
        tmp2 = [i.replace("\'", "") for i in tmp]
        tmp3 = [i.replace("[", "") for i in tmp2]
        tmp4 = [i.replace("]", "") for i in tmp3]
        tmp_list = [i.replace(" ", "") for i in tmp4]
        return tmp_list



# if __name__ == "__main__":
    # repository_mongo = recommendationSystemRepository()
    # repository_mongo.get_all_receipt_by_market() # [('a.csv', 'b.csv'] 12_06_2020$super_pharm$jgcjghg.csv
    # x = Recommender()
    # x.learn() #['a.csv', ]
    # x.rec_to_id(0, 'wolmart')
    # x.store_recommendation('fd18ed355cd74ae38799f76dc7d20609', 'super-pharm333')
    # x.general_recommendation('fd18ed355cd74ae38799f76dc7d20609', ['super-pharm333', 'super-pharm', 'hjkjl', 'walmart'])

    # data = pd.read_csv('super-pharm.csv', encoding="ISO-8859-8")
    # users = list(data.user_key.unique())
    # x.learn(['1$walmart$1.csv', 'f$super-pharm$f.csv'], users)

