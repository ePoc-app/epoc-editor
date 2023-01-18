/**
 * Wait for all promise to have resolve
 * @param promises
 * @returns {Promise<Awaited<unknown>[]>}
 */
module.exports.waitAll = function (promises) {
    return Promise.all(promises)
}

/**
 * Wait a certain amount of time (in milliseconds)
 * @param {number} ms
 * @returns {Promise<unknown>}
 */
module.exports.wait = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Converts an event listener that fire once to a promise
 * @param target Element on which to add the listener
 * @param event Event name
 * @returns {Promise<unknown>}
 */
module.exports.waitEvent = function (target, event) {
    return new Promise((resolve) => {
        target.once(event, () => {
            resolve()
        })
    })
}