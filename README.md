

## Limit Handler Backend Application
This express server receives and processes request data from clients using the limit-handler-client npm package.


### Database Schema
* **subscription_tiers** - Representations of the level of subscription which an organization is using. (i.e. free, regular, premium, ...).
* **organizations** - Umbrellas for groups of members working together.
* **subscriptions** - An owning of a subscription tier by organizations, only one can be active per org at once.
* **users** - Representations of users.
* **memberships** - A belonging of a user to an organization, a user can belong to many organizations.