import API from "./api";


export async function getGenres(){

    const response = await API.get(
        "/movies/genres",
        {
            withCredentials:true,
        }
    );
    console.log("GENRES RESPONSE:", response.data);


    return response.data.data;

}