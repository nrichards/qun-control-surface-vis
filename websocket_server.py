import asyncio
import websockets

# Stores connected clients (websockets)
connected = set()

async def echo(websocket, path):
  # Print connection details
  print(f"WebSocket connection established on path: {path}")
  
  # Add client to connected set
  connected.add(websocket)
  
  try:
    async for message in websocket:
      print(f"Received message from client: {message}")
      # Broadcast message to all connected clients (excluding sender)
      for client in connected:
        if client != websocket:
          await client.send(message)
  except websockets.ConnectionClosed:
    print("Client disconnected")
  finally:
    # Remove client from connected set on disconnect
    connected.remove(websocket)

async def broadcast_server_message():
  while True:
    data = input("Enter message to broadcast (or press Enter to quit): ")
    if not data:
      break  # Exit loop on empty input (Enter)
    # Send data to all connected clients
    for client in connected.copy():  # Use a copy to avoid modification issues
      try:
        await client.send(data)
      except websockets.ConnectionClosed:
        # Handle potential disconnections during broadcast
        print(f"Client disconnected while broadcasting: {client}")
        connected.remove(client)
    # Add a short delay to avoid overwhelming clients with messages (optional)
    await asyncio.sleep(0.1)  # Adjust delay as needed
    
async def main():
  async with websockets.serve(echo, "localhost", 8765):
    print("WebSocket server listening on ws://localhost:8765")
    # Start a separate task to handle server message broadcasting
    broadcast_task = asyncio.create_task(broadcast_server_message())
    # Wait for both the echo coroutine (handling client messages) 
    # and the broadcast_task to finish
    print("waiting for broadcast_task to finish")
    # await asyncio.gather(broadcast_task)
    print("done waiting")
  print("waiting for broadcast_task to finish")
  await asyncio.gather(broadcast_task)
  print("done waiting")


asyncio.run(main())
