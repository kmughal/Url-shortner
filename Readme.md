# Introduction

A simple Url shortener application made using Deno.

In order to run the application. Open command prompt and run

```

run.bat
```

This will run the Deno server by default it will listen to port 3000.


Now setup Nginx in your local machine. 

You have to change the nginx.config file. Locate the server section and add the following lines.

```
        listen 9000;
        server_name  localhost;
      
        location ~* "^/(.*)$"  {
            rewrite  ^/(.*)$ http://localhost:3000/$1 permanent;
        }
```

This means that any request pointing to 9000 will be redirected to 3000 where your Deno shortner application is running.

This is using MongoDb to store the url and shortner url. In order to generate a shortner use the following end point assuming that your application is running on 3000.

````
http://localhost:3000/generate-url-shortner?url=http://www.bbc.com/news/uk&shortner=uknews

````

Now open a new browser tab after creating this short url and type 

```
http://localhost:9000/uknews
```

This will redirect you from Nginx -> Deno server (which is listening on 3000) -> bbc uk news!

Some commands for troubleshot if you are using windows for nginx are:


```
TASKKILL /F /IM "nginx*"

tasklist /fi "imagename eq nginx.exe"

```