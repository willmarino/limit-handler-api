

## Limit Handler Backend Application
This express server receives and processes request data from clients using the limit-handler-client npm package.


### Database Schema
* **subscription_tiers** - Representations of the level of subscription which an organization is using. (i.e. free, regular, premium, ...).
* **organizations** - Umbrellas for groups of members working together.
* **subscriptions** - An owning of a subscription tier by organizations, only one can be active per org at once.
* **users** - Representations of users.
* **memberships** - A belonging of a user to an organization, a user can belong to many organizations.



## Web - Important Features
The web API handles request/response flows for the Limit Handler website, serving html pages using Pug and HTMX. Users can do the following:
* Register, login, and logout
* Create, join, or leave an organization
* Manage other members within an organization
* Manage a subscription plan for an organization

### Auth Flow
* The subrouters attached to the web api can be divided into two main groups. One handles unauthenticated requests, `src/routers/web/auth.js` , and the other handles authenticated requests, `src/routers/web/main.js`.
* If a request from an already authenticated user is sent to a path managed by the auth router, that request is redirected to the main lobby page.
* If a request from an unauthenticated user is sent to a path managed by the main router, that request is redirected to the login page.
* User session information is stored in a cookie using the `cookie-session` npm library. Picked this over `express-session` to avoid maintaining a redis or mysql based session store, which is unnecessary due to the very small amount of session data I need to store.


### Icons Attribution
[Gear Icon](https://freeicons.io/free-setting-and-configuration-icons/gear-settings-setting-wheel-icon-9576)