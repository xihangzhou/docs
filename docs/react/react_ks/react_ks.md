# react_ks

## Guidance

### react简单的基本概念理解

* react是什么

  ​	js库

* 组件是什么？

  ​	是UI的逻辑功能抽象

* 组件在react中的表现形式？

```js
class ShoppingList extends React.Component {
  render() {
    return (
      <div className="shopping-list">
        <h1>Shopping List for {this.props.name}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}

// 用法示例: <ShoppingList name="Mark" />
```

组件在react中以一个类的形式呈现，并且接收一些参数props(properties)，其中这个类的render方法返回最后的渲染结果。

这种js中嵌套html的方式被称为**JSX**(JavaScriptXml)语法。

最后就可以通过\<ShoppingList />的方式来进行这个组件的使用

### 游戏的开发步骤

* 通过props从 Board 组件传递到 Square 组件数据

![image-20210504151803887](react_ks.assets/image-20210504151803887.png)

* 