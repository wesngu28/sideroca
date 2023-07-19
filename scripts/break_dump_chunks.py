import json
import os

inputs = ['../dumps/cardlist_S1.jsonl', '../dumps/cardlist_S2.jsonl', '../dumps/cardlist_S3.jsonl']
prefixes = ['1_', '2_', '3_']

def split_jsonl(inputs, prefixes):
    for input_file, output_prefix in zip(inputs, prefixes):
        with open(input_file, 'r') as file:
            data = []
            file_number = 0
            line_number = 0

            for line in file:
                entry = json.loads(line)
                data.append(entry)
                line_number += 1

                if line_number % 1000 == 0:
                    start_id = data[0]["ID"]
                    end_id = data[-1]["ID"]
                    output_file = os.path.join(f'../chunks/s{output_prefix[0]}', f'{output_prefix}{start_id}-{end_id}.json')
                    with open(output_file, 'w') as outfile:
                        json.dump(data, outfile)

                    data = []
                    file_number += 1

            if data:
                start_id = data[0]["ID"]
                end_id = data[-1]["ID"]
                output_file = os.path.join(f'../chunks/s{output_prefix[0]}', f'{output_prefix}{start_id}-{end_id}.json')
                with open(output_file, 'w') as outfile:
                    json.dump(data, outfile)

split_jsonl(inputs, prefixes)