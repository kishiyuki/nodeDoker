git cloneし、
```
docker-compose up -d --build
```
次に
```
docker-compose exec iost bash
```
でiostに入り
```
iwallet account import admin 2yquS3ySrGWPEKywCPzX4RTJugqRh7kJSo5aehsLYPEWkUxBWA39oMrZ7ZxuM4fgyXYs2cPwh5n8aNNpH5x2VyK1
cd contracts
```
その後
```
iwallet --account admin --chain_id=1020 publish Contract.js Contract.js.abi
```
このかコマンドはエラーが出ることがあるが再現性のないエラーのため何度か試すと成功する.
成功したら、ターミナルの最後の行
```
The contract id is:~~~
```
のis:より右をコピーし、
```
exit
```
dockerのiost環境を出る
ダウンロードしたファイルのsrc/内の  
app.jsの26行目の''の間にコピーしたものをペーストし保存

```
docker-compose restart app
```
リスタートをかける
```
docker-compose logs app
```
少し待ち上のコマンドでserverが立ち上がったのちに
```
curl -X POST -H "Content-Type: application/json" -d '{"action":"4", "think":"4", "team":"4", "comments":"", "event_id":"4", "receiver_id":"3", "free":"", "email":"teacher1@mail.com"}' localhost:3000/evaluate
```
curlするとstatus200のレスポンスが帰ってくる

```
docker-compose logs app
```
これでsuccessと書かれていたら評価の送信ができている
