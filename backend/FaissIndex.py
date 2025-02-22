import faiss
import numpy as np
import json
import os

class FaissIndex:
    def __init__(self, db_path="database", json_path="data_mapping.json", dim=512):
        self.db_path = db_path
        self.json_path = json_path
        self.index = None
        self.id_mapping = {}  # mapping IDs to text
        self.next_id = 0

        # Load existing database if available
        if os.path.exists(self.db_path):
            self.load_database()
        else:
            self.init_database(dim)

        # Load existing ID mapping if available
        if os.path.exists(self.json_path):
            with open(self.json_path, "r") as f:
                self.id_mapping = json.load(f)

    def init_database(self, dim=512):
        self.index = faiss.IndexIDMap2(faiss.IndexFlatIP(dim))  # Inner Product (IP) similarity, aka cosine similarity
        self.id_mapping = {}
        self._save_all()
        print("New FAISS database initialized.")

    def load_database(self):
        self.index = faiss.read_index(self.db_path)
        
        with open(self.json_path, "r") as f:
            self.id_mapping = json.load(f)

        if len(self.id_mapping) != self.index.ntotal:
            raise ValueError("Number of IDs does not match database size.")
        
        self.next_id = self.index.ntotal
        print(f"Database and ID mapping loaded. Number of Vectors: {self.index.ntotal}")

    def add(self, vectors, texts):
        num_vectors = len(vectors)

        print(f"Adding {num_vectors} vectors to database.")
        print(f"Checking against {len(texts)} texts")
        if num_vectors != len(texts):
            raise ValueError("Number of vectors and texts must be the same.")

        # Generate unique IDs
        ids = np.arange(self.next_id, self.next_id + num_vectors)

        # Add to FAISS index
        self.index.add_with_ids(np.array(vectors, dtype="float32"), ids)

        # Store in JSON mapping
        for i, text in zip(ids, texts):
            self.id_mapping[int(i)] = text 

        self._save_all()
        print(f"Added {num_vectors} vectors to database.")

    def search(self, query_vector, num_results=3):
        distances, indices = self.index.search(
            np.array(query_vector, dtype="float32").reshape(1, -1), num_results)
        
        results = []

        for i, idx in enumerate(indices[0]):
            idx = str(idx)
            if idx in self.id_mapping:
                results.append({
                    "text": self.id_mapping.get(idx), 
                    "similarity": float(distances[0][i])
                })
        
        return results

    def remove_by_id(self, ids):
        ids = np.array(ids, dtype="int64")  # Ensure correct format
        self.index.remove_ids(ids)

        # Remove from JSON mapping
        for i in ids:
            self.id_mapping.pop(str(i), None)

        self._save_all()
        print(f"Removed {len(ids)} vectors from database.")

    def remove_by_vector(self, vector):
        # TODO
        pass

    def reset_database(self):
        self.index.reset()
        self.id_mapping = {}  # Clear text mappings
        self._save_all()
        print("Database and ID mapping reset.")

    def delete_database(self):
        os.remove(self.db_path)
        os.remove(self.json_path)
        print("Database and ID mapping deleted.")

    def _save_all(self):
        faiss.write_index(self.index, self.db_path)

        with open(self.json_path, "w") as f:
            json.dump(self.id_mapping, f, indent=4)

        print("Database and ID mapping saved.")

# Database and ID mapping saved.
# New FAISS database initialized.
# Database and ID mapping saved.
# Added 3 vectors to database.

# Search Results:
# Rank 1: 'Hello, how are you?' (Distance: 0.0)
# Rank 2: 'The quick brown fox jumps over the lazy dog.' (Distance: 86.1423568725586)
# Database and ID mapping saved.
# Removed 512 vectors from database.

# Search Results After Deletion:
# Rank 1: 'The quick brown fox jumps over the lazy dog.' (Distance: 86.1423568725586)
# Rank 2: 'What is the capital of France?' (Distance: 89.71810150146484)
# Database and ID mapping deleted.