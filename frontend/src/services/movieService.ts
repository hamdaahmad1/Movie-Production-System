import { Movie } from "@/types/movie";
const API ="http://localhost:3001/movies";

export async function getMovies(){

    const res = await fetch(API,{
        cache:"no-store",
    });
    return res.json();
}

export async function getMovie(id:number){

    const res = await fetch(`${API}/${id}`)
    return res.json();
}

export async function createMovie(movie:Omit<Movie,"id">)
{
    await fetch(API, { 
        method:"POST",

        headers:{
            "Content-Type":"application/json",

        },
        body : JSON.stringify(movie)
    })
}

export async function updateMovie(id:number, movie:Omit<Movie,"id">)
{
    await fetch (`${API}/${id}`, {
        method: "PUT",
        headers:{
            "Content-Type":"application/json",

        },
        body: JSON.stringify(movie),

    })


}

export async function deleteMovie(id:number)
{
    await fetch (`${API}/${id}`,{
        method: "DELETE"
    })
    
}





