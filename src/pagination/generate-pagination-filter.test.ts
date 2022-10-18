import 'reflect-metadata'
import { ENUM_FILTER_OPERATOR_TYPE } from "../common.types";
import { generatePaginationFilter } from "./generate-pagination-filter";
import { filterDto } from "./pagination.dto";

describe('pagination filter tests', () => {
    test('between test', () => {
        const filter: filterDto[] = [
            {
                "name": "schedule.eventStartDateTime",
                "arr_value": ["2032-12-15", "2032-12-15"],
                "operator": ENUM_FILTER_OPERATOR_TYPE.between,
                value: null,
                mode: null
            }
        ]

        const fr = generatePaginationFilter(filter)
        expect(fr).toEqual({
            'schedule.eventStartDateTime': { '$gte': '2032-12-15', '$lte': '2032-12-15' }
        });
    });
});