# Nutri Track

### Install `mkcert` 
On mac, you can install it using `brew install mkcert`
On windows, you can install it using `choco install mkcert`
For more: https://github.com/FiloSottile/mkcert?tab=readme-ov-file#installation

### Generate SSL Certificate

```bash
mkdir keys
mkcert -key-file keys/localhost-key.pem -cert-file keys/localhost-cert.pem 192.168.0.104
```
> Note you can use `localhost` or your local ip address instead of `192.168.0.104` 