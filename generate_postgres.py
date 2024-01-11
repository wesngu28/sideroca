import psycopg2
import os
import json
from dotenv import load_dotenv

connection = psycopg2.connect(
    host=os.getenv('DB_HOST'),
    port=os.getenv('DB_PORT'),
    database=os.getenv('DB_NAME'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD')
)
cursor = connection.cursor()

cursor.execute('DROP TABLE IF EXISTS cards')
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
    BADGES JSONB,
    TROPHIES JSONB,
    PRIMARY KEY (ID, SEASON)
);''')

directory = os.path.join(os.getcwd(), '../chunks')
prefixes = ['3_', '2_', '1_']

for prefix in prefixes:
    prefix_directory = os.path.join(directory, prefix)
    for file_name in os.listdir(prefix_directory):
        file_path = os.path.join(prefix_directory, file_name)
        if file_name.endswith('.json') and os.path.isfile(file_path):
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
                        print(f'adding {card['NAME']} - season {card['SEASON']}')

connection.commit()
connection.close()