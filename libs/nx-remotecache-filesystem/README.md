# nx-remotecache-filesystem

A task runner for [@nrwl/nx](https://nx.dev/) that uses an filesystem location as a remote cache.

## Setup

```
npm install --save-dev @stixx200/nx-remotecache-filesystem
```

| Parameter      | Description                                                             | Environment Variable / .env  | `nx.json`       |
|----------------|-------------------------------------------------------------------------|------------------------------|-----------------|
| Cache Location | Target cache location                                                   | `NX_CACHE_FS_CACHE_LOCATION` | `cacheLocation` |
| Chmod          | Run chmod after creating the target cache file on it. Provide a number. | `NX_CACHE_FS_CHMOD`          | `chmod`         |
| Config File    | Provide a js file which exports a configuration.                        | -                            | `configFile`    |

```json
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx-remotecache-filesystem",
      "options": {
        "cacheLocation": "/mnt/shared-cache",
        "chmod": 255
      }
    }
  }
}
```
