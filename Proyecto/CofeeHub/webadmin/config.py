import os

from dotenv import load_dotenv

load_dotenv()

API_BASE_URL = os.getenv("API_BASE_URL", "http://127.0.0.1:8010")
SECRET_KEY = os.getenv("SECRET_KEY", "clave-de-desarrollo")
