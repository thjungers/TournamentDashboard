from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv("/home/SportArdent/tournament/.env")
api_token = os.environ["TOKEN"]

app = Flask(__name__)
CORS(app)

state = {}

@app.get("/")
def get_sheet_state():
    return state

@app.post("/")
def post_sheet_state():
    global state
    if request.headers.get("X-Api-Token") == api_token:
        state = request.get_json()
        return "", 204
    return "Unauthorized", 401
