# JavaScript Trick

### 将数字转换为千分位
```js
   '12345'.match(/.{1,3}/g).join(',') // '123,45'
```
### 在日期或月份前补0
```js
   const newMonth = ('0' + month).slice(-2) 
```
