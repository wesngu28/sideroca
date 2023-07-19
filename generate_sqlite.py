import sqlite3
import os
import json

connection = sqlite3.connect("cards.db")

cursor = connection.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='cards';")
result = cursor.fetchone()

if result is not None:
    print("The 'cards' table already exists.")
else:
    cursor.execute('''CREATE TABLE cards (
        ID INT,
        SEASON INT,
        NAME VARCHAR(255),
        TYPE VARCHAR(255),
        MOTTO VARCHAR(255),
        CATEGORY VARCHAR(255),
        REGION VARCHAR(255),
        FLAG VARCHAR(255),
        CARDCATEGORY VARCHAR(255),
        DESCRIPTION TEXT,
        BADGES TEXT,
        TROPHIES TEXT,
        PRIMARY KEY (ID, SEASON)
    );''')
    cursor.execute("CREATE INDEX idx_cards_id ON cards(ID);")
    print("The 'cards' table has been created, with index on id.")

directory = os.path.join(os.getcwd(), 'chunks')
prefixes = ['3_', '2_', '1_']

for prefix in prefixes:
    prefix_directory = os.path.join(directory, prefix)
    for file_name in os.listdir(prefix_directory):
        file_path = os.path.join(prefix_directory, file_name)
        if file_name.endswith('.json') and os.path.isfile(file_path):
            with open(file_path, 'r') as file:
                cards = json.load(file)
                for entry in cards:
                    cursor.execute('''INSERT INTO cards (
                        ID, SEASON, NAME, TYPE, MOTTO, CATEGORY, REGION, FLAG, CARDCATEGORY, DESCRIPTION, BADGES, TROPHIES
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);''', (
                        entry['ID'], entry['SEASON'], entry['NAME'], entry['TYPE'], entry['MOTTO'],
                        entry['CATEGORY'], entry['REGION'], entry['FLAG'], entry['CARDCATEGORY'], entry['DESCRIPTION'],
                        json.dumps(entry['BADGES']), json.dumps(entry['TROPHIES'])
                    ))

connection.commit()
connection.close()