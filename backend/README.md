1. `conda create --name vectorsearch`
2. `conda activate vectorsearch`

Install dependencies:

1. `conda install -c conda-forge flask`
2. `conda install -c conda-forge flask-cors`

3. `conda install -c conda-forge faiss`
4. `conda install -c conda-forge transformers`
5. `conda install -c conda-forge sentence-transformers`
   if conda install fails, try `pip install sentence-transformers`

To run the server:
`flask --app server.py run --port 8080 --debug`
