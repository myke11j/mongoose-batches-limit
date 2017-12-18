/**
 * @desc Find mongoose docs in batches with limit option
 * @author Mukul <@mukul1904>
 * @code https://github.com/myke11j/mongoose-batches-limit
 */

module.exports = function (schema) {
  const defaultOptions = {
      batchSize: 1000,
      limit: null
  };

  const options = function (opts) {
    for (let key in opts) {
      if (opts.hasOwnProperty(key)) {
        defaultOptions[key] = opts[key];
      }
    }
    return defaultOptions;
  };

  /**
   * @param {Object} find - mongo find query
   * @param {Object} opts - Options
   * @param {Number} opts.batchSize - batch size for finding docs
   * @param {Number} opts.limit - Limit for find query
   * @param {Object} opts.select - find query projection, if not provided then everything will be returned
   * @param {Function} batchHandler - callback function
   */
  schema.statics.findInBatches2 = schema.statics.findInBatches2 || function (find, opts, batchHandler) {
    find = (typeof find === 'object' && find) || {};
    opts = options(opts || {});
    const {
        select,
        limit
    } = opts;
    let batchSize = opts.batchSize;
    return new Promise((resolve) => {
      const query = this.find(find).limit(limit);
      this.find(find).limit(limit).count().exec((err, count) => {
        let documentsRemaining = count;
        const processBatch = (cancel) => {
          if (cancel === 'cancel') {
            return resolve();
          }
          if (documentsRemaining > 0) {
            if (documentsRemaining < batchSize) batchSize = documentsRemaining;
            return query.skip(count - documentsRemaining).limit(batchSize).select(select || '').exec((err2, docs) => {
              documentsRemaining += -1 * ((docs && docs.length) || batchSize);
              return batchHandler(err2, docs, processBatch, count, documentsRemaining);
            });
          }
          return resolve();
        };
        return processBatch();
      });
    });
  };
};