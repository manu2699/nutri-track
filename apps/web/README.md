# Nutri Track

### Install `mkcert` 
On mac, you can install it using `brew install mkcert`
On windows, you can install it using `choco install mkcert`
For more: https://github.com/FiloSottile/mkcert?tab=readme-ov-file#installation

### Generate SSL Certificate
Replace `192.168.0.102` with your local IP address & also on `vite.config.ts`
```bash
mkdir keys && mkcert -key-file keys/192.168.0.102-key.pem -cert-file keys/192.168.0.102-cert.pem 192.168.0.102
```