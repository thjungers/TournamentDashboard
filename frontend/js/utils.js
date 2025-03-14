export function equals(obj1, obj2) {
    for (const key in obj1) {
        if (obj1.hasOwnProperty(key)) {
            if (obj1[key] != obj2[key])
                return false
        }
    }
    return true
}