from flask import Flask, request, jsonify

from FaissIndex import FaissIndex

app = Flask(__name__)

database = FaissIndex()

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

# @app.route("/add", methods=["POST"])
# def add():
#     text = request.args.get("text")
#     vector = request.args.get("vector")

#     print(f"Adding '{text}' to database.")
#     print(f"Vector: {vector}")

#     database.add(vector, text)
#     return "Added!"

# @app.route("/search", methods=["GET"])
# def search():
#     vector = request.args.get("vector")
#     num_results = request.args.get("num_results")
#     results = database.search(vector, num_results)
#     return jsonify(results)

if __name__ == "__main__":
    app.run()