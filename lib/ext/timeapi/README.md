# Simple Time API

While looking for a decent REST API to get the current time it became apparent there was no suitable service online.

This API is very simple, and the code is incredibly short. It returns the current time in UTC, the UNIX epoch, and if requested the localtime of a specified timezone.

## Request Format

#### `/api/time`

```json
{"utc":"2018-06-23T20:17:54+00:00","epoch":1529785074066}
```

#### `/api/time/<timezone>`

Accepts standard timezone identifiers. You can find the list here: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

```js
/api/time/America/Los_Angeles
{"tz":"America\/Los_Angeles","localtime":"2018-06-23T13:20:41-07:00","utc":"2018-06-23T20:20:41+00:00","epoch":1529785241071}
```
