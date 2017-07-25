// import { Observable } from 'rxjs/Observable';
//
// declare module 'rxjs/Observable' {
//   interface Observable<T> {
//     [Symbol.asyncIterator](): AsyncIterator<T>;
//   }
// }
//
// class Deferred<T> extends Promise<T> {
//   resolve;
//   reject;
//
//   constructor() {
//     let a, b;
//     super((resolve, reject) => {
//       a = resolve;
//       b = reject;
//     });
//     this.resolve = a;
//     this.reject = b;
//   }
// }
//
// Observable.prototype[Symbol.asyncIterator] = async function*() {
//
//   let deferred = new Deferred();
//   const completed = Symbol('completed');
//
//   this.subscribe({
//     next(value){
//       deferred.resolve(value);
//     },
//     error(error){
//       deferred.reject(error);
//     },
//     complete() {
//       deferred.resolve(completed);
//     },
//   });
//
//   let value;
//   while ((value = await deferred) != completed) {
//     deferred = new Deferred();
//     yield value;
//   }
// };
