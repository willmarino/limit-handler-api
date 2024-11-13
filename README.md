

## Limit Handler Backend Application
This express server receives and processes request data from clients using the limit-handler-client npm package.

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

### User Lobby
Shows information on users, organizations the user is a part of, and projects the organization owns. Will only show one organization and project at a time, which the user can change via dropdowns. The organization information display will show the user's teammates and their corresponding access levels, and will prompt the user to create an organization if they do not belong to any yet. The project information display will show the number of requests made by any program configure with the project over time (adjustable) via a line chart.

### Organization Creation
Simple form which lets the user choose a name and a subscription tier for their organization. If the Basic subscription tier is selected, no payment info is needed.




### Database Schema
* **subscription_tiers** - Type of subscription which an organization is using. (i.e. basic, advanced, premium, ...).
* **organizations** - Umbrellas for groups of members working together.
* **subscriptions** - An owning of a subscription tier by organizations, only one can be active per org at once.
* **users** - Representations of users.
* **memberships** - A belonging of a user to an organization, a user can belong to many organizations.
* **projects** - A representation of the project into which limit handler is being integrated. Projects belong to organizations, and are created by a specific user.
* **timeframe** - A unit of time for which limit handler allows `projects.callLimit` requests to pass through to the third party API the end user (developer) is writing a program against.
* **sessions** - Tracking of logins by users, essentially just a timestamp at this point.




### Req context middleware
* Site messages (from dev to user) are pulled from request query and put into request context for availability in router and service functions.

### Design Tools
[Color Blending](https://meyerweb.com/eric/tools/color-blend/#121212:FFFFFF:5:hex)
[Hex to RGBA](https://rgbacolorpicker.com/hex-to-rgba)

### Design Inspiration
[Material Design Dark Theme](https://m2.material.io/design/color/dark-theme.html)
[Linear](https://linear.app/login)
[Radix UI](https://www.radix-ui.com/)
[Github](https://github.com)

### Icons Attribution
[Gear Icon](https://freeicons.io/free-setting-and-configuration-icons/gear-settings-setting-wheel-icon-9576)
[Clock logo by dmitri13](https://www.freepik.com/icon/clock_992700#fromView=search&page=1&position=0&uuid=4a031b8f-ce83-4210-9f6f-9c55ad09d887)
[Empty Inbox](https://www.flaticon.com/free-icon/no-results_5058046?term=empty&page=1&position=15&origin=tag&related_id=5058046)