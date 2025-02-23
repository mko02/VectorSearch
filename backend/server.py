from flask import Flask, request, jsonify
from flask_cors import CORS

from FaissIndex import FaissIndex
from llm_api import DocumentLLM

from sentence_transformers import SentenceTransformer

app = Flask(__name__)
CORS(app)

dimensions = 768
database = FaissIndex(dim=dimensions)

model = SentenceTransformer('prdev/mini-gte')

documentLLM = None

document_segment_saved = []

tags = [
    "What is the customer satisfaction?"
]

@app.route("/")
def hello_world():
    return "<p>Welcome to VectorSearch</p>"

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

@app.route("/reset")
def reset():
    database.reset_database()
    return "Reset Successful!"

@app.route("/delete")
def delete():
    database.delete_database()
    return "Delete Successful!"

##########################################
## endpoints actually used in the project

@app.route("/add_document", methods=["POST"])
def add_document():
    try:
        document = request.get_json()

        document_filename = document['filename']
        document_text = document['content']

        print(document_filename)
        print(document_text)

        segments, embeddings = embed_document(document_filename, document_text)
        save_document(segments, embeddings)

        tags_response = get_tags_reasoning()
        print(tags_response)

        return tags_response, 201
    
    except Exception as e:
        return jsonify({"message": "Error", "error": str(e)}), 500
    
def get_tags_reasoning():

    documentLLM = DocumentLLM(tags[0])
    response = documentLLM.reason()

    query = response['query']
    thinking = response['thinking']
    
    document_segment_saved = search_query_for_llm(query)

    response = documentLLM.reason(document_segment_saved)
    print(response)

    while response['type'] != "end":
        thinking = response['thinking']
        query = response['query']
        document_segment_saved = search_query_for_llm(query)
    
        response = documentLLM.reason(document_segment_saved)
        print(response)

    answer = response['answer']
    print(answer)
    return jsonify(
        {"message": "end", "thinking": thinking, "answer": answer, "document_segments": document_segment_saved })

# endpoint when user search in search bar
# should call LLM API
# either gets end of text, which ends the conversation
# or gets a function call, which we then call the search_query_for_llm function
@app.route("/search_query", methods=["POST"])
def search_query():

    print("search_query")

    try: 
        global documentLLM
        global document_segment_saved

        response = (request.get_json())
        print(response)

        query = response['query']
        documentLLM = DocumentLLM(query)

        response = documentLLM.reason()
        print(response)

        query = response['query']
        thinking = response['thinking']
    
        document_segment_saved = search_query_for_llm(query)

        return jsonify({"message": "Success", "thinking": thinking, "document_segments": document_segment_saved}), 200
    
    except Exception as e:
        print(e)
        return jsonify({"message": "Error", "error": str(e)}), 500

@app.route("/search_continue", methods=["POST"])
def search_continue():

    print("\nsearch_continue")

    try:
        global document_segment_saved
        global documentLLM

        print(document_segment_saved)

        response = documentLLM.reason(document_segment_saved)
        print(response)

        type = response['type']
        thinking = response['thinking']

        if type == "end":
            answer = response['answer']
            print(answer)
            return jsonify({"message": "end", "thinking": thinking, "answer": answer}), 200

        query = response['query']
        document_segment_saved = search_query_for_llm(query)

        return jsonify({"message": "continue", "thinking": thinking, "document_segments": document_segment_saved}), 200
    
    except Exception as e:
        return jsonify({"message": "Error", "error": str(e)}), 500

def search_query_for_llm(query, num_results=5):
    vector = embed_query(query)
    return database.search(vector, num_results)
    
def embed_document(filename, document):
    
    segment_size = 200      # word count per segment
    overlap_size = 20       # overlap size

    # split the document into segments
    segments = []

    for i in range(0, len(document), segment_size - overlap_size):
        start = i
        end = min(len(document), i + segment_size)

        segment = filename + " " + document[start:end]
        segments.append(segment)

    print(f"Document split into {len(segments)} segments.")

    # embed the segments
    embeddings = model.encode(segments)
    return (segments, embeddings)

def embed_query(query):
    return model.encode(query)

def save_document(segments, embeddings):
    database.add(embeddings, segments)

if __name__ == "__main__":
    app.run(port=8080, debug=True)