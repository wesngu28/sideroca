import json
import os

input_files = ['../dumps/cardlist_S1.jsonl', '../dumps/cardlist_S2.jsonl', '../dumps/cardlist_S3.jsonl']
output_file = 'names.txt'

def extract_names(input_files, output_file):
    unique_names = set()
    try:
        with open(output_file, 'r') as existing_file:
            for line in existing_file:
                name = line.strip()
                unique_names.add(name)
    except FileNotFoundError:
        pass

    with open(output_file, 'a') as outfile:
        for input_file in input_files:
            with open(input_file, 'r') as file:
                for line in file:
                    entry = json.loads(line)
                    name = entry['NAME']
                    if name not in unique_names:
                        outfile.write(name + '\n')
                        unique_names.add(name)

current_dir = os.path.dirname(os.path.abspath(__file__))
input_files = [os.path.join(current_dir, input_file) for input_file in input_files]
output_file = os.path.join(current_dir, output_file)

extract_names(input_files, output_file)