# Javascript trick

### 将数字转换为千分位
```javascript
   '12345'.match(/.{1,3}/g).join(',') // '123,45'
```
