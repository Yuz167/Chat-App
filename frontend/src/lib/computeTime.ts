export const computeTime = (messageDate:string) => {
    const currentTime = new Date()
    const diffMs = currentTime.getTime() - new Date(messageDate).getTime()

    const sec = diffMs / 1000
    const mins = sec / 60
    const hrs = mins / 60
    const days = hrs / 24
    const yrs = days / 365

    if(yrs > 1){
        return `${Math.floor(yrs)} ${Math.floor(yrs) > 1 ? 'years' : 'year'} ago`
    }
    if(days > 1){
        return `${Math.floor(days)} ${Math.floor(days) > 1 ? 'days' : 'day'} ago`
    }
    if(hrs > 1){
        return `${Math.floor(hrs)} ${Math.floor(hrs) > 1 ? 'hours' : 'hour'} ago`
    }
    if(mins > 1){
        return `${Math.floor(mins)} ${Math.floor(mins) > 1 ? 'minutes' : 'minute'} ago`
    }
    if(Math.floor(sec) < 2){
        return 'just now'
    }
    return `${Math.floor(sec)} seconds ago`
}