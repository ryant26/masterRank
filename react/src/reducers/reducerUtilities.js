export const arrayHasDuplicate = function(array, item, ...comparators) {

    for (let i = 0; i < array.length; i++) {
        let duplicate = true;
        comparators.forEach((comparator) => {
            if (item[comparator] !== array[i][comparator]) {
                duplicate = false;
            }
        });

        if (duplicate) {
            return true;
        }
    }

    return false;
};