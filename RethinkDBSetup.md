## Downloading rethinkDB
----
[logo]: https://platzi.com/blog/content/images/2015/03/rethinkdb.png
![alt text][logo]


[Click here => to install](https://www.rethinkdb.com)

Rethink is pretty straight forward. Just select your operating system and follow their markdown on how to install.

I used homebrew with my Mac, variations may apply. If you have a Mac, I recommend installing Homewbrew and following my steps otherwise follow rethinkDB's instructions.

**Version** 2.2.5
```sh
brew update && brew install rethinkdb
```

Now is time to start downloading your client drivers. Choose whichever you prefer. My team used Node.js 

[Click here to go to Node.js rethinkDBdash install](https://github.com/neumino/rethinkdbdash)

Open up a terminal

```sh
rethinkdb
```
RethinkDB should be running on your system.

Your default port is 8080. This can be changed but for now leave it as so.

Go to your address bar and type in "localhost:8080" Or just be lazy and click this => [localhost:8080](http://localhost:8080)

You should be able to see the RethinkDB dashboard spreading out all the information needed to start your server.
[RethinkDash](http://i.imgur.com/BCpcIwg.png)

Go to the Data Explorer tab and start Creating and Querying data to and from rethinkDB. Stop the database on the terminal to finish your work.

*We use rethinkDB because it pushes realtime JSON at a scalable rate. Carry is going to be pushing a lot of analytical data in a particular time period and rethinkDB is, safe to say, more than capable to handle this.*