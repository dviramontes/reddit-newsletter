# `reddit-newsletter/API`

The following API usage examples assume [httpie](https://httpie.io/) but `curl` or `wget` works just as well

### Healthcheck
```shell
http GET 'http://localhost:4000/ping'
```

### Users


#### List all users

```shell
http GET 'http://localhost:4000/api/users'
```

#### Get user by id

```shell
http GET 'http://localhost:4000/api/users/1'
```

#### Deleting a user by id

```shell
http DELETE 'http://localhost:4000/api/users/1'
```

#### Create new user

```shell
http --json POST 'http://localhost:4000/api/users' \
'Content-Type':'application/json; charset=utf-8' \
email="maria@service.com" \
fullname="maria" \
time_preference="7"
```

#### Update user

```shell
http --json PATCH 'http://localhost:4000/api/users/1' \
'Content-Type':'application/json; charset=utf-8' \
email="email@service.com" \
active="true" \
time_preference="1" \
fullname="foobar"
```

### Subscriptions

#### List all subscriptions
```shell
http GET 'http://localhost:4000/api/subscriptions'
```

#### Upsert subscription
```shell
http --json POST 'http://localhost:4000/api/users/1/subs' \
'Content-Type':'application/json; charset=utf-8' \
url="https://www.reddit.com/r/A/" \
subreddit="A"
```

### Subredits

#### List all subreddits
```shell
http GET 'http://localhost:4000/api/subreddits'
```
