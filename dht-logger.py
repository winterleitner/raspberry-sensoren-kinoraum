#!/usr/bin/env python3

import time
import board
import adafruit_dht
import mariadb
import sys

# Initial the dht device, with data pin connected to:
# dhtDevice = adafruit_dht.DHT22(board.D4)

# you can pass DHT22 use_pulseio=False if you wouldn't like to use pulseio.
# This may be necessary on a Linux single board computer like the Raspberry Pi,
# but it will not work in CircuitPython.
dhtDevice = adafruit_dht.DHT22(board.D2, use_pulseio=False)

# Connect to MariaDB Platform
try:
    conn = mariadb.connect(
        user="root",
        password="password",
        host="192.168.5.5",
        port=3306,
        database="keller_sensor"

    )
except mariadb.Error as e:
    print(f"Error connecting to MariaDB Platform: {e}")
    sys.exit(1)

# Get Cursor
cur = conn.cursor()


def log_db(temp, hum):
    try:
        cur.execute(
            "INSERT INTO messungen (zeit,temperatur, luftfeuchtigkeit) VALUES (CURRENT_TIMESTAMP , ?, ?)",
            (temp, hum))
        conn.commit()
    except e:
        print(f"Mariadb Error: {e}")


while True:
    try:
        # Print the values to the serial port
        temperature_c = dhtDevice.temperature
        temperature_f = temperature_c * (9 / 5) + 32
        humidity = dhtDevice.humidity
        log_db(temperature_c, humidity)
        #print(
        #    "Temp: {:.1f} F / {:.1f} C    Humidity: {}% ".format(
        #        temperature_f, temperature_c, humidity
        #    )
        #)

    except RuntimeError as error:
        # Errors happen fairly often, DHT's are hard to read, just keep going
        #print("Error " + error.args[0])
        time.sleep(2.0)
        continue
    except Exception as error:
        dhtDevice.exit()
        raise error

    time.sleep(3.0)

