/**
 * @description Helper function which enables creation of hashes based on arrays with less lines of code in business logic.
 * Give this function an attribute (contained by all objects in the array) to use as a hash key,
 * and whether or not multiple objects will have the same value for this key.
 * @param keyParam - String which matches the attribute name (of the objects in the array) which we want to use as hash keys.
 * @param isGroupBy - Should the hash have values of single objects, or arrays of objects?
 */
Array.prototype.toHash = function(keyParam, isGroupBy=false){
    const hash = {};
    for(let i = 0; i < this.length; i++){
        const curElement = this[i];
        if(isGroupBy){
            if(hash[curElement[keyParam]]){
                hash[curElement[keyParam]].push(curElement);
            }else{
                hash[curElement[keyParam]] = [ curElement ];
            }
        }else{
            hash[curElement[keyParam]] = curElement;
        }
    }

    return hash;
};