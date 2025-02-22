1. conda create --name vectorsearch
2. conda activate vectorsearch
3. conda install -c conda-forge faiss

To run the server:
flask --app server run

To run the server in debug mode: (auto reloads when files are changed)
flask --app server.py --debug run
