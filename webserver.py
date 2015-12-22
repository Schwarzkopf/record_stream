import string,cgi,time
from os import curdir, sep
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer

import ssl
import json
import urlparse

from thread import start_new_thread
import os
import threading

def worker(cmd):
	print cmd
	os.system(cmd.encode('utf-8'))


class MyHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        try:

	    if "amazon_music.html" in self.path:
		self.send_response(200)
                self.send_header('Content-type','text/html')
                self.end_headers()
		#self.wfile.write("success")
		par = urlparse.parse_qs(urlparse.urlparse(self.path).query)

		if 'music_data' not in par.keys():
			return 

		data = par['music_data']
		if len(data) != 1:
			return 

		print data[0]
		parsed_json = json.loads(data[0])
		print parsed_json['artist'] + " " + parsed_json['album'] + " " + parsed_json['title'] 
	
		cmd = './record_mp3.sh '
		if len( parsed_json['artist']) > 0 and len( parsed_json['album']) > 0:
			cmd = cmd + '"'+ parsed_json['artist'].replace("/", "_")+'" "'+parsed_json['album'].replace("/", "_")+'" "'+parsed_json['title'].replace("/", "_")+'"'

		start_new_thread(worker,(cmd,))

            return
                
        except IOError:
            self.send_error(404,'File Not Found: %s' % self.path)
     


def main():
    try:
	
        server = HTTPServer(('', 8080), MyHandler)
        print 'started httpserver...'
	server.socket = ssl.wrap_socket (server.socket, keyfile='server.key', certfile='server.crt', server_side=True)
        server.serve_forever()

    except KeyboardInterrupt:
        print '^C received, shutting down server'
        server.socket.close()
	

if __name__ == '__main__':
    main()
