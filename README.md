**PS**:Havent completely finished was drooled in almost completing Fast-Type, just need a loginn page, and a stats pagE<br>

**Stack Used**: EJS,CSS,JS,EXPRESS,NODE,POSTGRES <br>

**How to get started**
- Node.js
- PostgreSQL

**Clone the Repo** <br>

git clone https://github.com/yourusername/shrinker.git <br>

cd shrinker

1**Install dependencies**:

npm i 

2)**Setup the DB**:

- Create a new PostgreSQL database.
- Update your database connection settings in the backend JavaScript file (make sure to provide the necessary credentials).
- Create the required tables in your database. You can use the following SQL command as a reference:

CREATE TABLE shrinker (
    id SERIAL PRIMARY KEY,              
    original_url TEXT NOT NULL,         
    short_url VARCHAR(10) UNIQUE NOT NULL);

3)**Start the Application**:<br>

node/nodemon index.js

**Landing Page**

![image](https://github.com/user-attachments/assets/cbef3c22-b777-442e-bd50-14bf0d0cb9ac)

  

