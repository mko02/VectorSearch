1. `conda create --name vectorsearch python=3.10`
2. `conda activate vectorsearch`

Install dependencies:

1. `conda install -c conda-forge flask`
2. `conda install -c conda-forge flask-cors`

3. `conda install -c conda-forge faiss`
4. `conda install -c conda-forge transformers`
5. `conda install -c conda-forge sentence-transformers`
   if conda install fails, try `pip install sentence-transformers`

To run the server:
`python server.py'

if the server breaks, saying something about number of vectors dont match up
delete `backend/database` and `backend/data_mapping.json`
