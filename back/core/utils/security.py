from passlib.context import CryptContext

pwd_context = CryptContext(schemes=[
        "argon2",
        "bcrypt",
        "django_pbkdf2_sha256",
        "django_pbkdf2_sha1",
        "pbkdf2_sha256",
    ],
    deprecated="auto"
)


def check_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def make_password(password: str) -> str:
    return pwd_context.hash(password)

""" 
"""