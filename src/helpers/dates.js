/**
 * @description date object --> "5/07 3:45 PM"
 */
const simpleDateString = (date) => {
    const monthNum = date.getMonth() + 1;
    const dateNum = date.getDate();

    const hour = date.getHours() % 12;
    const minutes = date.getMinutes();

    const halfMarker = (date.getHours() > 11) ? "PM" : "AM";

    const minutesString = (minutes.toString().length === 2) ? minutes.toString() : `0${minutes.toString()}`;
    const dateString = (dateNum.toString().length === 2) ? dateNum.toString() : `0${dateNum.toString()}`;

    const fullString = `${monthNum}/${dateString} ${hour}:${minutesString} ${halfMarker}`;

    return fullString;
    
}

module.exports = {
    simpleDateString
}