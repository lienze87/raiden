# JavaScript Trick

### 将数字转换为千分位
```js
   '12345'.match(/.{1,3}/g).join(',') // '123,45'
```
### 为日期或月份字符串添加前缀0
```js
   const newMonth = ('0' + month).slice(-2) 
```
### 去除数字字符串的前缀0
```js
   '012345'.replace(/^0+/, '') // '12345'
```
