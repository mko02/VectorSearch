import requests

MODEL_URL = "https://21f5-34-87-170-212.ngrok-free.app"

FUNCTION_CALL_INSTRUCTION = (
        "IMPORTANT: When needed, make a function call using the following format:\n"
        "<functioncall> {\"name\": \"<function_name>\", \"arguments\": \"<json_arguments>\"} </functioncall>\n"
        "Ensure that your JSON is valid and includes the required keys. \n"
        "End the conversation after the function call for it to execute, the user will not see this, but a new conversation will begin for you with its outputs. \n"
)

INITIAL_CHAT_INTERACTION = [
    {
        "role": "system",
        "content": (
            FUNCTION_CALL_INSTRUCTION +
            "You are a helpful assistant with access to the following functions. Use them if required -\n"
            '{\n'
            '    "name": "search",\n'
            '    "description": "search for an item in the internal company database",\n'
            '    "parameters": {\n'
            '        "type": "object",\n'
            '        "properties": {\n'
            '            "query": {"type": "string", "description": "The search query"}\n'
            '        },\n'
            '        "required": ["query"]\n'
            '    } \n'
        )
    },
]

user_input_pre_prompt = "TOOL: This is the result that was returned from the search:\n"
user_input_post_prompt = "Given the information, answer the initial question:"
end_of_loop_user_prompt = "TOOL: DO NOT include more <functioncall>. Answer the question please."

sample_user_input =  {
    "role": "user",
    "content": f"{user_input_pre_prompt} + text + {user_input_post_prompt}"
}

class DocumentLLM:

    def __init__(self, initial_query):
        self.initial_query = initial_query
        self.chat_history = INITIAL_CHAT_INTERACTION
        self.steps = 0
        self.max_steps = 1

    def reason(self, document_segments = None):

        print(f"steps: {self.steps}")

        if self.steps == 0:
            self.__add_user_input(self.initial_query)
            function_call_query = self.search_loop()
            final_content = self.chat_history[-1]['content']

            thinking = self.extract_thinking(final_content)

            self.steps += 1
            return {"type": "search", "thinking": thinking, "query": function_call_query}
        
        if (1 <= self.steps < self.max_steps) and document_segments:
            self.__append_document_segments(document_segments)
            function_call_query = self.search_loop()
            final_content = self.chat_history[-1]['content']

            thinking = self.extract_thinking(final_content)

            self.steps += 1
            return {"type": "search", "thinking": thinking, "query": function_call_query}

        if self.steps == self.max_steps:
            self.finish_search()
            final_content = self.chat_history[-1]['content']

            thinking = self.extract_thinking(final_content)
            answer = self.extract_answer(final_content)

            self.steps += 1
            return {"type": "end", "thinking": thinking, "answer": answer}
        
        return None

    def __add_user_input(self, text, is_end_of_loop=False):
        if is_end_of_loop:
            content = f"{end_of_loop_user_prompt} {text} {user_input_post_prompt}"
        else:
            content = f"{user_input_pre_prompt} {text} {user_input_post_prompt}"

        user_input = {
            "role": "user",
            "content": content
        }
        self.chat_history.append(user_input)

    def __append_document_segments(self, document_segments):
        document_text = ""
        count = 1

        for segment in document_segments:
            document_text += f"{count}. {segment}\n"
            count += 1

        self.__add_user_input(document_text)

    def format_chat_history(self):
        chat_interaction = {
            "chat_interaction": self.chat_history
        }

        return chat_interaction

    def search_loop(self):
        url = MODEL_URL + "/search_loop"

        # Send POST request to LLM API
        response = requests.post(url, json=self.format_chat_history())
        response_json = response.json()

        self.chat_history = response_json["chat_interaction"]

        print(response_json["chat_interaction"][-1]['content'])

        function_call = self.extract_function_call(response_json["chat_interaction"][-1]['content'])
        function_call_query = self.extract_query_from_function_call(function_call)
        print(f"function_call_query: {function_call_query}")

        return function_call_query

    def finish_search(self):
        url = MODEL_URL + "/finish_search"

        # Send POST request to LLM API
        response = requests.post(url, json=self.format_chat_history())
        response_json = response.json()

        print(response_json["chat_interaction"][-1]['content'])

        self.chat_history = response_json["chat_interaction"]

    def extract_thinking(self, content):
        endIndex = content.find("</think>")
        thinking_text = content[:endIndex]
        return thinking_text
    
    def extract_answer(self, content):
        index = content.find("</think>") + len("</think>")
        answer_text = content[index:]
        return answer_text

    def extract_function_call(self, content):
        if "<functioncall>" in content and "</functioncall>" in content:
            start_index = content.find("<functioncall>") + len("<functioncall>")
            end_index = content.find("</functioncall>")
            return content[start_index:end_index]

        return None
    
    def extract_query_from_function_call(self, function_call):
        target_string = "{\"query\": \""
        index = function_call.find(target_string) + len(target_string)
        end_index = function_call.find("\"}", index)
        return function_call[index:end_index]

# ask question
# get question
# send to embedding
# send 3 new document segment