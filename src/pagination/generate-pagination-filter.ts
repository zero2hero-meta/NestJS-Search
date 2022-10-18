import { filterDto } from './pagination.dto'
import { generateMongoFilterKeyName } from '../common/generate-mongo-filter-key-name'

/**
 * @param  {filterDto[]} filter
 */

export const generatePaginationFilter = (filter: filterDto[]) => {
    const filter_fn = {}
    for (const filterElement of filter) {
        if (filterElement instanceof filterDto) {
            // console.log('instanceof filterDto')
            // console.log('filterElement: ', filterElement)
            if (filterElement.operator === 'regex') {
                let exp = new RegExp(filterElement.value, 'i')
                if (filterElement.mode === 'swm') {
                    exp = new RegExp('^' + filterElement.value + '.*', 'i')
                }
                if (filterElement.mode === 'bnm') {
                    exp = new RegExp('.*' + filterElement.value + '.*', 'i')
                }
                if (filterElement.mode === 'ewm') {
                    // console.log('EWM\n');
                    exp = new RegExp(filterElement.value + '.*', 'i')
                }
                filter_fn[generateMongoFilterKeyName(filterElement.name)] = {
                    ['$' + filterElement.operator]: exp
                }
            } else if (filterElement.operator === 'in' || filterElement.operator === 'nin') {
                filter_fn[generateMongoFilterKeyName(filterElement.name)] = {
                    ['$' + filterElement.operator]: filterElement.arr_value
                }
            } else if (filterElement.operator === 'between') {
                filter_fn[generateMongoFilterKeyName(filterElement.name)] = {
                    ['$' + filterElement.operator]: { ['$gte']: filterElement.arr_value[0], ['$lte']: filterElement.arr_value[1] }
                }
            } else
                filter_fn[generateMongoFilterKeyName(filterElement.name)] = {
                    ['$' + filterElement.operator]: filterElement.value
                }
        } else {
            console.warn('filterElement must be instance of filterDto')
            console.warn('filterElement:\n', filterElement)
        }
    }
    return filter_fn
}
