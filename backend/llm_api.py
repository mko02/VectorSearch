url = "https://kmtjxbtkgxjssfzr.us-east4.gcp.endpoints.huggingface.cloud"
function_call_instructions = (
        "IMPORTANT: When needed, make a function call using the following format:\n"
        "<functioncall> {\"name\": \"<function_name>\", \"arguments\": \"<json_arguments>\"} </functioncall>\n"
        "Ensure that your JSON is valid and includes the required keys. \n"
        "End the conversation after the function call for it to execute, the user will not see this, but a new conversation will begin for you with its outputs. \n"
)

chat_interaction = [
    {
        "role": "system",
        "content": (
            function_call_instructions +
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
    {
        "role": "user",
        "content": "USER SETTINGS: Perform multiple sequential searches if required. Can we plot our Q1 results? Revenue went from 22M to 55M."
    }
]
