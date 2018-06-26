# Simple Time API

While looking for a decent REST API to get the current time it became apparent there was no suitable service online.

This API is very simple, and the code is incredibly short. It returns the current time in UTC, the UNIX epoch, and if requested the localtime of a specified timezone. The output format is JSON.

## Requirements

1. Apache 2.2+ (for mod_rewrite rules; any web server will do if you can setup url rewriting)  
1. PHP5+

## Request Format

#### **/api/time**

```json
{
    "date": "2018-06-24T06:12:20+00:00",
    "epoch": 1529820740545
}
```

#### **/api/time/$timezone**

Accepts standard timezone identifiers. You can find the list here: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

```js
/api/time/America/Los_Angeles
{
    "tz": "America\/Los_Angeles",
    "localtime": 1529820864740,
    "localdate": "2018-06-23T23:14:24-07:00",
    "date": "2018-06-24T06:14:24+00:00",
    "epoch": 1529820864740,
    "offset": 0
}
```

#### **/api/time/$epoch**

Accepts a UNIX epoch in seconds or milliseconds and returns the corresponding date.

```js
/api/time/1429789373085
{
    "tz": "UTC",
    "localtime": "1429789373085",
    "localdate": "2015-04-23T11:42:53+00:00",
    "date": "2018-06-24T06:14:37+00:00",
    "epoch": 1529820877712,
    "offset": 100031504627
}
```

#### **/api/time/$epoch/$timezone**

Same as above but also accepts a timezone.

```js
/api/time/1429789373085/America/Los_Angeles
{
    "tz": "America\/Los_Angeles",
    "localtime": "1429789373085",
    "localdate": "2015-04-23T04:42:53-07:00",
    "date": "2018-06-24T06:14:56+00:00",
    "epoch": 1529820896570,
    "offset": 100031523485
}
```
