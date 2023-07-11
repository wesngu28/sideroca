import json

input_file = 'cardlist_S1.jsonl'
output_file = 'names.txt'

def extract_names(input_file, output_file):
    unique_names = set()
    try:
        with open(output_file, 'r') as existing_file:
            for line in existing_file:
                name = line.strip()
                unique_names.add(name)
    except FileNotFoundError:
        pass

    with open(input_file, 'r') as file, open(output_file, 'a') as outfile:
        for line in file:
            entry = json.loads(line)
            name = entry['NAME']
            if name not in unique_names:
                outfile.write(name + '\n')
                unique_names.add(name)

extract_names(input_file, output_file)
