// 类型注解
// let var1: string;
// var1 = 'foo';
// var1 = 123; error

//类型推论
// let var2 = true;
// var2 = 1; 会判断为布尔值
// var2 = false;

// 原始类型: string, number, boolean, undefined, null, symbol

// 联合类型
// let var3: string | undefined;
// var3 = undefined;

// 类型数组
// let arr: string[];
// arr = ['foo']

// 任意类型
// let arrAny: any;
// arrAny = [1, true, 'free'];
// arrAny[1] = 100;

// 函数类型约束
function greet(person: string): string{
    return 'hello, '+ person
}

const msg = greet('tom')

// void 类型 没有返回值
function warn():void{

}

// 对象object,不是原始类型的就是对象类型
function fn1(o:object){

}
fn1({prop:1})
// fn1(null) null是原始类型

// 正确的写法
function fn2(o:{prop:number}){

}
fn2({prop:1}) // 尽可能的声明结果
// fn2({props:'1'})

// 类型别名 type
type Prop = {prop: number} & {foo:string}
// 等同于fn2
function fn3(o:Prop) {

}
fn3({prop:1,foo:'123'}) // 尽可能的声明结果
type Prop1 = {prop: number, foo:string}
// 等同于fn2
function fn4(o:Prop1) {

}
fn4({prop:1,foo:'123'}) // 尽可能的声明结果

// type和接口interface的区别,基本完全相同,只在很少兼容性上不同
// type更简洁一些

// 类型断言
const someValue: any = 'this is a string'
// someValue.length // 属性无法保证 运行时会有报错的可能
const strLen = (someValue as string).length // 属性无法保证 运行时会有报错的可能

// 联合类型 相当于或语句
let union:string | number;
union = '1'
union = 1

// 交叉类型
type First = { first:number };
type Second = { second:number };
// 扩展新的type
type FirstAndSecond = First & Second

//type可以用来对入参和返回值的限制
function fn5(params: FirstAndSecond): FirstAndSecond {
    return params
}

// 函数
// ts和js的不同点
// 1.设置了就是必填参数
// 2.可选默认值
// 3.可选参位置在后
function greeting(person: string, msg1?:string, msg = 'abc'):string {
    return ''
}
greeting('')

// 4.函数重载: 场景主要是源码和框架, 函数用参数个数 类型或者返回值类型区分同名函数
// 先声明(类似于函数签名) 再实现
// 同名声明有多个 但其实只声明一个函数 声明的是多个结构
function watch(cb1: () => void): void;
function watch(cb1: () => void, cb2: (v1:any,v2:any) => void): void;
// 实现
function watch(cb1: () => void, cb2?: (v1:any,v2:any) => void) {
    if(cb1 && cb2){
        console.log('执行重载2')
    }else{
        console.log('执行重载1')
    }
}

// watch();

// 类
class Parent {
  private _foo = "foo"; // 私有属性，不能在类的外部访问
  protected bar = "bar"; // 保护属性，可以在子类中访问 不能在外部访问

  // 参数属性：构造函数参数加修饰符，能够定义为成员属性
  // 利用了类型推论
  constructor(public tua = "tua") {}

  // 方法也有修饰符
  private someMethod() {}

  // 存取器：属性方式访问，可添加额外逻辑，控制读写性
  // 可用于计算属性
  get foo() {
    return this._foo;
  }
  set foo(val) {
    this._foo = val;
  }
}

const p = new Parent()
p.foo// 可以通过存取器访问私有变量
p.tua

class Child extends Parent {
    say() {
        this.bar
    }
}

const c = new Child()
p.foo// 可以访问私有变量
// p.bar 只能在子类中访问私有变量 不能通过子类实例访问私有变量

// 接口interface
interface Person {
  firstName: string;
  lastName: string;
}
// greeting函数通过Person接口约束参数解构
function greeting2(person: Person) {
  return "Hello, " + person.firstName + " " + person.lastName;
}
greeting2({ firstName: "Jane", lastName: "User" }); // 正确
// greeting2({firstName: 'Jane'}); // 错误
// 接口同样可以用在入参和返回值
function greeting3(person: Person):Person {
  return person;
}
greeting3({ firstName: "Jane", lastName: "User" }); // 正确

// 泛型 Generice
//指在定义函数 接口或类的时候, 不预先执行具体类型, 而在使用的时候再指定类型的一种特性,以此增加代码通用性

// 不用泛型
// interface Result {
//   ok: 0 | 1;
//   data: Feature[];
// }
// 使用泛型 T表示是动态类型 是动态赋值 增强灵活性 复用性
interface Result<T> {
  ok: 0 | 1;
  data: T;
}

//泛型方法
function getResult<T>(data: T): Result<T> {
  return {ok:1, data}
}

// 调用时指定泛型类型
getResult<string>('hello');
getResult(1);

// 装饰器原理

// 类装饰器参数只有一个就是类构造函数
// 类装饰器表达式会在运行时当作函数被调用，类的构造函数作为其唯一的参数。
function log(target: Function) {
  console.log(target === Foo)
  target.prototype.log = function() {
    console.log(this.bar)
  }
}

// 方法装饰器有三个参数: 1.实例 2.修饰的方法名 3.属性描述符对象
function dong(target: any, name: string, descriptor: any) {
  console.log(target, name, descriptor);

  // 这里通过修改descriptor.value扩展了bar方法
  const baz = descriptor.value;
  descriptor.value = function(val: string){
    console.log('dong')
    // 原始逻辑
    baz.call(this, val);
  }
}


// 如果包一层, 可以传递配置对象进来, 更加灵活
// 属性装饰器 option 调用方法时入参
function mua(option: string){
  // 返回的才是装饰器函数
  // 接收两个参数 1.实例 2.属性名
  return function (target, name) {
    target[name] = option
  }
}





@log
class Foo {
  bar = 'bar';

  @mua('mua~~')
  ns!:string;

  @dong
  setBar(val: string) {
    this.bar = val
  }
}

const foo = new Foo();
// @ts-ignore
foo.log();
foo.setBar('123');










