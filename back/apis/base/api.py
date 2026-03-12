from core.bases.apis import BaseApi, pln, prod_mode, dev_mode

class HelloWorld(BaseApi):
    def main(self):
        self.show_me()
        self.response = {"Hello": "World", "message" : "Hello World"}

class GetModes(BaseApi):
    def main(self):
        self.response = {"prod_mode": prod_mode, "dev_mode": dev_mode}

    def validate_session(self):
        pass


""" 
"""