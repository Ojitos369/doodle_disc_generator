import os
import re
from ojitos369.utils import printwln as pln

class Migrate:
    def replace_media(self, file):
        file_str = ""
        with open(file, 'r') as f:
            file_str = f.read()
        file_str = file_str.replace('/assets/', '/media/dist/assets/')
        with open(file, 'w') as f:
            f.write(file_str)
        return file_str

    def main(self, *args, **options):
        pwd = os.getcwd()
        media_dir = "back/media/dist"
        react_build = "front/dist"
        # os.chdir(pwd)

        # Borra build anterior si hay
        try:
            os.system(f'rm -rf {media_dir}/')
        except Exception as e:
            pass

        # Crea el directorio si no existe
        try:
            os.system(f'mkdir -p {media_dir}/')
        except Exception as e:
            pass

        # Copia los archivos del build
        try:
            os.system(f'cp -rf {react_build}/* {media_dir}')
        except Exception as e:
            pass

        # Replace /assets/ -> /media/dist/assets/
        html = self.replace_media(f"{media_dir}/index.html")

        # get js name
        files = os.listdir(f'{media_dir}/assets')
        # pln(files)
        file_name = ''
        js_files = []
        for file in files:
            if file.endswith('.js'):
                js_files.append(file)

        for file_name in js_files:
            pln(file_name)
            js = self.replace_media(f"{media_dir}/assets/{file_name}")

            structure = '''https?://localhost(:\d+)?'''
            matches = re.finditer(structure, js)
            matches = sorted(matches, key=lambda x: len(x.group(0)), reverse=True)
            for match in matches:
                pln(match.group(0))
                js = js.replace(match.group(0), '')
            with open(f'{media_dir}/assets/{file_name}', 'w') as f:
                f.write(js)

        # --------------------------------   css   -----------------
        file_name = ''
        css_files = []
        for file in files:
            if file.endswith('.css'):
                css_files.append(file)

        for file_name in css_files:
            pln(file_name)
            css = self.replace_media(f"{media_dir}/assets/{file_name}")

        pln('Done')


if __name__ == '__main__':
    Migrate().main()