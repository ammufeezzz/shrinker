import express from "express";
import bodyParser from "body-parser";
import { nanoid } from 'nanoid'; 
import pg from "pg";
import env from "dotenv"

;


const app = express();
const port = 3000;

env.config();

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  });

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


const BASE_URL = 'http://localhost:3000'; 

app.get("/",(req,res)=>{
    res.render("index.ejs",{shortUrl:null})
})

async function checkVisisted(link){
    const result=await db.query("SELECT short_url FROM shrinker WHERE original_url=$1",[link])
    if(result.rows.length!==0){
        return result.rows[0].short_url
    }else{
        return null
    }
}

async function shortcheck(link) {
    const result=await db.query("SELECT short_url FROM shrinker WHERE short_url=$1",[link])
    if(result.rows.length!==0){
        return false
    }else{
        return true
    }
    
}



app.post("/shorten",async (req,res)=>{

    const user=req.body.longUrl
    const manual_user=req.body.customShortUrl
    try{
        const short=await checkVisisted(user)
        //checks for customurl
        if(manual_user){
            //cheks if customurl is in use or no
            if(await shortcheck(manual_user)){
                //checks if the original_link is there, if there it updates to the custom one.
                if(short){
                    await db.query("UPDATE shrinker SET short_url=$1 WHERE original_url=$2",[manual_user,user])
                    return res.render("index.ejs",{shortUrl:manual_user})

                }
                //else it links the custom one with the original url
                await db.query("INSERT INTO shrinker (original_url, short_url) VALUES($1, $2)", [user, manual_user]);
                return res.render("index.ejs", { shortUrl: manual_user });
            //return an error if it is already in use
            }else{
                return res.status(400).send("Custom URL already in Use")
            }
        }
        //checks if the url is already in the db and user does not input any custom url.
        if(short){
            return res.render("index.ejs", { shortUrl: short });

        }

        //generates a random url for the user
        const shortened=nanoid(5)
        const short_url=`${BASE_URL}/${shortened}`
        await db.query("INSERT INTO shrinker (original_url,short_url) VALUES($1,$2)",[user,short_url])
        res.render("index.ejs",{shortUrl:short_url})
    

    }catch(error){
        console.error("Error shortening URL:", error);
        res.status(500).send("Internal Server Error");
    }


})
//redirects the user to the original website using the shortened 
app.get("/:shortURL",async (req,res)=>{
    const user_click=req.params.shortURL
    const result=await db.query("SELECT original_url FROM shrinker WHERE short_url=$1",[`${BASE_URL}/${user_click}`])
    if (result.rows.length > 0) {
        const originalUrl = result.rows[0].original_url;
        res.redirect(originalUrl); 
    } else {
        res.status(404).send("URL not found"); 
    }
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});