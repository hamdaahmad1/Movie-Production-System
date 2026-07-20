import API from "./api";


export async function getGenres(){

    const response = await API.get(
        "/movies/genres",
        {
            withCredentials:true,
        }
    );


    return response.data;

}