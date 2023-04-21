// @see https://juejin.cn/post/7219961144584552504

function run(item, runAfterEnd) {
    let result = null
    let error = null
    item()
        .then((data) => (result = data))
        .catch((err) => (error = err))
        .finally(() => runAfterEnd(result, error))
}

function sendRequest(queue, limit, callback) {
    // 记录请求结果
    const results = []
    // 当前执行队列
    const runQueue = []
    const newQueue = queue.map((e, i) => {
        return () => {
            const runAfterEnd = (result, error) => {
                // 保存当前请求结果
                results.push([result, error, i])
                // 刷新队列,用新请求替换已经完成的请求
                if (newQueue.length > 0) {
                    // 获取新请求
                    const nextItem = newQueue.shift()
                } else {
                    // 队列已经清空，让我们开始等待所有请求结束
                    if (queue.length === results.length) {
                        // 请求全部完成，让我们开始执行callback
                        const newResults = runQueue.map((e, i) => e.push(i))
                        // 按传入顺序执行一次排序
                        newResults.sort((a, b) => a[2] - b[2])
                        // 执行回调
                        callback(newResults)
                    }
                }
            }
            return run(e, runAfterEnd)
        }
    })
}
