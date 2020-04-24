#!/usr/bin/env python3

# Install websocket_client using
# pip install websocket_client
import websocket

try:
    import thread
except ImportError:
    import _thread as thread

import time
import json


def on_message(ws, message):
    # print(message)
    print(json.loads(message)['state'])


def on_error(ws, error):
    print(error)


def on_close(ws):
    print("### closed ###")


def on_open(ws):

    def run(*args):
        time.sleep(1)
        # Start playing experiment, and wait for 1 second
        ws.send("{\"command\":\"play\"}")
        time.sleep(1)

        # pause the experiment, and wait for 1 second
        ws.send("{\"command\":\"pause\"}")
        time.sleep(1)

        # reset the experiment, and wait for 1 second
        ws.send("{\"command\":\"reset\"}")
        time.sleep(1)

        # exit the client safely
        ws.close()
        print("thread terminating...")

    thread.start_new_thread(run, ())


if __name__ == "__main__":
    ws = websocket.WebSocketApp("ws://localhost:3000?broadcasts",
                                on_open=on_open,
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close)
    ws.run_forever()
