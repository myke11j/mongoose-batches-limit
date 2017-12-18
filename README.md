# mongoose-batches-limit
Find mongoose docs in batches with limit option

This package is based on [mongoose-batches](https://github.com/charliemitchell/mongoose-batches).

# Intsall

```
npm i --s mongoose-batches-limit
```

Usage is similiar to this https://github.com/charliemitchell/mongoose-batches/blob/master/README.md

The only difference is that you can also pass limit field in options now.

```
const query = {};
const options = {
    batchSize : 1000,
    limit: 100000
};

// name of function here is findInBatches2
myModel.findInBatches2(query, options, (err, docs, next) => {
 //.. Do stuff
 next();
}).then(function () {
  // All done
});
```

# Future work

Soon, I will be adding sort option in it.