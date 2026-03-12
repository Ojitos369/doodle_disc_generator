import os

command = ""
command += "pip freeze > requirements.txt\n"
command += "sed -i 's/==/>=/g' requirements.txt\n"
command += "pip install -r requirements.txt --upgrade\n"
command += "pip freeze > requirements.txt\n"

os.system(command)

