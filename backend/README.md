1. `conda create --name vectorsearch`
2. `conda activate vectorsearch`

Install dependencies:

1. `conda install -c conda-forge faiss`
2. `conda install -c conda-forge transformers`
3. `conda install -c conda-forge sentence-transformers`
   if conda install fails, try `pip install sentence-transformers`

To run the server:
`flask --app server run`

To run the server in debug mode: (auto reloads when files are changed)
`flask --app server.py --debug run`
