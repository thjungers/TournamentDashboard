export async function fetchData() {
    return await fetch("https://sportardent.eu.pythonanywhere.com/")
        .then(response => response.json())
        .catch(console.error)
}