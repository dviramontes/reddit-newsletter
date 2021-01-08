# `reddit-newsletter`

> daily personalized reddit newsletters in your inbox 

### Project Layout

```
{root}

// TODO
```

### Requirements

- Node >= 12
- Docker

### Setup

#### create alias for docker mac
- `sudo ifconfig lo0 alias 10.254.254.254`

#### or linux
- `sudo apt-get install net-tools -y`
- `sudo ifconfig lo:0 10.254.254.254.254`


### Development

- `make dcu`
- `npm run dev`

other dev tasks

- `npm run format` lints code using prettier

### Testing

- TODO

### Production

- `npm run build`
