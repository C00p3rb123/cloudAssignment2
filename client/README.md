docker build --push -t pondpiu/cipher .

docker run --name client -p 80:3000 --env-file .env -dit --restart unless-stopped pondpiu/cipher
