import json

input = 'cardlist_S3.jsonl'
prefix = '3_'
def split_jsonl(input, prefix):
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
                output_file = f'{output_prefix}{start_id}-{end_id}.json'
                with open(output_file, 'w') as outfile:
                    json.dump(data, outfile)

                data = []
                file_number += 1

        if data:
            start_id = data[0]["ID"]
            end_id = data[-1]["ID"]
            output_file = f'{output_prefix}{start_id}-{end_id}.json'
            with open(output_file, 'w') as outfile:
                json.dump(data, outfile)

split_jsonl(input_file, output_prefix, chunk_size)