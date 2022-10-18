<div align=center>

# NestJS-Search

Search package for NestJS with MongoDb and AWS DocumentDB

PS, It is a copy of Nestjs-Keyset-Paginator, was added new features(i.e. between was added)

</div>

## Installation

Use the package manager [npm](npmjs.com/package/nestjs-keyset-paginator) to install Nestjs-Keyset-Paginator.

```bash
npm i nestjs-keyset-paginator
```

## Usage

-   In example.controller.ts use PaginationDto to Validate params and pass it to service.

```typescript
import { PaginationDto, projectionDto } from 'nestjs-keyset-paginator'

@Controller('example')
export class ExampleController {
    constructor(private readonly exampleService: ExampleService) {}

    @Get()
    findAll(@Body() params: PaginationDto) {
        return this.exampleService.findAll(
            params.skip,
            params.limit,
            params?.start_key,
            params?.sort?.field,
            params?.sort?.order,
            params?.filter,
            params?.projection
        )
    }
}
```

-   Then in example.service.ts pass those params to "paginate()" along with you model (Mongoose Model).

```typescript
import paginate, { filterDto, projectionDto } from 'nestjs-keyset-paginator'

@Injectable()
export class ExampleService {
    constructor(
        @Inject(EXAMPLE_MODEL)
        private readonly exampleModel: Model<ExampleDocument>
    ) {}

    async findAll(
        skip = 0,
        limit = 10,
        start_key?,
        sort_field?: string,
        sort_order?: number,
        filter?: filterDto[],
        projection?: projectionDto[]
    ) {
        return paginate(this.exampleModel, skip, limit, start_key, sort_field, sort_order, filter, projection)
    }
}
```

-   Paginate function will return with promise of:

```
{ docs: docs, next_key }
```

---

## Example param

Example:-

```json
{
    "filter": [
        {
            "name": "score",
            "value": 400,
            "operator": "lt"
        },
        {
            "name": "isPassed",
            "value": true,
            "operator": "eq"
        },
        {
            "name": ["outer_field_name", "inner_field_name"],
            "value": "user one",
            "operator": "eq"
        },
        {
            "name": "time",
            "arr_value": [40, 60],
            "operator": "in"
        },
        {
            "name": "left_count",
            "arr_value": [0, 1],
            "operator": "nin"
        }
    ],
    "sort": {
        "field": "score",
        "order": 1
    },
    "projection": [
        {
            "name": "password",
            "mode": 0
        }
    ],
    "limit": 4
}
```

Please note: for the same same field, when you use "lt" and "gt" filters at the same time, the filters overriding each other, instead please use "between" as follows.

Example: between

```json
{
    "filter": [
        {
            "name": "eventStartDateTime",
            "arr_value": ["2021-11-16", "2021-11-17"],
            "operator": "between"
        }
    ]
}
```

or any other ISODate

```json
{
    "filter": [
        {
            "name": "eventStartDateTime",
            "arr_value": ["2021-11-16T11:30:01.001+00:00", "2021-11-17T11:30:01.001+00:00"],
            "operator": "between"
        }
    ]
}
```

Example: in

```json
{
    "filter": [
        {
            "name": "eventCategory",
            "arr_value": ["sport", "training"],
            "operator": "in"
        }
    ]
}
```

-   As response, you will also get "next_key".

Example:

```json
{
    "next_key": [
        {
            "key": "_id",
            "value": "61a4c444f9534392c70afaf6"
        },
        {
            "key": "score",
            "value": 100
        }
    ]
}
```

-   To get next page use this "next_key" object as "start_key" in next request.

Example:

```json
{
    "filter": [
        {
            "name": "score",
            "value": 400,
            "operator": "lt"
        },
        {
            "name": "isPassed",
            "value": true,
            "operator": "eq"
        }
    ],
    "sort": {
        "field": "score",
        "order": 1
    },
    "limit": 4,
    "start_key": [
        {
            "key": "_id",
            "value": "61a4c444f9534392c70afaf6"
        },
        {
            "key": "score",
            "value": 100
        }
    ]
}
```

-   If you provide "start_key" this will skip previous Documents.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate if applicable.

## License

[MIT](https://choosealicense.com/licenses/mit/)
