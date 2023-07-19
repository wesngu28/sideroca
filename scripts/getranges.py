import os

output_file = 'output.txt'
lists = ['1_', '2_', '3_']
data = []

file_names = os.listdir(os.getcwd())

for prefix in lists:
    for file_name in file_names:
        if file_name.startswith(prefix):
            extracted_name = file_name[len(prefix):-5]
            data.append(extracted_name)

print(data)