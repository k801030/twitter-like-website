# twitter-like-website

This project is like twitter which is mainly for posts and comments.
It's developed with angularJS, nodeJS and mySQL DB.

It is a real-time app. (long-polling)
Client side pushes a request about 2 secs.
and Server side check the TIMESTAMP, deciding wihch data is required to send.
