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

    test('search test', () => {
        const filter: filterDto[] = [
            {
                "name": "text",
                "value": "zero2hero metaverse events",
                "operator": ENUM_FILTER_OPERATOR_TYPE.search,
                arr_value: null,
                mode: null
            }
        ]

        const fr = generatePaginationFilter(filter)
        expect(fr).toEqual({
            '$text': { '$search': 'zero2hero metaverse events' }
        });
    });

    test('like regex on multible fields test', () => {
        const filter: filterDto[] = [
            {
                "name": "groupName",
                "value": "test.*test.*details.*details",
                "operator": ENUM_FILTER_OPERATOR_TYPE.like,
                arr_value: null,
                "mode": "bnm"
            },
            {
                "name": "groupDetails.groupDetails",
                "value": "test.*test.*details.*details",
                "operator": ENUM_FILTER_OPERATOR_TYPE.like,
                arr_value: null,
                "mode": "bnm"
            }
        ]

        const fr = generatePaginationFilter(filter)
        expect(fr).toEqual({
            '$or': [{
                "groupName": /.*test.*test.*details.*details.*/i,
            },
            {
                "groupDetails.groupDetails": /.*test.*test.*details.*details.*/i,
            }],
        });
    });

});