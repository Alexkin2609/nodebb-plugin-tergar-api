# `api/v1` Endpoints

**Note**: When requested with a master token, an additional parameter (`_uid`) is required in the data payload so the Write API can execute the requested action under the correct user context.

* `/api/v1`
    * `/users`
        * `POST /`
            * Creates a new user
            * **Requires**: `username` (In case it's taken, nodebb will append a number.)
            * **Accepts**: `password`, `email`
            * Any other data passed in will be saved into the user hash
        * `GET /:email`
            * Retrieves a user's uid by its email.
            * **Accepts**: `email`
    * `/groups`
        * `PUT /:slug/membership/:uid`
            * Adds a user to a group (The calling user has to be an administrator)
            * **Accepts**: No parameters
