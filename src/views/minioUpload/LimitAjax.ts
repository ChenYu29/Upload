/**
 *@description
 *@author cy
 *@date 2022-10-20 09:52
 **/

export class LimitRequest {
  private limit: number = 1; // 限制并发数量
  private currentSum: number = 0; // 当前发送数量
  private requests: Array<any> = []; // 请求
  constructor(limit: number) {
    this.limit = limit
    this.currentSum = 0
    this.requests = []
  }

  public request (reqFn: Function) {
    if (!reqFn || !(reqFn instanceof Function)) {
      console.error('当前请求不是一个Function', reqFn)
      return
    }
    this.requests.push(reqFn)
    if (this.currentSum < this.limit) {
      this.run()
    }
  }

  async run() {
    // if (this.requests.length > 0 && this.currentSum < this.limit) {
    //   // const fn = this.requests.shift();
    //   ++this.currentSum;
    //   console.log('开始开始', this.currentSum, this.requests.length);
    //   this.requests[0]().then((res: any) => {
    //     this.requests.shift()
    //     --this.currentSum;
    //     console.log('请求结束', this.currentSum, this.requests.length);
    //   });
    // }
    try {
      ++this.currentSum
      const fn = this.requests.shift();
      console.log('开始开始', this.currentSum, this.requests.length);
      await fn()
    } catch(err) {
      console.log('Error', err)
    } finally {
      --this.currentSum
      if (this.requests.length > 0) {
        this.run()
      }
    }
  }
}