import asyncio
import websockets

async def connect_and_send(uri, message):
  async with websockets.connect(uri) as websocket:
    await websocket.send(message)
    print(f"Sent message: {message}")
    async for response in websocket:
      print(f"Received message: {response}")

asyncio.run(connect_and_send("ws://localhost:8765", "Test message from Python client"))
