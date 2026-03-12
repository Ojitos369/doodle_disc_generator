from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from urls import urls_router, add_404_handler

from core.conf.settings import allow_origins, allow_origin_regex, allow_credentials, allow_methods, allow_headers, MEDIA_DIR

app = FastAPI()

app.add_middleware(
    CORSMiddleware, 
    # allow_origins=allow_origins,
    allow_origin_regex=allow_origin_regex,
    allow_credentials=allow_credentials,
    allow_methods=allow_methods,
    allow_headers=allow_headers
)

app.include_router(urls_router, prefix="")

add_404_handler(app)


# uvicorn main:app --host 0.0.0.0 --port 8000 --reload
# uvicorn main:app --host 0.0.0.0 --port 8369 --reload

""" 

"""