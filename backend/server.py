from flask import Flask, request, jsonify

from FaissIndex import FaissIndex
from sentence_transformers import SentenceTransformer

app = Flask(__name__)

dimensions = 768
database = FaissIndex(dim=dimensions)

model = SentenceTransformer('prdev/mini-gte')

@app.route("/")
def hello_world():
    return "<p>Welcome to VectorSearch</p>"

### Sample /add request
# {
#   "text": "Hello World",
#   "vector": [[1.0, 2.0, 3.0]]
# }
@app.route("/add", methods=["POST"])
def add():

    try:
        response = (request.get_json())

        text = response['text']
        vector = response['vector']

        # check if vector is valid
        if len(vector[0]) != dimensions:
            return jsonify({"message": "Error", "error": f"Your vector dim must be {dimensions}"}), 400
        
        # vector and text must be a list
        if not isinstance(vector[0], list):
            return jsonify({"message": "Error", "error": "Vector must be a list"}), 400
        
        if not isinstance(text, list):
            return jsonify({"message": "Error", "error": "Text must be a list"}), 400

        database.add(vector, text)

        return jsonify({"message": "Success, Vectors added", "text": text}), 201
    
    except Exception as e:
        return jsonify({"message": "Error", "error": str(e)}), 500

### Sample /search request
# {
#   "vector": [1.0, 2.0, 3.0],
#   "num_results": 1
# }
@app.route("/search", methods=["GET"])
def search():

    try: 
        response = (request.get_json())

        vector = response['vector']
        num_results = response['num_results']

        # check if vector is valid
        if len(vector) != dimensions:
            return jsonify({"message": "Error", "error": f"Your vector dim must be {dimensions}"}), 400
        
        # num_results must be an integer
        if not isinstance(num_results, int):
            return jsonify({"message": "Error", "error": "num_results must be an integer"}), 400

        results = database.search(vector, num_results)

        return jsonify(results)
    
    except Exception as e:
        return jsonify({"message": "Error", "error": str(e)}), 500
    
@app.route("/add_document", methods=["POST"])
def add_document():
    try:
        document = request.files
        print(document)

        segments, embeddings = embed_document(document)
        save_document(segments, embeddings)

        return jsonify({"message": "Success, Vectors added", "text": segments}), 201
    
    except Exception as e:
        return jsonify({"message": "Error", "error": str(e)}), 500

def embed_document(document):
    
    segment_size = 200      # word count per segment
    overlap_size = 20       # overlap size

    # split the document into segments
    segments = []

    for i in range(0, len(document), segment_size - overlap_size):
        start = i
        end = min(len(document), i + segment_size)

        segment = document[start:end]
        segments.append(segment)

    # embed the segments
    embeddings = model.encode(segments)
    return (segments, embeddings)

def save_document(segments, embeddings):

    for segment, embedding in zip(segments, embeddings):
        database.add(embedding, segment)

@app.route("/reset")
def reset():
    database.reset_database()
    return "Reset Successful!"

@app.route("/delete")
def delete():
    database.delete_database()
    return "Delete Successful!"

if __name__ == "__main__":
    app.run()