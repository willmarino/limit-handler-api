
const dtFormatter = new Intl.DateTimeFormat('en-US', {
    year: "numeric", month: "short", weekday: "short", day: "numeric",
    hour: "numeric", minute: "numeric", timeZone: 'America/New_York',
})


const viewAttrs = (req) => {
    return {
        user: req.session.user,
        queryParams: req.context.get("queryParams"),
        pagination: req.context.get("pagination"),
        formatDate: (date) => {
            return dtFormatter.format(date)
        }
    }
}



module.exports = {
    viewAttrs
}