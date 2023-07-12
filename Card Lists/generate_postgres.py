import psycopg2
import os
import json

connection = psycopg2.connect(
    host='a',
    port='a',
    database='a',
    user='a',
    password='a'
)
cursor = connection.cursor()
# cursor.execute('DROP TABLE IF EXISTS cards')
# cursor.execute('''CREATE TABLE cards (
#     ID INT,
#     SEASON INT,
#     NAME VARCHAR(255),
#     TYPE VARCHAR(255),
#     MOTTO VARCHAR(255),
#     CATEGORY VARCHAR(255),
#     REGION VARCHAR(255),
#     FLAG VARCHAR(255),
#     CARDCATEGORY VARCHAR(255),
#     DESCRIPTION TEXT,
#     BADGES JSONB,
#     TROPHIES JSONB,
#     PRIMARY KEY (ID, SEASON)
# );''')

directory = os.path.join(os.getcwd())
for file_name in os.listdir(directory):
    file_path = os.path.join(directory, file_name)
    if '3_' in file_name and file_name.endswith('.json') and os.path.isfile(file_path):
        with open(file_path, 'r') as file:
            cards = json.load(file)
            for card in cards:
                cursor.execute("SELECT COUNT(*) FROM cards WHERE ID = %s AND SEASON = %s", (card['ID'], card['SEASON']))
                count = cursor.fetchone()[0]
                if count == 0:
                    cursor.execute('''INSERT INTO cards (
                        ID, SEASON, NAME, TYPE, MOTTO, CATEGORY, REGION, FLAG, CARDCATEGORY, DESCRIPTION, BADGES, TROPHIES
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);''', (
                        card['ID'], card['SEASON'], card['NAME'], card['TYPE'], card['MOTTO'],
                        card['CATEGORY'], card['REGION'] if card['REGION'] is not None else '',
                        card['FLAG'], card['CARDCATEGORY'], card['DESCRIPTION'],
                        json.dumps(card['BADGES']), json.dumps(card['TROPHIES'])
                    ))
                    print('adding')

connection.commit()
connection.close()
