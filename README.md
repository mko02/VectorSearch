# VectorSearch

[Devpost Project Page](https://devpost.com/software/crossentropy) • [Huggingface Model Repo](https://huggingface.co/prdev/R1-Llama-8B-Function-Calling2) • [FAISS Repository](https://github.com/facebookresearch/faiss?tab=readme-ov-file) • [QTACK Embedding Model](https://prdev/mini-gte)

VectorSearch is a cutting-edge platform developed by Crossentropy that fuses advanced reasoning models with embedding search technology. The system is designed to provide highly accurate, context-aware searches over unstructured data, making it especially valuable in sectors like insurance and finance where precision and security are paramount.

---

## Results

Achieved 1st in the Assurant-sponsored Track!

---

## Table of Contents

- [📝 Overview](#overview)
- [✨ Features](#features)
- [🔧 Technologies Used](#technologies-used)
- [🚀 Usage](#usage)
- [🏗️ Architecture](#architecture)
- [📊 Use Cases](#use-cases)
- [⚙️ How It Works](#how-it-works)
- [🏆 Challenges and Accomplishments](#challenges-and-accomplishments)
- [🔮 What's Next](#whats-next)
- [📄 License](#license)
- [👥 Our Team](#our-team)
- [🔗 Links](#links)
---

## Overview

VectorSearch leverages a fine-tuned version of Deepseek's R1 8B model—enhanced with frontier methods like GRPO—to maintain robust reasoning abilities while integrating search capabilities. The platform is built to enable users to perform natural language queries over their company documents and receive iterative, contextually refined results. In addition, it supports proactive monitoring by sending real-time alerts when new, relevant documents are added.

---

## Features

- **Natural Language Search:** Users can query company documents using plain language, eliminating the need for precise keywords.
- **Iterative Reasoning:** A reasoning AI agent continuously refines search results until the most relevant information is retrieved.
- **Real-Time Monitoring:** The system tracks user-defined topics and delivers alerts as soon as new data becomes available.
- **Local Deployment:** Optimized for on-premise usage, ensuring data security without reliance on third-party cloud servers.
- **Efficient Resource Usage:** Combines the work of multiple AI agents into one, improving inferencing efficiency.

---

## Technologies Used

- **Deepseek's R1 8B Model**
- **Huggingface Model Repository** [prdev/R1-Llama-8B-Function-Calling2](https://huggingface.co/prdev/R1-Llama-8B-Function-Calling2)
- **NextJS**
- **Python**
- **FAISS**
- **Huggingface**
- **TRL**
- **Flask**
- **FastAPI + Uvicorn**
---

## Usage

1. **Clone the Repository:** Start by cloning the repository to your local machine.
2. **Review Subfolder READMEs:** Detailed instructions for running the local client are provided within the `frontend` and `backend` directories.
3. **Execute the Application:** Follow the setup guidelines to deploy the system locally, ensuring that all dependencies are met.
4. **Perform Searches:** Use the platform to run natural language queries over your document corpus and receive refined, contextually relevant results.
5. **Monitor Topics:** Set up topic alerts to get real-time notifications when new relevant data is ingested.

---

## Architecture

VectorSearch integrates a fine-tuned reasoning model with an embedding search mechanism:

1. **User Query Submission:** Users enter a natural language query.
2. **Vector Database Search:** The reasoning agent leverages an embedding model to search the vectorized database.
3. **Iterative Refinement:** The agent analyzes the search results and performs additional searches as needed until it identifies the most relevant information.
4. **Final Output:** A contextually rich and accurate response is returned to the user.

---

## Use Cases

### Insurance

For companies such as Assurant:
- **Scenario:** Following a major storm, an employee needs to identify all documents related to a customer's storm damage claim.
- **Benefit:** The platform efficiently retrieves relevant documents (emails, filings, conversations), saving time and ensuring that customer needs are quickly addressed.

### Finance

For financial institutions like Capital One:
- **Scenario:** When evaluating loan or credit applications, banks must sift through extensive customer data.
- **Benefit:** VectorSearch aids in quickly identifying key data points (e.g., past loan defaults) and provides real-time alerts on risk factors, enabling more informed decision-making.

---

## How It Works

- **Fine-Tuning:** Deepseek's R1 model is fine-tuned using GRPO methods rather than standard SFT or DPO techniques, ensuring that the reasoning capabilities remain intact.
- **Data Transformation:** A custom dataset converts unstructured data into a vector format for effective similarity searches.
- **Iterative Search Process:** After a user submits a query, the reasoning agent leverages the embedding model to search the vector database. The process is repeated, refining the search until the optimal result is found.
- **Hybrid Approach:** By combining the strengths of embedding search with iterative reasoning, the platform delivers results that are both highly accurate and contextually aware.

---

## Our Team

- **Max Ko:** Frontend Client UI + Backend
- **Yashwanth Alluri:** Frontend Client UI
- **Pranav Devarinti:** AI Model Creation 
- **Bryce Pardo:** Writeups + System Planning + UI Design

---

## Challenges and Accomplishments

### Challenges

- **Time Management:** Balancing various hackathon events, networking, and sponsor engagements required efficient prioritization.
- **Technical Complexity:** Fine-tuning a large model and integrating advanced tool use within a short timeframe presented significant challenges.

### Accomplishments

- **Ambitious Scope:** Successfully fine-tuned a large-scale model during a hackathon-a-thon.
- **Innovative Integration:** Demonstrated the effective use of a reasoning model in conjunction with an embedding model to enhance search capabilities.
- **Real-World Impact:** Developed a platform that addresses critical challenges in industries requiring precise, on-premise data handling.

---

## What's Next

- **Startup Integration:** Team members are incorporating these innovations into their startup ventures to further refine and expand the technology.
- **Feature Expansion:** Future iterations will focus on enhancing user experience, scaling the system, and integrating more advanced AI capabilities.
- **Research and Development:** Continued exploration into the synergy between reasoning models and embedding search to drive further improvements in search accuracy and efficiency.

---

## Links

- **Devpost:** [https://devpost.com/software/crossentropy](https://devpost.com/software/crossentropy)
- **Huggingface Model Repo:** [prdev/R1-Llama-8B-Function-Calling2](https://huggingface.co/prdev/R1-Llama-8B-Function-Calling2)
- **FAISS:** [https://github.com/facebookresearch/faiss?tab=readme-ov-file](https://github.com/facebookresearch/faiss?tab=readme-ov-file)
