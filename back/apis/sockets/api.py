# apis/sockets/api.py
import httpx
import json
from core.bases.apis import WebSocketApi

class ChatSocketApi(WebSocketApi):
    async def stream_llm_response(self, client, data):
        async with client.stream("POST", self.link, json=data, timeout=None) as response:
            response.raise_for_status()
            async for line in response.aiter_lines():
                if line:
                    yield line

    async def consultar(self, user_message, chat_id):
        self.link = "http://localhost:11434/api/generate"
        # self.model = "deepseek-r1:1.5b"
        self.model = "ds8"
        instrucciones = "Eres un bot, solo daras la respuesta, los roles los manejo por fuera\n"
        data = {
            "model": self.model,
            "prompt": f"{instrucciones}Prompt: {user_message}",
            "stream": True
        }
        
        pensando = False
        
        async with httpx.AsyncClient() as client:
            try:
                async for response_line in self.stream_llm_response(client, data):
                    try:
                        rs = json.loads(response_line)
                    except json.JSONDecodeError:
                        print(f"Error decodificando JSON: {response_line}")
                        continue

                    message = rs.get("response", "")
                    done = rs.get("done", False)

                    if done:
                        await self.manager.broadcast_to_group("-done-", chat_id)
                        print("\n--- Stream Done ---")
                        break

                    if "<think>" in message:
                        print("-pensando-")
                        pensando = True
                        message = message.replace("<think>", "")
                    
                    if "</think>" in message:
                        print("-pensando-\n\n")
                        pensando = False
                        message = message.replace("</think>", "")
                    print(message, end="")
                    
                    if not pensando and message:
                        await self.manager.broadcast_to_group(message, chat_id)

            except httpx.RequestError as e:
                print(f"Error al conectar con el LLM: {e}")
                error_msg = "Error: No se pudo conectar con el modelo de lenguaje."
                await self.manager.broadcast_to_group(error_msg, chat_id)
                await self.manager.broadcast_to_group("-done-", chat_id)

    async def on_receive(self, data: str):
        chat_id = self.data.get('chat_id')
        await self.consultar(data, chat_id)

    async def on_connect(self):
        pass

    async def on_disconnect(self):
        pass

""" 
"""