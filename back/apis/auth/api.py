from core.bases.apis import BaseApi, pln
from core.utils.security import check_password

class Login(BaseApi):
    def main(self):
        self.show_me()
        token = self.get_id()
        self.response = {
            "user": {},
            "token": token
        }

    def validate_session(self):
        pass

class ValidateLogin(BaseApi):
    def main(self):
        self.response = {
            "user": {},
            "token": self.token
        }

